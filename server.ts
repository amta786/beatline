import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Default seed data for News
const seedArticles = [
  {
    id: "art-1",
    title: "Chappell Roan Unveils Secret Summer Club Dates & Next Album Teasers",
    subtitle: "The breakthrough pop phenomenom triggers fan frenzy with an intimate underground cabaret performance announce.",
    category: "Pop",
    content: [
      "In a surprise announcement during an unannounced DJ set in Brooklyn, pop sensation Chappell Roan revealed a series of extremely intimate cabaret-style club shows scheduled across the country this summer.",
      "Dubbed the 'Underground Velvet Tour,' the singer-songwriter intends to return to small, 200-capacity venues to test out raw material for her highly anticipated second studio album, the follow-up to her smash success 'The Rise and Fall of a Midwest Princess.'",
      "Roan elaborated in a brief newsletter post shortly after, hinting that the new music leans even heavier into theatrical synth-pop and disco camp. 'We are building a world that feels like a forgotten 1970s variety show in Berlin, but fueled by digital drum machines,' she wrote.",
      "As expected, music industry analysts predict demand for tickets will reach unprecedented highs. Industry insiders claim that anti-scalping digital measures will be tightly enforced, including mandatory ID check matchings for all purchasers."
    ],
    author: "Elena Rostov",
    publishedAt: "2026-06-12T14:30:00Z",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop",
    trending: true,
    views: 12450,
    likes: 852,
    bulletPoints: [
      "Shows will take place in historical cabaret venues and underground clubs to maintain high theatricality.",
      "New material features deep retro analog synths and Berlin disco influences.",
      "Tighter anti-scalping security enforces secondary ID-matching at all gates."
    ],
    comments: [
      { id: "c1", user: "PopVibe99", text: "Securing tickets to this is going to be like winning the lottery, literally!", timestamp: "2026-06-12T15:02:00Z" },
      { id: "c2", user: "VelvetCamp", text: "More camp! More theatrical synths! Yes please!", timestamp: "2026-06-12T15:45:00Z" }
    ]
  },
  {
    id: "art-2",
    title: "Kendrick Lamar Debuts New Hard-Hitting Single 'Taper' Off Upcoming Project",
    subtitle: "The Pulitzer-winning wordsmith delivers complex rhyming schemes and West Coast bounce in surprise midnight drop.",
    category: "Hip-Hop",
    content: [
      "In yet another brilliant stroke of surprise-release strategy, Kendrick Lamar stunned the music scene at midnight with a stellar new standalone audio cut titled 'Taper.'",
      "Accompanied by a stark, black-and-white visual directed by Dave Free, the track features an infectious, slow-slung West Coast G-funk loop layered with complex, syncopated jazz horn stabs.",
      "Lyrically, Lamar addresses themes of historical heritage, legacy preservation, and the shifting dynamics of community leadership in modern hip-hop culture. Critics are already parsing his dense double-entendres and rapid rhythmic shifting.",
      "Industry whispers indicate 'Taper' serves as the second official preview track from a full-length companion project slated for late Autumn, which represents a sonic redirection into experimental street-jazz."
    ],
    author: "Marcus Vance",
    publishedAt: "2026-06-13T02:15:00Z",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop",
    trending: true,
    views: 18900,
    likes: 1420,
    bulletPoints: [
      "Surprise release 'Taper' dropped with visual direction by Dave Free.",
      "Sonic styling shifts back to G-funk rhythms paired with experimental modern street-jazz horns.",
      "A complete full-length landscape companion release is rumored for late mid-autumn."
    ],
    comments: [
      { id: "cx1", user: "RebelSound", text: "The horn sequence around the 2-minute mark is absolutely wizard-level production.", timestamp: "2026-06-13T02:30:00Z" },
      { id: "cx2", user: "CaliKid", text: "The West Coast bounce represents Kendrick in peak form. What a masterpiece.", timestamp: "2026-06-13T03:12:00Z" }
    ]
  },
  {
    id: "art-3",
    title: "The Rise of Analog Retro: How Alternative Rock Acts are Shaping the New Decade's Sonics",
    subtitle: "Ditching laptop plugins for real solid-state tape loops, bands are seeking warmth and chaos in live hardware rigs.",
    category: "Rock",
    content: [
      "For years, standard alternative rock bands have relied heavily on digital modeling amplifiers and micro-sized laptop plugins to produce their recordings. But a significant rebellion is taking shape under the surface.",
      "An increasing cohort of young bands is choosing custom-built solid-state preamps, vintage dynamic consoles, and physical multi-track reel-to-reel tape recorders to handle their final tracking bounces.",
      "The goal is simple: an intentional embrace of structural friction, harmonic warmth, and happy analog accidents. Musicians argue that the perfect grids of digital software suck the organic human rhythm out of rock music.",
      "Producers who have spearheaded this revival state that the response from listeners is palpable. Warm, slightly overdriven low-end frequencies and tape compression glue are hitting listeners in a far more impactful physical way."
    ],
    author: "Sarah Jenkins",
    publishedAt: "2026-06-11T09:00:00Z",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=800&auto=format&fit=crop",
    trending: false,
    views: 7420,
    likes: 310,
    bulletPoints: [
      "Modern alternative rock is experiencing a massive migration away from fully digital modeling software.",
      "Bands use analog multi-track recorders to force organic takes instead of artificial grid alignment.",
      "Vaporous harmonic overtones from real tape saturation provide tactile soundscapes for audiophiles."
    ],
    comments: [
      { id: "c31", user: "VinylDave", text: "True analog warmth cannot be faked. It responds to physical vibrations differently.", timestamp: "2026-06-11T11:00:00Z" }
    ]
  },
  {
    id: "art-4",
    title: "Zach Bryan Partners with Indie Icons for Cinematic Americana Short Film",
    subtitle: "The prolific country writer takes a leap into visual narratives with a collaborative musical narrative.",
    category: "Country",
    content: [
      "Zach Bryan has never been someone who plays by the traditional Nashville handbook, and his latest venture proves once again why he remains one of Country's most distinct iconoclasts.",
      "Bryan has team up with several leading directors and Americana icons to release a 22-minute narrative musical film to accompany his new acoustic suite project, 'Timberline.'",
      "Set against the visual majesty of rural Washington, the short film weaves high-concept, blue-collar drama with raw, live acoustic captures performed around localized, flickering bonfires.",
      "The project showcases guest appearances from legendary alt-folk singers, pushing the emotional density of the songs to rustic limits. Fans are already praising the poetic, rugged nature of this cinematic expansion."
    ],
    author: "Gideon Vance",
    publishedAt: "2026-06-10T16:15:00Z",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
    trending: false,
    views: 9110,
    likes: 428,
    bulletPoints: [
      "Companion 22-minute short film accompanies Zach Bryan's acoustic suite 'Timberline'.",
      "Features live-recorded vocal takes recorded directly in forest campfire locations.",
      "Collaborative cameos solidify his standing among alternative folk elders."
    ],
    comments: []
  },
  {
    id: "art-5",
    title: "Inside Fred again..'s Secret Chicago Multi-Night Warehouse Takeovers",
    subtitle: "The dance master blends intense communal empathy and pounding industrial techno loops in an extraordinary pop-up raid.",
    category: "Electronic",
    content: [
      "Over four intense, humid nights, electronic visionary Fred again.. turned an undisclosed historic meat-packing house in Chicago into the center of the global club music community.",
      "Announced with only a two-hour warning via self-destructing text links, the events saw thousands of passionate attendees rush to experience raw, close-up production blocks with zero barriers.",
      "The sonic atmosphere was an exquisite combination of heart-wrenching vocal hooks, personal voicemail memos, and heavy, warehouse-rocking UK bass cuts. It is a formula that has solidified Fred's legendary status.",
      "Attendees described the shows as feeling less like standard music festivals and far more like intimate, giant emotional cleanses, driven by communal kinetic release."
    ],
    author: "Kai Thorne",
    publishedAt: "2026-06-12T08:50:00Z",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
    trending: true,
    views: 14890,
    likes: 990,
    bulletPoints: [
      "Warehouse events were announced in real-time using text-broadcast alert tags.",
      "The warehouse shows discarded secondary staging barriers for proximity feel.",
      "Sonic tracks combined unreleased atmospheric remixes with classic deep house grooves."
    ],
    comments: []
  }
];

// Default seed data for Charts
const seedHot100 = [
  { rank: 1, lastWeekRank: 1, peakRank: 1, weeksOnChart: 12, title: "Supernova Glow", artist: "Billie Eilish", imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop", genre: "Pop", trend: "flat", bpm: 82, synthMelody: "E4-0.5, G#4-0.5, B4-0.5, E5-1.0, B4-0.5, G#4-0.5" },
  { rank: 2, lastWeekRank: 4, peakRank: 2, weeksOnChart: 5, title: "Taper", artist: "Kendrick Lamar", imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop", genre: "Hip-Hop", trend: "up", bpm: 95, synthMelody: "A3-0.25, C4-0.25, D4-0.5, G4-0.25, D4-0.25, C4-0.5" },
  { rank: 3, lastWeekRank: "NEW", peakRank: 3, weeksOnChart: 1, title: "Underground Cabar", artist: "Chappell Roan", imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop", genre: "Pop", trend: "new", bpm: 120, synthMelody: "C4-0.25, E4-0.25, G4-0.25, C5-0.25, G4-0.25, E4-0.25" },
  { rank: 4, lastWeekRank: 2, peakRank: 2, weeksOnChart: 8, title: "Espresso Shots", artist: "Sabrina Carpenter", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop", genre: "Pop", trend: "down", bpm: 114, synthMelody: "F4-0.5, A4-0.5, C5-0.5, G4-1.0" },
  { rank: 5, lastWeekRank: 3, peakRank: 1, weeksOnChart: 22, title: "Bar Run (Tipsy)", artist: "Shaboozey", imageUrl: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=300&auto=format&fit=crop", genre: "Country", trend: "down", bpm: 130, synthMelody: "G4-0.5, G4-0.5, B4-0.5, D5-0.5, D5-0.5, B4-0.5" },
  { rank: 6, lastWeekRank: 7, peakRank: 6, weeksOnChart: 15, title: "Too Sweet", artist: "Hozier", imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop", genre: "Rock", trend: "up", bpm: 110, synthMelody: "E3-0.5, B3-0.5, E4-0.5, G4-0.5, F#4-0.5, B3-1.0" },
  { rank: 7, lastWeekRank: 6, peakRank: 4, weeksOnChart: 19, title: "Birds of a Feather", artist: "Billie Eilish", imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop", genre: "Pop", trend: "down", bpm: 105, synthMelody: "C4-0.75, D4-0.25, E4-0.5, G4-1.5" },
  { rank: 8, lastWeekRank: 10, peakRank: 8, weeksOnChart: 3, title: "Surreal Warehouse", artist: "Fred again..", imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop", genre: "Electronic", trend: "up", bpm: 128, synthMelody: "A4-0.25, A4-0.25, C5-0.25, E5-0.25, D5-0.5, C5-0.5" },
  { rank: 9, lastWeekRank: 5, peakRank: 5, weeksOnChart: 4, title: "Timberline Bonfire", artist: "Zach Bryan", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop", genre: "Country", trend: "down", bpm: 90, synthMelody: "D3-0.5, A3-0.5, D4-1.0, F#4-0.5, E4-0.5" },
  { rank: 10, lastWeekRank: 8, peakRank: 2, weeksOnChart: 34, title: "Beautiful Things", artist: "Benson Boone", imageUrl: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=300&auto=format&fit=crop", genre: "Pop", trend: "down", bpm: 125, synthMelody: "B3-0.5, D#4-0.5, F#4-0.5, B4-1.0" }
];

const seedBeatline200 = [
  { rank: 1, lastWeekRank: 1, peakRank: 1, weeksOnChart: 6, title: "HIT ME HARD AND SOFT", artist: "Billie Eilish", imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop", genre: "Pop", trend: "flat" },
  { rank: 2, lastWeekRank: 3, peakRank: 1, weeksOnChart: 33, title: "The Rise and Fall of a Midwest Princess", artist: "Chappell Roan", imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop", genre: "Pop", trend: "up" },
  { rank: 3, lastWeekRank: "NEW", peakRank: 3, weeksOnChart: 1, title: "Timberline (Acoustic Suite)", artist: "Zach Bryan", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop", genre: "Country", trend: "new" },
  { rank: 4, lastWeekRank: 2, peakRank: 2, weeksOnChart: 5, title: "Short n' Sweet", artist: "Sabrina Carpenter", imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop", genre: "Pop", trend: "down" },
  { rank: 5, lastWeekRank: 4, peakRank: 4, weeksOnChart: 11, title: "F-1 Trillion", artist: "Post Malone", imageUrl: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=300&auto=format&fit=crop", genre: "Country", trend: "down" },
  { rank: 6, lastWeekRank: 8, peakRank: 6, weeksOnChart: 4, title: "Ten Days", artist: "Fred again..", imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop", genre: "Electronic", trend: "up" }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Store user-generated articles in-memory
  const dynamicArticles = [...seedArticles];

  // Optional server-side lazy initialization helper for Gemini
  let geminiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!geminiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not defined in Secrets.");
      }
      geminiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return geminiClient;
  }

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  // Get all news (includes both seed & generated ones)
  app.get("/api/news", (req, res) => {
    res.json({ success: true, articles: dynamicArticles });
  });

  // Get all charts
  app.get("/api/charts", (req, res) => {
    res.json({
      success: true,
      hot100: seedHot100,
      beatline200: seedBeatline200,
    });
  });

  // Post a user comment directly to memory
  app.post("/api/news/:articleId/comments", (req, res) => {
    const { articleId } = req.params;
    const { user, text } = req.body;

    if (!user || !text) {
      return res.status(400).json({ success: false, error: "Missing name or comment text." });
    }

    const article = dynamicArticles.find((a) => a.id === articleId);
    if (!article) {
      return res.status(404).json({ success: false, error: "Article not found." });
    }

    const newComment = {
      id: `comment-${Date.now()}`,
      user: String(user),
      text: String(text),
      timestamp: new Date().toISOString(),
    };

    article.comments.unshift(newComment);
    res.json({ success: true, comment: newComment });
  });

  // Toggle dynamic like
  app.post("/api/news/:articleId/like", (req, res) => {
    const { articleId } = req.params;
    const article = dynamicArticles.find((a) => a.id === articleId);
    if (!article) {
      return res.status(404).json({ success: false, error: "Article not found." });
    }
    article.likes += 1;
    res.json({ success: true, likes: article.likes });
  });

  // Dynamic news-generator endpoint using Gemini API
  app.post("/api/generate-news", async (req, res) => {
    const { topic, category, enableSearchGrounding } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, error: "Please specify a music topic or artist." });
    }

    try {
      const ai = getGeminiClient();
      const actualCategory = category || "Pop";

      const systemPrompt = `You are a professional lead editor for Beatline, a premier Billboard-style music news and media website. 
Write a highly authentic, captivating, elite-level news article based on the user's topic: "${topic}".
Adhere to strict journalistic excellence, featuring structured, engaging music reporting, detailed context, and dynamic insider quotes.
Write entirely in English. Deliver clean paragraphs.`;

      const groundingTools = enableSearchGrounding ? [{ googleSearch: {} }] : [];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create a breaking music editorial article about the following topic: ${topic}. Format the entire response strictly as a single clean JSON.`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          tools: groundingTools,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Strong, punchy, high-impact news headline." },
              subtitle: { type: Type.STRING, description: "Sub-headline summarizing the story with a hooking detail." },
              content: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of 4 detailed journalistic paragraphs representing the narrative arch."
              },
              author: { type: Type.STRING, description: "Name of the music journalist." },
              bulletPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 concise, highly dynamic editorial take-aways highlighting key specifics from the reported events."
              }
            },
            required: ["title", "subtitle", "content", "author", "bulletPoints"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response content generated by the AI model.");
      }

      const generatedObj = JSON.parse(responseText.trim());

      // Map a beautiful matching Unsplash photo query based on the topic/artist
      const visualKeywords = encodeURIComponent(topic.slice(0, 30));
      const fallbackImages = [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop"
      ];
      const randomIndex = Math.floor(Math.random() * fallbackImages.length);
      const articleImage = `https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop&q=80`;

      const newArticle = {
        id: `art-${Date.now()}`,
        title: generatedObj.title,
        subtitle: generatedObj.subtitle,
        category: actualCategory,
        content: generatedObj.content,
        author: generatedObj.author || "Beatline Staff Editor",
        publishedAt: new Date().toISOString(),
        readTime: `${Math.max(2, Math.round(generatedObj.content.join(" ").split(" ").length / 200))} min read`,
        imageUrl: fallbackImages[randomIndex],
        trending: true,
        views: 100,
        likes: 0,
        bulletPoints: generatedObj.bulletPoints,
        comments: []
      };

      // Add to front of the dynamicArticles
      dynamicArticles.unshift(newArticle);

      res.json({ success: true, article: newArticle });
    } catch (err: any) {
      console.error("Gemini Generation Error:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Failed to generate dynamic music news using Gemini."
      });
    }
  });

  // Dynamic artist background insight using Gemini
  app.post("/api/artist-spotlight", async (req, res) => {
    const { artistName } = req.body;
    if (!artistName) {
      return res.status(400).json({ success: false, error: "Please list an artist name." });
    }

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Provide a detailed editorial summary about the artist "${artistName}". Include their musical style, hot career highlights, and their historical charting records. Returns inside standard JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              artist: { type: Type.STRING },
              eraSummary: { type: Type.STRING, description: "Detailed 3-sentence summary of their current musical era." },
              genreArchetype: { type: Type.STRING, description: "e.g. 'Avante-Garde Alt R&B Mastermind'" },
              signatureRelease: { type: Type.STRING },
              criticRating: { type: Type.STRING, description: "An editorial statement like 'Icon Status' or 'Hot Contender'" },
              quickFacts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 highly compelling stats or facts about their chart peaks."
              }
            },
            required: ["artist", "eraSummary", "genreArchetype", "signatureRelease", "criticRating", "quickFacts"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response content generated.");
      const parsed = JSON.parse(text.trim());
      res.json({ success: true, insight: parsed });
    } catch (err: any) {
      console.error("Artist Spotlight Error:", err);
      res.status(500).json({ success: false, error: err.message || "Error generating artist spotlight." });
    }
  });

  // --- VITE MIDDLEWARE CONFIG ---

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
    console.log(`[Beatline Backend] Server booted and running on http://localhost:${PORT}`);
  });
}

startServer();
