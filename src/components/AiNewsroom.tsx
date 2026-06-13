import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Globe, Loader2, ArrowRight, HelpCircle, Newspaper, BookOpen } from "lucide-react";
import { Article } from "../types";

interface AiNewsroomProps {
  onArticleGenerated: (newArticle: Article) => void;
}

export default function AiNewsroom({ onArticleGenerated }: AiNewsroomProps) {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Pop");
  const [grounding, setGrounding] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeholders = [
    "Draft a report on Taylor Swift's surprising acoustic set in London",
    "Analyze Kendrick Lamar's sudden chart dominance and lyric meanings",
    "Write a review of Billie Eilish's ambient pop experiment in her new LP",
    "Report on R&B acts returning to analog tape recorders for retro warmth",
    "Draft breaking news about Fred again..'s unannounced outdoor rave"
  ];

  const handleRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    setTopic(placeholders[randomIndex]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/generate-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          category,
          enableSearchGrounding: grounding,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onArticleGenerated(data.article);
        setSuccess(true);
        setTopic("");
        // Fade success banner after 5 sec
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(data.error || "Failed to generate story block.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during generative drafting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="beatline-ai-newsroom-block" className="py-12 bg-zinc-950 text-white max-w-7xl mx-auto px-4 border-b-2 border-black">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Editorial Narrative */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="font-mono text-xs text-red-500 font-black tracking-widest uppercase block mb-2">
            INTELLIGENT EDITORIAL OFFICE
          </span>
          <h2
            className="text-3xl sm:text-4xl font-black uppercase text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            THE BEATLINE AI NEWS DESK
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
            Take command of our AI-powered music newsroom. Specify any artist, release gossip, or music scandal, and watch our senior AI writer assemble a masterpiece using standard professional journalistic formats.
          </p>

          <div className="flex flex-col gap-4 border-l-2 border-red-600 pl-4 py-2">
            <div className="flex items-start gap-2.5">
              <Globe className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-black uppercase text-zinc-200">Google Search Grounding</h4>
                <p className="text-xs text-zinc-400 leading-normal">
                  Toggle Web Intelligence to let Gemini query real-time 2026 data before drafting. This produces completely accurate biographical, album release, and tour stat metrics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Console Workspace Form */}
        <div className="lg:col-span-7 bg-zinc-900 border-4 border-zinc-800 p-6 relative">
          <div className="absolute -top-3.5 right-6 bg-red-600 text-[10px] tracking-widest font-mono font-black uppercase px-3 py-1">
            WRITER TERMINAL V3.5
          </div>

          <form onSubmit={handleGenerate} className="flex flex-col gap-5">
            {/* Genre / Category Select */}
            <div>
              <label className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block mb-2">
                ARTICLE BRAND CATEGORY
              </label>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {["Pop", "Hip-Hop", "Rock", "Country", "Electronic", "Indie"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 font-bold uppercase transition-all duration-150 rounded cursor-pointer ${
                      category === cat
                        ? "bg-white text-black font-black"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Topic Input */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
                  NEWS BRIEF / TOPIC STATEMENT
                </label>
                <button
                  type="button"
                  onClick={handleRandomTopic}
                  className="text-[10px] text-zinc-500 hover:text-red-500 hover:underline font-mono uppercase font-black"
                >
                  🎲 Auto-Generate Idea
                </button>
              </div>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Declare details e.g., 'Kendrick Lamar announce pop up performance at Lollapalooza 2027'"
                rows={3}
                required
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-200 p-3 text-sm focus:outline-none focus:border-white font-sans rounded-none transition-colors"
              />
            </div>

            {/* Grounding Toggle & Submit action */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950 p-4 border border-zinc-800">
              <div className="flex items-center gap-2.5">
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={grounding}
                    onChange={(e) => setGrounding(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white border border-zinc-700"></div>
                  <span className="ml-3 text-xs font-mono font-bold uppercase text-zinc-300">
                    Live Web Search Grounding
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-widest font-black px-5 py-2.5 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    COMPOSING STORY...
                  </>
                ) : (
                  <>
                    PUBLISH TO FEED
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Feedback logs */}
          <AnimatePresence mode="wait">
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2 uppercase tracking-wider"
              >
                <Newspaper className="w-4 h-4 shrink-0" />
                <span>SUCCESS: Breaking Scoop generated & published to homepage list! Scroll up to read!</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs font-mono uppercase tracking-wider"
              >
                ERROR DETECTED: {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
