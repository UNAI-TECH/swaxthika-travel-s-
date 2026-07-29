import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  MOCK_TEMPLES,
  MOCK_LIVE_CROWD,
  MOCK_FESTIVALS,
  MOCK_PURANA_STORIES,
  MOCK_JOURNALS,
  MOCK_SEVAS,
  MOCK_YATRA_STOPS
} from "./src/data/mockData";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API Client lazily/safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory store for user-submitted journals and bookings
let userJournals = [...MOCK_JOURNALS];
let userBookings: any[] = [];

// ================= API ROUTES =================

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get Temples with optional filtering
app.get("/api/temples", (req, res) => {
  const { query, state, festival } = req.query;
  let results = [...MOCK_TEMPLES];

  if (query && typeof query === "string" && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.deity.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.specialty.toLowerCase().includes(q)
    );
  }

  if (state && typeof state === "string" && state !== "All States") {
    results = results.filter((t) => t.state === state);
  }

  res.json({ temples: results });
});

// Live Crowd Status
app.get("/api/live-crowd", (req, res) => {
  res.json({ liveCrowd: MOCK_LIVE_CROWD });
});

// Festival Calendar
app.get("/api/festivals", (req, res) => {
  res.json({ festivals: MOCK_FESTIVALS });
});

// Sthala Purana Stories
app.get("/api/puranas", (req, res) => {
  res.json({ puranaStories: MOCK_PURANA_STORIES });
});

// Seva Options
app.get("/api/sevas", (req, res) => {
  res.json({ sevas: MOCK_SEVAS });
});

// Book a Seva / Archana
app.post("/api/book-seva", (req, res) => {
  const { templeName, sevaName, devoteeName, phone, date, numberOfDevotees, totalAmount, specialWishes } = req.body;

  if (!devoteeName || !phone || !date) {
    return res.status(400).json({ error: "Missing required booking details (name, phone, date)" });
  }

  const bookingId = "SWX-" + Math.floor(100000 + Math.random() * 900000);
  const bookingRecord = {
    bookingId,
    templeName,
    sevaName,
    devoteeName,
    phone,
    date,
    numberOfDevotees: numberOfDevotees || 1,
    totalAmount: totalAmount || 300,
    specialWishes: specialWishes || "",
    status: "CONFIRMED",
    qrCodePlaceholder: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}`,
    createdAt: new Date().toISOString()
  };

  userBookings.push(bookingRecord);
  res.json({ success: true, booking: bookingRecord });
});

// Community Yatra Journals
app.get("/api/journals", (req, res) => {
  res.json({ journals: userJournals });
});

app.post("/api/journals", (req, res) => {
  const { authorName, templeVisited, rating, title, content, tipsForPilgrims } = req.body;

  if (!authorName || !title || !content) {
    return res.status(400).json({ error: "Author name, title, and content are required." });
  }

  const newJournal = {
    id: "journal-" + Date.now(),
    authorName,
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-0GIytrUgSEfQqv7_uA3VGBMB7gs-tFhCHM3JLSsr6Oc6A2SFwqULVggVGscMxoPeJ1jY6vFXXfGXpxas0hln5dtc16cW4wARjrOz4QAx9bwus394Favi5DfiJYzibAkGt_JzN1OFzFkzcf_sQyAb4a_uHrJ_gj3OOGdd2yu_p1pPDVZAOYpu5kMrSwF5rGBjS2mpEuiZWdEU23SJISCiZkZvqkIO_b9u2UCyUxllqnePQNJWCuw",
    templeVisited: templeVisited || "Sacred Temple Yatra",
    dateVisited: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    rating: Number(rating) || 5,
    title,
    content,
    tipsForPilgrims: tipsForPilgrims || "",
    images: [],
    likesCount: 1
  };

  userJournals.unshift(newJournal);
  res.json({ success: true, journal: newJournal });
});

// AI Yatra Planner Endpoint
app.post("/api/ai-plan-yatra", async (req, res) => {
  const { startingCity, durationDays, preferredState, travelerType, specialRequirements } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    // Fallback if API key is not present
    return res.json({
      title: `Personalized ${durationDays || 3}-Day Divine Yatra from ${startingCity || "Chennai"}`,
      summary: `A carefully curated pilgrimage focusing on prominent temples in ${preferredState || "Tamil Nadu & Andhra Pradesh"}, optimized for ${travelerType || "family"} travel with minimal waiting time.`,
      stops: MOCK_YATRA_STOPS,
      auspiciousTimings: "Morning Suprabhatam (05:00 AM - 07:00 AM) and Evening Deeparadhana (06:30 PM - 08:00 PM) are recommended.",
      travelTips: [
        "Pre-book Special Entry e-tickets for Tirupati Balaji to save 3-4 hours.",
        "Wear comfortable traditional cotton clothing.",
        "Avail wheelchair and golf cart assistance for seniors at temple entrances."
      ]
    });
  }

  try {
    const prompt = `You are Swaxthika Travel's AI Devotional Pilgrimage Advisor & Panchangam Master.
Design a highly detailed, auspicious yatra (pilgrimage) itinerary based on:
- Starting Location: ${startingCity || "Chennai"}
- Duration: ${durationDays || 3} Days
- Preferred Region/State: ${preferredState || "South India"}
- Traveler Type: ${travelerType || "Family with seniors"}
- Special Notes/Requests: ${specialRequirements || "None"}

Respond strictly with valid JSON with the following structure:
{
  "title": "Short poetic title for the yatra",
  "summary": "Inspiring 2-3 sentence overview of the spiritual journey",
  "stops": [
    {
      "id": 1,
      "name": "Temple Name",
      "city": "City, State",
      "description": "Spiritual significance and key highlight",
      "recommendedDuration": "e.g., 1 Day / 3 Hours"
    }
  ],
  "auspiciousTimings": "Panchangam guidance on best Brahma Muhurtham & Darshan timings",
  "travelTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Gemini Yatra Planner error:", err);
    res.json({
      title: `${durationDays || 3}-Day Sacred Yatra Itinerary`,
      summary: `A blessed pilgrimage route designed for seamless temple darshans and serene travel.`,
      stops: MOCK_YATRA_STOPS,
      auspiciousTimings: "Brahma Muhurtham (04:30 AM - 06:00 AM) is most auspicious for peaceful darshan.",
      travelTips: [
        "Carry government photo IDs for sanctum verification.",
        "Keep hydrated and follow temple dress code standards."
      ]
    });
  }
});

// AI Sthala Purana Storyteller
app.post("/api/ai-purana", async (req, res) => {
  const { templeName } = req.body;
  const ai = getGeminiClient();

  if (!ai || !templeName) {
    const defaultStory = MOCK_PURANA_STORIES.find((s) =>
      s.templeName.toLowerCase().includes((templeName || "").toLowerCase())
    ) || MOCK_PURANA_STORIES[0];

    return res.json({ story: defaultStory });
  }

  try {
    const prompt = `Narrate the authentic Sthala Purana (divine legend and history) for ${templeName}.
Provide a deeply devotional, authentic, and inspiring narration including:
1. Origin story and ancient legends from Puranic literature
2. Significance of the deity and architecture
3. Spiritual blessings received by pilgrims

Format as JSON:
{
  "id": "story-ai",
  "templeName": "${templeName}",
  "title": "Poetic Title for Sthala Purana",
  "summary": "2 sentence summary",
  "fullStory": "Detailed 4-5 paragraph authentic Purana story",
  "significance": "Key spiritual significance",
  "associatedDeity": "Main Deity"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const storyData = JSON.parse(response.text || "{}");
    storyData.image = MOCK_PURANA_STORIES[0].image;
    res.json({ story: storyData });
  } catch (err) {
    console.error("Gemini Purana error:", err);
    res.json({ story: MOCK_PURANA_STORIES[0] });
  }
});

// ================= VITE MIDDLEWARE & SERVER START =================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Swaxthika Travel Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
