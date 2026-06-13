import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowUp, Zap, HelpCircle, Loader2, Music, Newspaper, Drum, RefreshCw, Heart } from "lucide-react";
import Header from "./components/Header";
import Ticker from "./components/Ticker";
import MegaHero from "./components/MegaHero";
import ChartsCollection from "./components/ChartsCollection";
import MusicPlayer from "./components/MusicPlayer";
import AiNewsroom from "./components/AiNewsroom";
import ArticleModal from "./components/ArticleModal";
import { Article, ChartEntry, ChartAlbum, Comment } from "./types";

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [hot100, setHot100] = useState<ChartEntry[]>([]);
  const [beatline200, setBeatline200] = useState<ChartAlbum[]>([]);
  
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  const [playingTrack, setPlayingTrack] = useState<{
    title: string;
    artist: string;
    bpm: number;
    melodyString: string;
    genre: string;
  } | null>(null);

  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  const newsRef = useRef<HTMLDivElement | null>(null);
  const chartsRef = useRef<HTMLDivElement | null>(null);
  const aiRef = useRef<HTMLDivElement | null>(null);

  // Load News from Express endpoints
  const fetchNews = async () => {
    setLoadingNews(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error("Failed to load news feed:", err);
    } finally {
      setLoadingNews(false);
    }
  };

  // Load Leaderboard Charts from Express endpoints
  const fetchCharts = async () => {
    setLoadingCharts(true);
    try {
      const res = await fetch("/api/charts");
      const data = await res.json();
      if (data.success) {
        setHot100(data.hot100);
        setBeatline200(data.beatline200);
      }
    } catch (err) {
      console.error("Failed to load chart data:", err);
    } finally {
      setLoadingCharts(false);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchCharts();
  }, []);

  // Post dynamic like action (reactive state update first, then background post to persist)
  const handleLike = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    // Reactive Instant UI Count Update
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, likes: art.likes + 1 } : art))
    );
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle((prev) => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }

    try {
      await fetch(`/api/news/${id}/like`, { method: "POST" });
    } catch (err) {
      console.error("Failed to persist like action:", err);
    }
  };

  // Append new generated comment dynamically
  const handleCommentAdded = (artId: string, newComment: Comment) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === artId) {
          return { ...art, comments: [newComment, ...art.comments] };
        }
        return art;
      })
    );

    if (selectedArticle && selectedArticle.id === artId) {
      setSelectedArticle((prev) =>
        prev
          ? { ...prev, comments: [newComment, ...prev.comments] }
          : null
      );
    }
  };

  // Append new generated AI article
  const handleArticleGenerated = (newArticle: Article) => {
    setArticles((prev) => [newArticle, ...prev]);
  };

  // Launch procedural track synth melody in sound booth
  const handlePlayTrack = (
    title: string,
    artist: string,
    bpm: number,
    melodyString: string,
    genre: string
  ) => {
    setPlayingTrack({ title, artist, bpm, melodyString, genre });
  };

  // Scroll anchor helper
  const scrollToView = (section: "news" | "charts" | "ai" | "booth") => {
    if (section === "news" && newsRef.current) {
      newsRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (section === "charts" && chartsRef.current) {
      chartsRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (section === "ai" && aiRef.current) {
      aiRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filters news list based on actively chosen category slugs & search state
  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      activeCategory === "ALL" || art.category.toUpperCase() === activeCategory.toUpperCase();
    
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      art.title.toLowerCase().includes(query) ||
      art.subtitle.toLowerCase().includes(query) ||
      art.author.toLowerCase().includes(query) ||
      art.content.some((para) => para.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-black selection:text-white pb-12">
      {/* Dynamic News ticker */}
      <Ticker />

      {/* Main header block */}
      <Header
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        scrollToView={scrollToView}
      />

      {/* Main body content */}
      <main className="max-w-7xl mx-auto px-4 mt-4">
        
        {/* Banner Alert panel of active search details */}
        {searchQuery && (
          <div className="bg-zinc-150 border-2 border-dashed border-zinc-400 p-4 mb-6 font-mono text-center text-xs uppercase font-bold tracking-wider">
            Displaying search reports matching "{searchQuery}" • Found {filteredArticles.length} entries.
            <button
              onClick={() => setSearchQuery("")}
              className="ml-3 text-red-600 hover:underline hover:text-black shrink-0 font-black"
            >
              [Clear Filter]
            </button>
          </div>
        )}

        {/* Lead Stories & Featured Grid (Display on 'ALL' active tab configuration with no active queries) */}
        <AnimatePresence mode="wait">
          {activeCategory === "ALL" && !searchQuery ? (
            <div ref={newsRef}>
              <MegaHero
                articles={articles}
                onSelectArticle={setSelectedArticle}
                onLikeArticle={(id, e) => handleLike(id, e)}
              />
            </div>
          ) : null}
        </AnimatePresence>

        {/* Main Feed Feed Listing */}
        <section className="py-12 border-b-2 border-black">
          <div className="flex justify-between items-end border-b-4 border-black pb-3 mb-8">
            <div>
              <span className="font-mono text-xs text-red-600 font-black tracking-widest uppercase block mb-1">
                LATEST HEADLINES
              </span>
              <h3
                className="text-2xl sm:text-4xl font-black uppercase text-black"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {activeCategory === "ALL" ? "THE ENTIRE NEWSFEED" : `${activeCategory} SPECTRUM`}
              </h3>
            </div>

            <button
              onClick={() => {
                fetchNews();
                fetchCharts();
              }}
              className="flex items-center gap-1 text-[10px] uppercase font-mono font-black text-zinc-500 hover:text-black border border-zinc-300 hover:border-black bg-white px-2.5 py-1 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              REFRESH FEED
            </button>
          </div>

          {loadingNews ? (
            <div className="py-24 text-center flex flex-col items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">
              <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
              Drafting media boards from the news desk...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-zinc-300 p-8">
              <span className="text-zinc-400 font-mono text-sm tracking-wider uppercase block mb-3">
                No matching reports registered inside {activeCategory}
              </span>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto mb-5 leading-normal">
                Submit an AI music directive inside the AI News Desk below to instantly generate a custom scoop on this category!
              </p>
              <button
                onClick={() => scrollToView("ai")}
                className="bg-black text-white px-4 py-2 text-xs font-mono tracking-widest uppercase hover:bg-neutral-850 transition-colors"
              >
                Go to AI newsroom
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, idx) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white border-2 border-black cursor-pointer group flex flex-col justify-between hover:shadow-xl transition-all h-[420px]"
                >
                  <div>
                    {/* Thumbnail banner cover */}
                    <div className="relative h-48 bg-zinc-100 overflow-hidden border-b border-black">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-black text-white text-[9px] uppercase font-mono font-black tracking-widest px-2 py-0.5">
                        {article.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h4
                        className="text-base font-extrabold text-black uppercase leading-tight tracking-tight group-hover:text-red-600 transition-all line-clamp-2"
                        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                      >
                        {article.title}
                      </h4>
                      <p className="text-zinc-500 text-xs font-sans font-medium line-clamp-3 mt-2 leading-relaxed tracking-wide">
                        {article.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Metadata block footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-50">
                    <div className="truncate">
                      <span>BY {article.author}</span>
                    </div>
                    <div className="flex gap-3 shrink-1 pl-2">
                      <button
                        onClick={(e) => handleLike(article.id, e)}
                        className="flex items-center gap-0.5 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-100" />
                        {article.likes}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* Global Chart directories */}
        <div ref={chartsRef}>
          {loadingCharts ? (
            <div className="py-20 text-center flex flex-col items-center justify-center text-zinc-500 font-mono text-xs tracking-widest uppercase">
              <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
              Recalculating stream and charting index...
            </div>
          ) : (
            <ChartsCollection
              hot100={hot100}
              beatline200={beatline200}
              onPlayTrack={handlePlayTrack}
              playingTitle={playingTrack?.title || ""}
            />
          )}
        </div>

        {/* Live generative AI editor desk bounds */}
        <div ref={aiRef}>
          <AiNewsroom onArticleGenerated={handleArticleGenerated} />
        </div>

      </main>

      {/* Footer credits in true journal typography */}
      <footer className="mt-20 max-w-7xl mx-auto px-4 border-t-4 border-black pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
          <div>
            <span className="font-extrabold text-black text-sm block tracking-widest mb-1 font-sans">
              BEATLINE MEDIA INC.
            </span>
            <span>© 2026 BEATLINE LTD • ALL REGISTERED LOGOTYPES LICENSED SECURELY</span>
          </div>

          <div className="flex gap-4 font-bold">
            <span className="hover:text-black cursor-pointer">PRIVACY STATEMENT</span>
            <span>/</span>
            <span className="hover:text-black cursor-pointer">CHART METHODOLOGY</span>
            <span>/</span>
            <span className="hover:text-black cursor-pointer">AI USAGE DISCLOSURE</span>
          </div>
        </div>
      </footer>

      {/* Immersive overlays */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            onLike={(id) => handleLike(id)}
            onCommentAdded={handleCommentAdded}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {playingTrack && (
          <MusicPlayer
            title={playingTrack.title}
            artist={playingTrack.artist}
            bpm={playingTrack.bpm}
            melodyString={playingTrack.melodyString}
            genre={playingTrack.genre}
            onClose={() => setPlayingTrack(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
