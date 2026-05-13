"use client";

import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto px-6 py-32 animate-in fade-in duration-700">
        <div className="w-24 h-24 mb-10 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          <span className="text-4xl font-black text-primary">P</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          We are <span className="gradient-text">Team Plenum</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-16 max-w-3xl">
          A student-led startup ecosystem focused on digitizing and simplifying daily B2B trade. 
          We bridge the gap between manufacturers, distributors, and vendors through transparency and technology.
        </p>

        <div className="flex flex-wrap justify-center gap-12 md:gap-24 pt-12 border-t border-white/10 w-full max-w-2xl">
          <div className="space-y-2">
            <span className="block text-5xl md:text-6xl font-black text-primary">2026</span>
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Founded</span>
          </div>
          <div className="space-y-2">
            <span className="block text-5xl md:text-6xl font-black text-primary">4+</span>
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Domains</span>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-muted-foreground text-xs border-t border-white/5">
        &copy; {new Date().getFullYear()} Team Plenum · About
      </footer>
    </div>
  );
}
