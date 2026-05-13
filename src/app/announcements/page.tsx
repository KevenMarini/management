"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Announcement {
  id: number;
  title: string;
  content: string;
  link_text: string | null;
  link_url: string | null;
  author: string;
  created_at: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch("/api/announcements");
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-24 sm:py-32 space-y-12 animate-in fade-in duration-700">
        <header className="space-y-4 reveal active text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
            Latest <span className="gradient-text">Announcements</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news, launches, and opportunities from Team Plenum.
          </p>
        </header>

        <div className="space-y-8 mt-16">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No announcements yet. Check back later!</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div 
                key={announcement.id} 
                className="glass p-8 md:p-10 rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="inline-flex px-3 py-1 bg-primary text-background text-xs font-black uppercase tracking-widest rounded shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                    {announcement.author}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    {new Date(announcement.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {announcement.title}
                </h2>

                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap mb-8 text-sm md:text-base">
                  {announcement.content}
                </div>

                {announcement.link_url && announcement.link_text && (
                  <Link
                    href={announcement.link_url}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary hover:bg-primary/10 rounded-lg font-bold transition-all text-sm uppercase tracking-wide group"
                  >
                    {announcement.link_text}
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="py-12 text-center text-muted-foreground text-xs border-t border-white/5">
        &copy; {new Date().getFullYear()} Team Plenum · Announcements
      </footer>
    </div>
  );
}
