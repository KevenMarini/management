"use client";

import Link from "next/link";
import { ChevronRight, Users, Code, PenTool, Layout, Layers, Terminal } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function RecruitmentDetailsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-24 sm:py-32 space-y-16 animate-in fade-in duration-700">
        <header className="space-y-4 reveal active">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <Users className="w-3 h-3" />
            Open Positions
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
            Recruitment <span className="gradient-text">Details</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Join the collective. We're building a global trade ecosystem and we need the best minds in management, engineering, and design.
          </p>
        </header>

        <div className="space-y-8">
          <DomainCard 
            tag="Leadership & Operations"
            title="Management Team"
            icon={<Layout className="w-6 h-6" />}
            description="The backbone of our operations. This team coordinates project timelines, manages internal communications, and drives growth strategies."
            items={[
              "Project coordination and milestone tracking.",
              "Strategic planning for marketplace expansion.",
              "Managing community engagement and public relations."
            ]}
            href="/management"
          />

          <DomainCard 
            tag="Development"
            title="Web Frontend Development"
            icon={<Code className="w-6 h-6" />}
            description="Bringing our vision to life with clean code and high-performance user interfaces. Focus on React, Next.js, and seamless UX."
            items={[
              "Proficiency in HTML5, CSS3, and JavaScript (ES6+).",
              "Experience with React, Next.js, or modern JS frameworks.",
              "Focus on responsive design and user accessibility."
            ]}
            href="/frontend"
          />

          <DomainCard 
            tag="Development"
            title="Web Backend Development"
            icon={<Terminal className="w-6 h-6" />}
            description="Architecting the server-side logic and database management for a global trade scale using Node.js and cloud architecture."
            items={[
              "Knowledge of Node.js, Python, or Go.",
              "Experience with SQL/NoSQL databases (PostgreSQL, MongoDB).",
              "Understanding of RESTful APIs and cloud architecture."
            ]}
            href="/backend"
          />

          <DomainCard 
            tag="Creative"
            title="Social Media Design Team"
            icon={<PenTool className="w-6 h-6" />}
            description="Defining the visual language of Plenum through high-quality UI/UX and marketing assets in Figma and Adobe Creative Suite."
            items={[
              "Advanced skills in Figma or Adobe Creative Suite.",
              "Experience in UI/UX wireframing and prototyping.",
              "Ability to create engaging social media and branding content."
            ]}
            href="/design"
          />
        </div>
      </main>

      <footer className="py-12 text-center text-muted-foreground text-xs border-t border-white/5">
        &copy; {new Date().getFullYear()} Team Plenum · Recruitment Ecosystem
      </footer>
    </div>
  );
}

function DomainCard({ tag, title, icon, description, items, href }: {
  tag: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  items: string[];
  href: string;
}) {
  return (
    <div className="glass p-8 md:p-12 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{tag}</span>
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {icon}
               </div>
               <h2 className="text-3xl font-bold text-white">{title}</h2>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Key Requirements</h3>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex items-end">
          <Link 
            href={href}
            className="btn-primary flex items-center gap-2 group/btn"
          >
            Apply Now
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
