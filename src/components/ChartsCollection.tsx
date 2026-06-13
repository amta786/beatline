import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, TrendingUp, TrendingDown, Minus, Award, HelpCircle, Sparkles, Loader2, Compass } from "lucide-react";
import { ChartEntry, ChartAlbum } from "../types";

interface ChartsCollectionProps {
  hot100: ChartEntry[];
  beatline200: ChartAlbum[];
  onPlayTrack: (title: string, artist: string, bpm: number, synthMelody: string, genre: string) => void;
  playingTitle: string;
}

export default function ChartsCollection({
  hot100,
  beatline200,
  onPlayTrack,
  playingTitle
}: ChartsCollectionProps) {
  const [activeTab, setActiveTab] = useState<"hot100" | "beatline200">("hot100");
  const [spotlightArtist, setSpotlightArtist] = useState<string | null>(null);
  const [spotlightData, setSpotlightData] = useState<any | null>(null);
  const [loadingSpotlight, setLoadingSpotlight] = useState(false);
  const [spotlightError, setSpotlightError] = useState<string | null>(null);

  // Fetch Artist Spotlight insights from backend (Gemini API)
  const fetchArtistSpotlight = async (artist: string) => {
    setSpotlightError(null);
    setSpotlightArtist(artist);
    setLoadingSpotlight(true);
    setSpotlightData(null);

    try {
      const res = await fetch("/api/artist-spotlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistName: artist }),
      });
      const data = await res.json();
      if (data.success) {
        setSpotlightData(data.insight);
      } else {
        throw new Error(data.error || "Failed to fetch spotlight details.");
      }
    } catch (err: any) {
      console.error(err);
      setSpotlightError(err.message || "Something went wrong.");
    } finally {
      setLoadingSpotlight(false);
    }
  };

  return (
    <div id="beatline-charts-section" className="py-12 bg-white max-w-7xl mx-auto px-4 border-b-2 border-black">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 border-b-4 border-black pb-4">
        <div>
          <span className="font-mono text-xs text-red-600 font-black tracking-widest uppercase block mb-1">
            LEADERBOARD DIRECTORY
          </span>
          <h2
            className="text-3xl sm:text-5xl font-black uppercase text-black"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            THE OFFICIAL CHARTS
          </h2>
        </div>

        {/* Tab switchers in heavy retro black bounds */}
        <div className="flex border-2 border-black font-mono text-xs uppercase tracking-widest font-bold">
          <button
            onClick={() => setActiveTab("hot100")}
            className={`px-4 py-2 cursor-pointer transition-colors ${
              activeTab === "hot100" ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-100"
            }`}
          >
            HOT 100 SINGLES
          </button>
          <button
            onClick={() => setActiveTab("beatline200")}
            className={`px-4 py-2 cursor-pointer transition-colors border-l-2 border-black ${
              activeTab === "beatline200" ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-100"
            }`}
          >
            BEATLINE 200 ALBUMS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main ranking tables */}
        <div className="lg:col-span-2">
          {activeTab === "hot100" ? (
            <div className="flex flex-col">
              {/* Header Titles */}
              <div className="grid grid-cols-12 border-b-2 border-zinc-300 pb-2 text-[10px] tracking-wider font-mono text-zinc-500 uppercase font-black text-center">
                <span className="col-span-2 text-left">RANK</span>
                <span className="col-span-6 text-left">TITLE & ARTIST</span>
                <span className="col-span-1">LAST WK</span>
                <span className="col-span-1">PEAK</span>
                <span className="col-span-1">WKS</span>
                <span className="col-span-1">PLAY</span>
              </div>

              {/* Rows */}
              <div className="flex flex-col mt-2">
                {hot100.map((entry) => {
                  const isPlaying = playingTitle === entry.title;
                  return (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`grid grid-cols-12 items-center py-4 border-b border-zinc-200 group text-center hover:bg-zinc-50 transition-colors ${
                        isPlaying ? "bg-red-50/70 border-l-4 border-l-red-600 pl-2" : ""
                      }`}
                    >
                      {/* Rank Column */}
                      <div className="col-span-2 text-left flex items-center gap-3">
                        <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-zinc-900 w-8">
                          {entry.rank}
                        </span>
                        
                        {/* Trend arrows */}
                        <div>
                          {entry.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                          {entry.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600" />}
                          {entry.trend === "flat" && <Minus className="w-4 h-4 text-zinc-400" />}
                          {entry.trend === "new" && (
                            <span className="bg-purple-600 text-white text-[8px] font-black tracking-widest px-1 py-0.25">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Song Information Column */}
                      <div className="col-span-6 text-left flex items-center gap-3">
                        <div className="w-12 h-12 bg-zinc-100 overflow-hidden border border-zinc-300 rounded-sm shrink-0">
                          <img
                            src={entry.imageUrl}
                            alt={entry.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <h4 className="text-sm font-extrabold text-black uppercase tracking-tight truncate">
                            {entry.title}
                          </h4>
                          <button
                            onClick={() => fetchArtistSpotlight(entry.artist)}
                            className="text-xs text-zinc-500 hover:text-red-700 hover:underline text-left block truncate font-mono"
                          >
                            {entry.artist} <span className="text-[9px] text-zinc-400">🔍 BIO</span>
                          </button>
                        </div>
                      </div>

                      {/* History metrics */}
                      <div className="col-span-1 font-mono text-xs font-bold text-zinc-700">
                        {entry.lastWeekRank || "—"}
                      </div>
                      <div className="col-span-1 font-mono text-xs font-bold text-zinc-700">
                        {entry.peakRank}
                      </div>
                      <div className="col-span-1 font-mono text-xs font-bold text-zinc-700">
                        {entry.weeksOnChart}
                      </div>

                      {/* Play Action Trigger */}
                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => onPlayTrack(entry.title, entry.artist, entry.bpm, entry.synthMelody, entry.genre)}
                          className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center transition-all ${
                            isPlaying
                              ? "bg-red-600 text-white border-red-600 animate-pulse"
                              : "bg-white text-black hover:bg-black hover:text-white"
                          }`}
                        >
                          <Play className={`w-3.5 h-3.5 ${isPlaying ? "fill-white" : "fill-current"}`} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Albums Directory */}
              <div className="grid grid-cols-12 border-b-2 border-zinc-300 pb-2 text-[10px] tracking-wider font-mono text-zinc-500 uppercase font-black text-center">
                <span className="col-span-2 text-left">RANK</span>
                <span className="col-span-6 text-left">ALBUM & ARTIST</span>
                <span className="col-span-2">LAST WK</span>
                <span className="col-span-1">PEAK</span>
                <span className="col-span-1">WKS</span>
              </div>

              <div className="flex flex-col mt-2">
                {beatline200.map((entry) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-12 items-center py-4 border-b border-zinc-200 hover:bg-zinc-50 transition-colors text-center"
                  >
                    <div className="col-span-2 text-left flex items-center gap-3">
                      <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-zinc-900 w-8">
                        {entry.rank}
                      </span>
                      <div>
                        {entry.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {entry.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600" />}
                        {entry.trend === "flat" && <Minus className="w-4 h-4 text-zinc-400" />}
                        {entry.trend === "new" && (
                          <span className="bg-purple-600 text-white text-[8px] font-black tracking-widest px-1 py-0.25">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-span-6 text-left flex items-center gap-3">
                      <div className="w-12 h-12 bg-zinc-100 overflow-hidden border border-zinc-300 rounded-sm shrink-0">
                        <img
                          src={entry.imageUrl}
                          alt={entry.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-extrabold text-black uppercase tracking-tight block truncate">
                          {entry.title}
                        </h4>
                        <button
                          onClick={() => fetchArtistSpotlight(entry.artist)}
                          className="text-xs text-zinc-500 hover:text-red-700 hover:underline block truncate font-mono"
                        >
                          {entry.artist} <span className="text-[9px] text-zinc-400">🔍 BIO</span>
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 font-mono text-xs font-bold text-zinc-700">
                      {entry.lastWeekRank || "—"}
                    </div>
                    <div className="col-span-1 font-mono text-xs font-bold text-zinc-700">
                      {entry.peakRank}
                    </div>
                    <div className="col-span-1 font-mono text-xs font-bold text-zinc-700">
                      {entry.weeksOnChart}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Artist Spotlight Panel (Bespoke right-side column powered by Gemini) */}
        <div className="bg-zinc-50 border-4 border-black p-6 flex flex-col justify-between self-start">
          <div className="border-b-2 border-black pb-4 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-mono font-black text-red-600 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4" />
              ARTIST INSIGHTS DESK
            </div>
            <h3
              className="text-xl font-black uppercase text-black"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              SPOTLIGHT RESEARCHER
            </h3>
            <p className="text-zinc-500 text-xs font-mono mt-1">
              Click any artist name on the charts row to pull deep, real-time biographical analyses directly from our editorial Gemini system!
            </p>
          </div>

          <AnimatePresence mode="wait">
            {loadingSpotlight ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center text-zinc-500"
              >
                <Loader2 className="w-8 h-8 text-black animate-spin mb-3" />
                <span className="font-mono text-xs tracking-wider uppercase animate-pulse">
                  Querying Beatline Editor Desk...
                </span>
              </motion.div>
            ) : spotlightError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-6 text-center text-red-600 bg-red-50 p-4 border border-red-300 font-mono text-xs"
              >
                Failed to pull research: {spotlightError}
              </motion.div>
            ) : spotlightData ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col"
              >
                <div className="flex justify-between items-baseline mb-2">
                  <h4 className="text-lg font-black uppercase text-black tracking-tight font-sans">
                    {spotlightData.artist}
                  </h4>
                  <span className="bg-black text-white text-[9px] font-mono px-2 py-0.5 tracking-wider font-extrabold uppercase shrink-0">
                    {spotlightData.criticRating}
                  </span>
                </div>

                <div className="bg-white border-2 border-zinc-300 p-2 text-xs font-mono text-zinc-500 uppercase tracking-wider mb-4 flex justify-between">
                  <span>STYLE: {spotlightData.genreArchetype}</span>
                </div>

                <p className="text-zinc-700 text-xs font-sans leading-relaxed tracking-wide mb-4">
                  {spotlightData.eraSummary}
                </p>

                <div className="border-t border-zinc-200 pt-4">
                  <h5 className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-black mb-2">
                    KEY CHART STATISTICS:
                  </h5>
                  <ul className="flex flex-col gap-2">
                    {spotlightData.quickFacts.map((fact: string, idx: number) => (
                      <li key={idx} className="flex gap-2 items-start text-xs font-sans font-medium text-zinc-800">
                        <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-zinc-200 mt-6 pt-4 text-[10px] font-mono text-zinc-400 uppercase text-center flex items-center justify-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-zinc-400" />
                  REPORT GENERATED SECURELY BY GEMINI 3.5
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center text-zinc-400 border border-dashed border-zinc-350 p-4"
              >
                <HelpCircle className="w-8 h-8 mb-2 text-zinc-300" />
                <span className="font-mono text-xs tracking-wider uppercase">
                  Select artist to inspect
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
