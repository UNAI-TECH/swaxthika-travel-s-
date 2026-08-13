import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Initialize Supabase Client with fallbacks matching frontend config
const supabaseUrl = process.env.SUPABASE_URL || "https://mduklqhzuxuopyxjbmsg.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdWtscWh6dXh1b3B5eGpibXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MzY1NjMsImV4cCI6MjEwMTQxMjU2M30.s7UqRWfDZspZWIKQYWG_V3sJvErbFl-8N__lqmM0VnI";

let supabase: ReturnType<typeof createClient> | null = null;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (err: any) {
  console.error("Failed to initialize Supabase client:", err.message);
}

// Map PostgreSQL snake_case fields back to TypeScript camelCase interfaces
function mapPackageFromDB(p: any) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    highlights: p.highlights || [],
    itinerary: p.itinerary || [],
    duration: p.duration,
    pricePerSeat: Number(p.price_per_seat),
    image: p.image,
    category: p.category,
    inclusions: p.inclusions || [],
    exclusions: p.exclusions || [],
    availableDates: p.available_dates || [],
    isActive: p.is_active,
    createdAt: p.created_at,
    addons: p.addons || [],
  };
}

function mapBookingFromDB(b: any) {
  return {
    bookingId: b.booking_id,
    uniqueCode: b.unique_code,
    packageId: b.package_id,
    packageName: b.package_name,
    tourDateId: b.tour_date_id,
    tourDate: b.tour_date,
    userName: b.user_name,
    userEmail: b.user_email,
    userPhone: b.user_phone,
    numberOfSeats: Number(b.number_of_seats),
    totalAmount: Number(b.total_amount),
    status: b.status,
    qrCodeUrl: b.qr_code_url,
    createdAt: b.created_at,
    selectedAddons: b.selected_addons || [],
  };
}

// Generate a random 6-character unique code
function generateUniqueCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Simple path-based router for the Vercel serverless function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (!supabase) {
    return res.status(500).json({
      error:
        "Supabase client is not initialized. Check SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
    });
  }

  // Extract the path after /api/
  const url = req.url || "";
  const apiPath = url.replace(/^\/api/, "").split("?")[0];

  try {
    // =================== USER-FACING ROUTES ===================

    // GET /api/packages
    if (apiPath === "/packages" && req.method === "GET") {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return res.status(200).json({ packages: (data || []).map(mapPackageFromDB) });
    }

    // GET /api/packages/:id
    const pkgMatch = apiPath.match(/^\/packages\/([^/]+)$/);
    if (pkgMatch && req.method === "GET") {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("id", pkgMatch[1])
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({ error: "Package not found" });
        }
        throw error;
      }
      return res.status(200).json({ package: mapPackageFromDB(data) });
    }

    // POST /api/book-package
    if (apiPath === "/book-package" && req.method === "POST") {
      const { packageId, tourDateId, userName, userEmail, userPhone, numberOfSeats, totalAmount, selectedAddons } = req.body;

      if (!packageId || !tourDateId || !userName || !userEmail || !userPhone || !numberOfSeats) {
        return res.status(400).json({ error: "Missing required booking fields" });
      }

      const { data: pkg, error: fetchErr } = await supabase
        .from("packages")
        .select("*")
        .eq("id", packageId)
        .single();

      if (fetchErr) {
        if (fetchErr.code === "PGRST116") return res.status(404).json({ error: "Package not found" });
        throw fetchErr;
      }

      const dates = (pkg.available_dates || []) as any[];
      const dateIndex = dates.findIndex((d: any) => d.id === tourDateId);
      if (dateIndex === -1) {
        return res.status(404).json({ error: "Tour date not found" });
      }

      const tourDate = dates[dateIndex];
      const numSeats = Number(numberOfSeats);
      if (tourDate.bookedSeats + numSeats > tourDate.totalSeats) {
        return res.status(400).json({ error: "Not enough seats available for this date" });
      }

      tourDate.bookedSeats += numSeats;
      if (tourDate.bookedSeats >= tourDate.totalSeats) {
        tourDate.status = "sold-out";
      } else if (tourDate.totalSeats - tourDate.bookedSeats <= 5) {
        tourDate.status = "filling-fast";
      } else {
        tourDate.status = "available";
      }

      const { error: updatePkgErr } = await supabase
        .from("packages")
        .update({ available_dates: dates })
        .eq("id", packageId);

      if (updatePkgErr) throw updatePkgErr;

      const bookingId = "SWX-" + Math.floor(100000 + Math.random() * 900000);
      const uniqueCode = generateUniqueCode();

      const newBooking = {
        booking_id: bookingId,
        unique_code: uniqueCode,
        package_id: packageId,
        package_name: pkg.name,
        tour_date_id: tourDateId,
        tour_date: tourDate.date,
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        number_of_seats: numSeats,
        total_amount: Number(totalAmount),
        status: "Confirmed",
        qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}`,
        selected_addons: selectedAddons || [],
      };

      const { data: bookingData, error: insertErr } = await supabase
        .from("bookings")
        .insert([newBooking])
        .select()
        .single();

      if (insertErr) throw insertErr;
      return res.status(200).json({ success: true, booking: mapBookingFromDB(bookingData) });
    }

    // =================== ADMIN ROUTES ===================

    // POST /api/admin/login
    if (apiPath === "/admin/login" && req.method === "POST") {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      let userId = "";
      let userEmail = "";
      let userName = "";

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!authError && authData.user) {
        userId = authData.user.id;
        userEmail = authData.user.email || email;
      } else {
        if (email === "admin@swaxthika.com" && password === "swaxthika2026") {
          const { data: dbAdmin, error: dbErr } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("email", email)
            .single();

          if (!dbErr && dbAdmin && dbAdmin.role === "admin") {
            userId = dbAdmin.id;
            userEmail = dbAdmin.email;
            userName = dbAdmin.full_name;
          } else {
            return res.status(401).json({ error: authError ? authError.message : "Invalid credentials" });
          }
        } else {
          return res.status(401).json({ error: authError ? authError.message : "Invalid credentials" });
        }
      }

      const { data: profile, error: profileErr } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("email", userEmail)
        .single();

      if (profileErr || !profile) {
        return res.status(403).json({ error: "Unauthorized: User profile role could not be verified." });
      }

      if (profile.role !== "admin") {
        return res.status(403).json({ error: "Access Denied: You do not have administrator privileges." });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.full_name || userName || "Admin",
          role: profile.role,
        },
      });
    }

    // POST /api/admin/upload-image  (disabled in serverless — requires multer)
    if (apiPath === "/admin/upload-image" && req.method === "POST") {
      return res.status(501).json({ error: "Image upload is not supported in serverless mode. Use direct Supabase Storage upload from the client." });
    }

    // GET /api/admin/packages
    if (apiPath === "/admin/packages" && req.method === "GET") {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return res.status(200).json({ packages: (data || []).map(mapPackageFromDB) });
    }

    // POST /api/admin/packages
    if (apiPath === "/admin/packages" && req.method === "POST") {
      const payload = {
        id: "pkg-" + Date.now(),
        name: req.body.name || "Untitled Package",
        description: req.body.description || "",
        highlights: req.body.highlights || [],
        itinerary: req.body.itinerary || [],
        duration: req.body.duration || "1 Day",
        price_per_seat: Number(req.body.pricePerSeat) || 0,
        image: req.body.image || "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
        category: req.body.category || "General",
        inclusions: req.body.inclusions || [],
        exclusions: req.body.exclusions || [],
        available_dates: req.body.availableDates || [],
        is_active: req.body.isActive !== undefined ? req.body.isActive : true,
        addons: req.body.addons || [],
      };

      const { data, error } = await supabase
        .from("packages")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, package: mapPackageFromDB(data) });
    }

    // PUT /api/admin/packages/:id
    const adminPkgUpdate = apiPath.match(/^\/admin\/packages\/([^/]+)$/);
    if (adminPkgUpdate && req.method === "PUT") {
      const id = adminPkgUpdate[1];
      const payload: any = {};

      if (req.body.name !== undefined) payload.name = req.body.name;
      if (req.body.description !== undefined) payload.description = req.body.description;
      if (req.body.duration !== undefined) payload.duration = req.body.duration;
      if (req.body.pricePerSeat !== undefined) payload.price_per_seat = Number(req.body.pricePerSeat);
      if (req.body.image !== undefined) payload.image = req.body.image;
      if (req.body.category !== undefined) payload.category = req.body.category;
      if (req.body.highlights !== undefined) payload.highlights = req.body.highlights;
      if (req.body.inclusions !== undefined) payload.inclusions = req.body.inclusions;
      if (req.body.exclusions !== undefined) payload.exclusions = req.body.exclusions;
      if (req.body.availableDates !== undefined) payload.available_dates = req.body.availableDates;
      if (req.body.isActive !== undefined) payload.is_active = req.body.isActive;
      if (req.body.addons !== undefined) payload.addons = req.body.addons;

      const { data, error } = await supabase
        .from("packages")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, package: mapPackageFromDB(data) });
    }

    // DELETE /api/admin/packages/:id
    const adminPkgDelete = apiPath.match(/^\/admin\/packages\/([^/]+)$/);
    if (adminPkgDelete && req.method === "DELETE") {
      const id = adminPkgDelete[1];
      const { error } = await supabase.from("packages").delete().eq("id", id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    // POST /api/admin/packages/:id/dates
    const addDateMatch = apiPath.match(/^\/admin\/packages\/([^/]+)\/dates$/);
    if (addDateMatch && req.method === "POST") {
      const id = addDateMatch[1];
      const { date, totalSeats } = req.body;

      if (!date || !totalSeats) {
        return res.status(400).json({ error: "Date and totalSeats are required" });
      }

      const { data: pkg, error: fetchErr } = await supabase
        .from("packages")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchErr) throw fetchErr;

      const dates = (pkg.available_dates || []) as any[];
      const newDate = {
        id: "dt-" + Date.now(),
        date,
        totalSeats: Number(totalSeats),
        bookedSeats: 0,
        status: "available",
      };
      dates.push(newDate);

      const { data: updatedPkg, error: updateErr } = await supabase
        .from("packages")
        .update({ available_dates: dates })
        .eq("id", id)
        .select()
        .single();

      if (updateErr) throw updateErr;
      return res.status(200).json({ success: true, package: mapPackageFromDB(updatedPkg) });
    }

    // DELETE /api/admin/packages/:packageId/dates/:dateId
    const deleteDateMatch = apiPath.match(/^\/admin\/packages\/([^/]+)\/dates\/([^/]+)$/);
    if (deleteDateMatch && req.method === "DELETE") {
      const [, packageId, dateId] = deleteDateMatch;
      const { data: pkg, error: fetchErr } = await supabase
        .from("packages")
        .select("*")
        .eq("id", packageId)
        .single();

      if (fetchErr) throw fetchErr;

      const dates = (pkg.available_dates || []) as any[];
      const dateIndex = dates.findIndex((d: any) => d.id === dateId);
      if (dateIndex !== -1) {
        dates.splice(dateIndex, 1);
      }

      const { data: updatedPkg, error: updateErr } = await supabase
        .from("packages")
        .update({ available_dates: dates })
        .eq("id", packageId)
        .select()
        .single();

      if (updateErr) throw updateErr;
      return res.status(200).json({ success: true, package: mapPackageFromDB(updatedPkg) });
    }

    // GET /api/admin/bookings
    if (apiPath === "/admin/bookings" && req.method === "GET") {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return res.status(200).json({ bookings: (data || []).map(mapBookingFromDB) });
    }

    // POST /api/admin/verify-booking
    if (apiPath === "/admin/verify-booking" && req.method === "POST") {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Verification code is required" });
      }

      const cleanCode = code.trim().toUpperCase();

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .or(`booking_id.eq.${code},unique_code.eq.${cleanCode}`);

      if (error) throw error;

      if (data && data.length > 0) {
        return res.status(200).json({ success: true, booking: mapBookingFromDB(data[0]) });
      } else {
        return res.status(404).json({ error: "No booking found with this code" });
      }
    }

    // POST /api/admin/update-booking-status
    if (apiPath === "/admin/update-booking-status" && req.method === "POST") {
      const { bookingId, status } = req.body;
      const { data, error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("booking_id", bookingId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, booking: mapBookingFromDB(data) });
    }

    // No route matched
    return res.status(404).json({ error: "API route not found" });
  } catch (err: any) {
    console.error("API Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
