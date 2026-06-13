import React from "react";
import { motion } from "motion/react";
import { Clock, Eye, Heart, MessageSquare } from "lucide-react";
import { Article } from "../types";

interface MegaHeroProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onLikeArticle: (id: string, e: React.MouseEvent) => void;
}

export default function MegaHero({
  articles,
  onSelectArticle,
  onLikeArticle
}: MegaHeroProps) {
  if (articles.length === 0) return null;

  // Lead story is the first popular/trending one or simply the first article
  const leadArticle = articles.find((a) => a.trending) || articles[0];
  // Side articles are up to 4 other entries
  const sideArticles = articles.filter((a) => a.id !== leadArticle.id).slice(0, 4);

  return (
    <div id="beatline-mega-hero-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 border-b-2 border-black max-w-7xl mx-auto px-4">
      {/* Featured Lead Story (Spans 2 columns) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 cursor-pointer group flex flex-col justify-between"
        onClick={() => onSelectArticle(leadArticle)}
      >
        <div>
          {/* Broad Aspect ratio Cover */}
          <div className="relative overflow-hidden bg-zinc-200 border-4 border-black aspect-[16/9] mb-4">
            <img
              src={leadArticle.imageUrl}
              alt={leadArticle.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-black text-white text-[10px] uppercase font-mono font-black tracking-widest px-3 py-1">
              Lead Story • {leadArticle.category}
            </div>
          </div>

          <h2
            className="text-2xl sm:text-4xl font-extrabold text-black leading-tight tracking-tight uppercase group-hover:text-red-600 transition-colors"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            {leadArticle.title}
          </h2>

          <p className="text-zinc-600 text-sm sm:text-base mt-2 tracking-wide leading-relaxed font-sans font-medium line-clamp-3">
            {leadArticle.subtitle}
          </p>
        </div>

        {/* Story Metadata footer */}
        <div className="flex items-center justify-between mt-4 pb-2 border-b border-zinc-200 text-xs font-mono text-zinc-500 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span>BY {leadArticle.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {leadArticle.readTime}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              {leadArticle.views}
            </span>
            <button
              onClick={(e) => onLikeArticle(leadArticle.id, e)}
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-100" />
              {leadArticle.likes}
            </button>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
              {leadArticle.comments.length}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Flanking Bulletin (Right-side column) */}
      <div className="flex flex-col gap-6">
        <div className="border-b-4 border-black pb-2 flex justify-between items-center bg-black text-white px-3 py-1">
          <span className="font-mono text-xs font-black tracking-widest uppercase">TRENDING BULLETIN</span>
          <span className="w-2.5 h-2.5 bg-red-600 animate-ping rounded-full inline-block"></span>
        </div>

        {sideArticles.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelectArticle(article)}
            className="flex gap-4 items-start cursor-pointer border-b border-zinc-200 pb-4 last:border-0 group select-none"
          >
            {/* Massive Indicator Number */}
            <span className="text-4xl font-extrabold text-zinc-300 font-mono italic group-hover:text-red-600 transition-colors">
              0{idx + 1}
            </span>

            <div className="flex-1">
              <span className="text-[10px] font-mono tracking-widest uppercase font-black text-red-600 block mb-0.5">
                {article.category}
              </span>
              <h3 className="text-sm font-extrabold text-black tracking-tight leading-snug group-hover:text-red-600 transition-colors uppercase line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-zinc-500">
                <span className="truncate">BY {article.author}</span>
                <span className="shrink-0">•</span>
                <span className="shrink-0">{article.readTime}</span>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="w-16 h-16 bg-zinc-200 overflow-hidden shrink-0 border-2 border-black">
              <img
                src={article.imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </motion.div>
        ))}

        {sideArticles.length === 0 && (
          <div className="text-center font-mono py-8 border border-dashed border-zinc-300 text-zinc-400 text-xs">
            Dynamic news articles generated in the AI newsroom will populate this feed live.
          </div>
        )}
      </div>
    </div>
  );
}
