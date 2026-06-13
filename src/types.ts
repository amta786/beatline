export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  content: string[];
  author: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  trending: boolean;
  views: number;
  likes: number;
  bulletPoints: string[];
  comments: Comment[];
}

export interface ChartEntry {
  rank: number;
  lastWeekRank: number | "NEW" | "RE" | null;
  peakRank: number;
  weeksOnChart: number;
  title: string;
  artist: string;
  imageUrl: string;
  genre: string;
  trend: "up" | "down" | "flat" | "new";
  bpm: number;
  synthMelody: string; // encoded visual synth sequences
}

export interface ChartAlbum {
  rank: number;
  lastWeekRank: number | "NEW" | "RE" | null;
  peakRank: number;
  weeksOnChart: number;
  title: string;
  artist: string;
  imageUrl: string;
  genre: string;
  trend: "up" | "down" | "flat" | "new";
}

export interface SynthTrack {
  id: string;
  name: string;
  artist: string;
  bpm: number;
  genre: string;
  notes: Array<{ note: string; time: number; duration: number }>;
}
