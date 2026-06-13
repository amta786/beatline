import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Flame, Star, TrendingUp } from "lucide-react";

interface TickerItem {
  id: string;
  text: string;
  badge?: string;
  isHot?: boolean;
}

export default function Ticker() {
  const [items] = useState<TickerItem[]>([
    { id: "1", text: "Billie Eilish claims her 6th No. 1 Single on Hot 100 with 'Supernova Glow'", badge: "HOT 100", isHot: true },
    { id: "2", text: "Kendrick Lamar's new surprise single 'Taper' triggers massive streaming surge", badge: "BREAKING" },
    { id: "3", text: "Chappell Roan's 'Underground Velvet Tour' sells out in record 45 seconds", badge: "TOUR", isHot: true },
    { id: "4", text: "Grammy Awards 2027: Record Academy committees announce rule updates for electronic acts", badge: "GRAMMYS" },
    { id: "5", text: "Zach Bryan's high-concept Short Film raises millions for Americana conservation", badge: "FILM" },
    { id: "6", text: "Fred again.. schedules shock midnight warehouse takeover in London after Chicago success", badge: "POP-UP" }
  ]);

  return (
    <div id="beatline-ticker-bar" className="w-full bg-black text-white py-2 overflow-hidden border-b border-zinc-800 text-xs tracking-wider uppercase font-mono flex items-center select-none">
      <div className="bg-red-600 px-3 py-0.5 text-[10px] font-bold shrink-0 mx-4 animate-pulse flex items-center gap-1">
        <Flame className="w-3.5 h-3.5 fill-white" />
        LIVE UPDATE
      </div>

      <div className="flex whitespace-nowrap overflow-hidden relative w-full">
        <motion.div
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            ease: "linear",
            duration: 35,
            repeat: Infinity,
          }}
          className="flex space-x-12 shrink-0 pr-12 items-center"
        >
          {items.map((item, index) => (
            <span key={`${item.id}-${index}`} className="flex items-center space-x-2 text-zinc-300">
              {item.isHot && <TrendingUp className="w-3.5 h-3.5 text-red-500 shrink-0" />}
              {!item.isHot && <Star className="w-3.5 h-3.5 text-zinc-500 shrink-0" />}
              
              {item.badge && (
                <span className="bg-zinc-800 text-zinc-100 px-1.5 py-0.25 text-[9px] rounded font-semibold shrink-0">
                  {item.badge}
                </span>
              )}
              <span className="hover:text-white transition-colors cursor-pointer">{item.text}</span>
            </span>
          ))}
        </motion.div>

        {/* Duplicate list to allow seamless loop scrolling */}
        <motion.div
          aria-hidden="true"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            ease: "linear",
            duration: 35,
            repeat: Infinity,
          }}
          className="flex space-x-12 shrink-0 pr-12 items-center"
        >
          {items.map((item, index) => (
            <span key={`${item.id}-dup-${index}`} className="flex items-center space-x-3 text-zinc-300">
              {item.isHot && <TrendingUp className="w-3.5 h-3.5 text-red-500 shrink-0" />}
              {!item.isHot && <Star className="w-3.5 h-3.5 text-zinc-500 shrink-0" />}
              
              {item.badge && (
                <span className="bg-zinc-800 text-zinc-100 px-1.5 py-0.25 text-[9px] rounded font-semibold shrink-0">
                  {item.badge}
                </span>
              )}
              <span className="hover:text-white transition-colors cursor-pointer">{item.text}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
