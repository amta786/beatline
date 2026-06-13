import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Clock, Heart, Eye, MessageSquare, Send, Calendar, Sparkles, Loader2 } from "lucide-react";
import { Article, Comment } from "../types";

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
  onLike: (id: string) => void;
  onCommentAdded: (articleId: string, newComment: Comment) => void;
}

export default function ArticleModal({
  article,
  onClose,
  onLike,
  onCommentAdded
}: ArticleModalProps) {
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !commentText.trim()) return;

    setIsSubmitting(true);
    setCommentError(null);

    try {
      const res = await fetch(`/api/news/${article.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userName.trim(),
          text: commentText.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        onCommentAdded(article.id, data.comment);
        setCommentText("");
      } else {
        throw new Error(data.error || "Failed to post comment.");
      }
    } catch (err: any) {
      console.error(err);
      setCommentError(err.message || "Failed to publish your comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).toUpperCase();

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex justify-center items-start overflow-y-auto p-4 sm:p-6 md:p-10">
      
      {/* Container holding the high-end paper style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white text-zinc-900 w-full max-w-4xl border-4 border-black relative shadow-2xl mb-12"
      >
        {/* Floating cross icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black text-white p-2 border-2 border-black hover:bg-red-600 hover:border-red-600 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Paper Header */}
        <div className="bg-zinc-50 border-b-2 border-black p-6 sm:p-8 pt-12">
          
          {/* Category Pill */}
          <div className="flex gap-2 items-center mb-3 text-xs font-mono font-black text-red-600 tracking-wider uppercase">
            <span>{article.category}</span>
            <span>•</span>
            <span className="text-zinc-500">{formattedDate}</span>
          </div>

          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-black text-black leading-tight tracking-tight uppercase"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            {article.title}
          </h2>

          <p className="text-zinc-600 text-base sm:text-xl font-medium tracking-wide mt-3 leading-relaxed font-sans border-t border-zinc-200 pt-3">
            {article.subtitle}
          </p>

          {/* Author Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 text-xs font-mono text-zinc-500 tracking-wider">
            <div className="flex items-center gap-4 uppercase font-bold">
              <span>BY {article.author}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-zinc-400" />
                {article.views + 1} Views
              </span>
              <button
                onClick={() => onLike(article.id)}
                className="flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-red-600 text-red-600 animate-pulse" />
                <span>{article.likes} Likes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8 border-b-2 border-black">
          
          {/* Main Story column */}
          <div className="md:col-span-8 flex flex-col gap-6">
            
            {/* Visual Header Image */}
            <div className="w-full h-80 bg-zinc-200 border-2 border-black overflow-hidden relative">
              <img
                src={article.imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Narrative text paragraphs */}
            <div className="flex flex-col gap-5 text-zinc-800 text-sm sm:text-base leading-relaxed tracking-wide font-sans">
              {article.content.map((para, idx) => (
                <p key={idx} className="first-letter:text-3xl first-letter:font-black first-letter:float-left first-letter:mr-2 flex-wrap">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Side Editorial Takeaways column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* Key Bullet Summary panel */}
            <div className="bg-red-50/50 border-2 border-red-200 p-5">
              <h4 className="flex items-center gap-1 text-xs font-mono font-black text-red-700 tracking-wider uppercase mb-3 border-b-2 border-red-200 pb-1.5">
                <Sparkles className="w-4 h-4 text-red-700" />
                CHART ROOM NOTES
              </h4>
              <ul className="flex flex-col gap-3">
                {article.bulletPoints?.map((bullet, idx) => (
                  <li key={idx} className="text-zinc-800 text-xs leading-relaxed font-sans font-medium list-decimal list-inside pl-1">
                    {bullet}
                  </li>
                )) || <li className="text-zinc-400 text-xs font-serif italic">No bullet summary.</li>}
              </ul>
            </div>

            {/* Simulated advertisement panel */}
            <div className="border border-zinc-300 p-4 font-mono text-center bg-zinc-50 flex flex-col justify-center select-none">
              <span className="text-[8px] text-zinc-400 tracking-widest block uppercase mb-2">SPONSORED PLACEMENT</span>
              <h5 className="text-xs font-black tracking-wider uppercase text-black">BEATLINE AUDIO HEADPHONES</h5>
              <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                Hear music as songwriters master it. Pure high-fidelity, zero compression.
              </p>
              <button className="bg-black text-white text-[9px] uppercase font-bold py-1 px-3 mt-3 tracking-widest block w-full hover:bg-zinc-800">
                DISCOVER PRODUCT
              </button>
            </div>
          </div>
        </div>

        {/* High-Fidelity Comments Board */}
        <div className="p-6 sm:p-8 bg-zinc-50">
          <h3
            className="text-lg sm:text-xl font-bold uppercase tracking-tight text-black mb-6 flex items-center gap-2"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            <MessageSquare className="w-5 h-5 text-red-600" />
            COMMUNITY RESPONSE ({article.comments.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Comment listing */}
            <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
              {article.comments.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-zinc-300 bg-white p-4 text-zinc-400 text-xs font-mono uppercase">
                  No listener discussions posted yet. Join the conversation first!
                </div>
              ) : (
                article.comments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-zinc-200 p-4 shadow-xs">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs font-mono font-bold text-red-700 uppercase">
                        @{comment.user}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase">
                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-zinc-700 text-xs leading-normal font-sans tracking-wide">
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Right Column: Submit input form */}
            <div className="bg-white border-2 border-black p-5">
              <h4 className="text-[10px] font-mono font-black uppercase text-zinc-800 tracking-wider mb-3">
                POST YOUR VERDICT
              </h4>
              
              <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="w-full bg-zinc-50 border border-zinc-300 text-xs p-2 focus:outline-none uppercase font-mono tracking-wider"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Type your review, feedback or reactions..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-zinc-50 border border-zinc-300 text-xs p-2 focus:outline-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !userName.trim() || !commentText.trim()}
                  className="bg-black hover:bg-zinc-800 text-white font-mono text-[10px] uppercase font-black py-2 tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-55"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      SUBMIT RESPONSE
                    </>
                  )}
                </button>

                {commentError && (
                  <p className="text-red-600 text-[10px] font-mono uppercase text-center mt-1">
                    Failed: {commentError}
                  </p>
                )}
              </form>
            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}
