import express from "express";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import multer from "multer";
import { DevotionalPackage, Booking, TourDate } from "./src/types";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Supabase Client with fallbacks matching frontend config
const supabaseUrl = process.env.SUPABASE_URL || "https://mduklqhzuxuopyxjbmsg.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdWtscWh6dXh1b3B5eGpibXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MzY1NjMsImV4cCI6MjEwMTQxMjU2M30.s7UqRWfDZspZWIKQYWG_V3sJvErbFl-8N__lqmM0VnI";

let supabase: ReturnType<typeof createClient> | null = null;
try {
  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project-id")) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn("====================================================================");
    console.warn("⚠️  WARNING: Supabase URL/Key is not configured or is a placeholder.");
    console.warn("====================================================================");
  }
} catch (err: any) {
  console.error("Failed to initialize Supabase client:", err.message);
}

// Middleware to ensure Supabase client is initialized
app.use("/api", (req, res, next) => {
  if (!supabase) {
    return res.status(500).json({
      error: "Supabase client is not initialized. Please verify SUPABASE_URL and SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY environment variables."
    });
  }
  next();
});

// Helpers to generate a random 6-character unique code
function generateUniqueCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Map PostgreSQL snake_case fields back to TypeScript camelCase interfaces
function mapPackageFromDB(p: any): DevotionalPackage {
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
    addons: p.addons || []
  };
}

function mapBookingFromDB(b: any): Booking {
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
    selectedAddons: b.selected_addons || []
  };
}

// ================= USER-FACING API ROUTES =================

// Get all active packages
app.get("/api/packages", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ packages: (data || []).map(mapPackageFromDB) });
  } catch (err: any) {
    console.error("Fetch packages error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get package by ID
app.get("/api/packages/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Package not found" });
      }
      throw error;
    }
    res.json({ package: mapPackageFromDB(data) });
  } catch (err: any) {
    console.error("Fetch package error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Book a package (checks seats and writes to bookings)
app.post("/api/book-package", async (req, res) => {
  const { packageId, tourDateId, userName, userEmail, userPhone, numberOfSeats, totalAmount, selectedAddons } = req.body;

  if (!packageId || !tourDateId || !userName || !userEmail || !userPhone || !numberOfSeats) {
    return res.status(400).json({ error: "Missing required booking fields" });
  }

  try {
    // 1. Fetch package details to check seat availability
    const { data: pkg, error: fetchErr } = await supabase
      .from("packages")
      .select("*")
      .eq("id", packageId)
      .single();

    if (fetchErr) {
      if (fetchErr.code === "PGRST116") return res.status(404).json({ error: "Package not found" });
      throw fetchErr;
    }

    const dates = (pkg.available_dates || []) as TourDate[];
    const dateIndex = dates.findIndex((d) => d.id === tourDateId);
    if (dateIndex === -1) {
      return res.status(404).json({ error: "Tour date not found" });
    }

    const tourDate = dates[dateIndex];
    const numSeats = Number(numberOfSeats);
    if (tourDate.bookedSeats + numSeats > tourDate.totalSeats) {
      return res.status(400).json({ error: "Not enough seats available for this date" });
    }

    // 2. Update seat counts
    tourDate.bookedSeats += numSeats;
    if (tourDate.bookedSeats >= tourDate.totalSeats) {
      tourDate.status = "sold-out";
    } else if (tourDate.totalSeats - tourDate.bookedSeats <= 5) {
      tourDate.status = "filling-fast";
    } else {
      tourDate.status = "available";
    }

    // Save back updated dates array
    const { error: updatePkgErr } = await supabase
      .from("packages")
      .update({ available_dates: dates })
      .eq("id", packageId);

    if (updatePkgErr) throw updatePkgErr;

    // 3. Create booking record
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
      selected_addons: selectedAddons || []
    };

    const { data: bookingData, error: insertErr } = await supabase
      .from("bookings")
      .insert([newBooking])
      .select()
      .single();

    if (insertErr) throw insertErr;

    res.json({ success: true, booking: mapBookingFromDB(bookingData) });
  } catch (err: any) {
    console.error("Booking error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN CONSOLE API ROUTES =================

// Admin Login authentication via Supabase Auth & role check in user_profiles
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // 1. Try signing in with Supabase Auth
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
      // Fallback: If auth fails, check if credentials match the master admin credentials and user exists in DB
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

    // 2. Double check user_profiles to ensure this user has the 'admin' role
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

    res.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.full_name || userName || "Admin",
        role: profile.role,
      },
    });
  } catch (err: any) {
    console.error("Admin login API error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Configure multer storage in memory
const upload = multer({ storage: multer.memoryStorage() });

// Upload package cover image to Supabase bucket
app.post("/api/admin/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  try {
    const file = req.file;
    const fileExt = path.extname(file.originalname) || ".jpg";
    const fileName = `package-${Date.now()}${fileExt}`;

    // 1. Try uploading to 'packages' bucket in Supabase storage
    let { data, error } = await supabase.storage
      .from("packages")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      // If the bucket doesn't exist, try to create it and then re-upload
      if (error.message.includes("not found") || error.message.includes("does not exist") || (error as any).status === 404) {
        console.log("Bucket 'packages' not found. Attempting to create bucket...");
        const { error: createBucketError } = await supabase.storage.createBucket("packages", {
          public: true
        });
        if (createBucketError) {
          throw new Error(`Failed to create packages storage bucket: ${createBucketError.message}`);
        }
        
        // Retry upload
        const retryResult = await supabase.storage
          .from("packages")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: true
          });
        if (retryResult.error) throw retryResult.error;
      } else {
        throw error;
      }
    }

    // 2. Get public URL
    const { data: urlData } = supabase.storage
      .from("packages")
      .getPublicUrl(fileName);

    res.json({ success: true, url: urlData.publicUrl });
  } catch (err: any) {
    console.error("Upload image error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all packages (including inactive)
app.get("/api/admin/packages", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ packages: (data || []).map(mapPackageFromDB) });
  } catch (err: any) {
    console.error("Admin fetch packages error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create new package
app.post("/api/admin/packages", async (req, res) => {
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
    addons: req.body.addons || []
  };

  try {
    const { data, error } = await supabase
      .from("packages")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, package: mapPackageFromDB(data) });
  } catch (err: any) {
    console.error("Admin create package error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update package
app.put("/api/admin/packages/:id", async (req, res) => {
  const { id } = req.params;
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

  try {
    const { data, error } = await supabase
      .from("packages")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, package: mapPackageFromDB(data) });
  } catch (err: any) {
    console.error("Admin update package error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete package
app.delete("/api/admin/packages/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from("packages")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error("Admin delete package error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add tour dates to package
app.post("/api/admin/packages/:id/dates", async (req, res) => {
  const { id } = req.params;
  const { date, totalSeats } = req.body;

  if (!date || !totalSeats) {
    return res.status(400).json({ error: "Date and totalSeats are required" });
  }

  try {
    const { data: pkg, error: fetchErr } = await supabase
      .from("packages")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr) throw fetchErr;

    const dates = (pkg.available_dates || []) as TourDate[];
    const newDate: TourDate = {
      id: "dt-" + Date.now(),
      date,
      totalSeats: Number(totalSeats),
      bookedSeats: 0,
      status: "available"
    };
    dates.push(newDate);

    const { data: updatedPkg, error: updateErr } = await supabase
      .from("packages")
      .update({ available_dates: dates })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    res.json({ success: true, package: mapPackageFromDB(updatedPkg) });
  } catch (err: any) {
    console.error("Admin add date error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete tour date from package
app.delete("/api/admin/packages/:packageId/dates/:dateId", async (req, res) => {
  const { packageId, dateId } = req.params;
  try {
    const { data: pkg, error: fetchErr } = await supabase
      .from("packages")
      .select("*")
      .eq("id", packageId)
      .single();

    if (fetchErr) throw fetchErr;

    const dates = (pkg.available_dates || []) as TourDate[];
    const dateIndex = dates.findIndex((d) => d.id === dateId);
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

    res.json({ success: true, package: mapPackageFromDB(updatedPkg) });
  } catch (err: any) {
    console.error("Admin delete date error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings
app.get("/api/admin/bookings", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ bookings: (data || []).map(mapBookingFromDB) });
  } catch (err: any) {
    console.error("Admin fetch bookings error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Verify booking by code or ID
app.post("/api/admin/verify-booking", async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Verification code is required" });
  }

  const cleanCode = code.trim().toUpperCase();

  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .or(`booking_id.eq.${code},unique_code.eq.${cleanCode}`);

    if (error) throw error;

    if (data && data.length > 0) {
      res.json({ success: true, booking: mapBookingFromDB(data[0]) });
    } else {
      res.status(404).json({ error: "No booking found with this code" });
    }
  } catch (err: any) {
    console.error("Admin verify booking error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update booking status
app.post("/api/admin/update-booking-status", async (req, res) => {
  const { bookingId, status } = req.body;
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("booking_id", bookingId)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, booking: mapBookingFromDB(data) });
  } catch (err: any) {
    console.error("Admin update booking status error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ================= VITE MIDDLEWARE & SERVER START =================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Use a variable to prevent Vercel's bundler from statically analyzing and bundling Vite
    const viteModule = "vite";
    const { createServer: createViteServer } = await import(viteModule);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Swaxthika Travel Server] Running on http://0.0.0.0:${PORT}`);
    });
  }
}

// Only start the full server (Vite dev middleware / static file serving / listen)
// when running as a standalone process. On Vercel, the Express app is used
// directly as a serverless function handler via api/index.ts.
if (!process.env.VERCEL) {
  startServer();
}

export default app;
