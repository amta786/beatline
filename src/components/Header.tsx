import { useState, useEffect } from "react";
import { ListMusic, Search, Newspaper, Sparkles, Music } from "lucide-react";

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  scrollToView: (view: "news" | "charts" | "ai" | "booth") => void;
}

export default function Header({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  scrollToView
}: HeaderProps) {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Format to true vintage editorial standard: "SATURDAY, JUNE 13, 2026"
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    setCurrentDate(new Date().toLocaleDateString("en-US", options).toUpperCase());
  }, []);

  const genres = ["ALL", "POP", "HIP-HOP", "ROCK", "COUNTRY", "ELECTRONIC"];

  return (
    <header id="beatline-main-header" className="w-full bg-white border-b-4 border-black sticky top-0 z-40 shadow-sm">
      {/* Editorial Mini-Bar */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center text-[10px] text-zinc-500 font-mono border-b border-zinc-200 uppercase tracking-widest font-bold">
        <div>{currentDate} • EDITORIAL EDITION</div>
        <div className="hidden sm:block">ESTABLISHED 2026 • NEW YORK • LONDON • TOKYO</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Navigation Quick Shortcuts */}
        <div className="flex items-center gap-4 text-xs font-mono font-bold tracking-wider order-2 md:order-1">
          <button
            onClick={() => scrollToView("charts")}
            className="flex items-center gap-1.5 text-zinc-800 hover:text-red-600 transition-colors py-1 cursor-pointer"
          >
            <ListMusic className="w-4 h-4 text-red-600" />
            CHARTS
          </button>
          <span className="text-zinc-300">/</span>
          <button
            onClick={() => scrollToView("ai")}
            className="flex items-center gap-1.5 text-zinc-800 hover:text-red-900 transition-colors py-1 cursor-pointer bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-100" />
            AI NEWSROOM
          </button>
        </div>

        {/* Master Logo Masthead */}
        <div className="text-center order-1 md:order-2">
          <h1
            onClick={() => {
              setActiveCategory("ALL");
              setSearchQuery("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-4xl sm:text-6xl font-black tracking-[0.25em] text-black cursor-pointer hover:opacity-90 select-none pb-1 transition-all"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            BEATLINE
          </h1>
          <p className="text-[9px] uppercase tracking-[0.45em] text-zinc-500 font-mono -mt-1 block">
            The Premier Destination for Sound, Charts & Culture
          </p>
        </div>

        {/* Quick Search Panel */}
        <div className="relative w-full max-w-xs order-3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </span>
          <input
            type="text"
            placeholder="Search news or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border-2 border-zinc-300 rounded-none pl-9 pr-4 py-1.5 text-sm uppercase tracking-wider font-mono text-zinc-800 focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Primary Category Selector Bar */}
      <div className="w-full border-t border-black bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 sm:space-x-4 py-1">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  setActiveCategory(genre);
                  scrollToView("news");
                }}
                className={`px-3 py-2.5 text-xs font-mono tracking-widest font-black uppercase transition-all duration-150 border-b-2 decoration-2 ${
                  activeCategory === genre
                    ? "border-red-600 text-red-600 bg-white"
                    : "border-transparent text-zinc-600 hover:text-black hover:bg-zinc-100"
                }`}
              >
                {genre}
              </button>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-4 text-xs font-mono font-bold text-zinc-500 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
              HOT 100 UPDATE LIVE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
