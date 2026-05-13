"use client";

import { Mail, Camera, MessageCircle, ChevronRight, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-24 sm:py-32 space-y-16 animate-in fade-in duration-700">
        <header className="space-y-4 reveal active">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <MessageSquare className="w-3 h-3" />
            Support Center
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Have questions? We're here to help you navigate the ecosystem and build the future of B2B trade together.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactCard 
            icon={<Mail className="w-6 h-6" />}
            title="Official Inquiries"
            link="mailto:teamplenum@gmail.com"
            linkLabel="teamplenum@gmail.com"
            description="For formal proposals, technical questions, or general administrative inquiries."
          />
          <ContactCard 
            icon={<MessageCircle className="w-6 h-6" />}
            title="Community"
            link="https://chat.whatsapp.com/Dy5unI1CRR7EVwhgPDat98"
            linkLabel="WhatsApp Group"
            description="Join our community for real-time updates and direct contact with the team."
          />
          <ContactCard 
            icon={<Camera className="w-6 h-6" />}
            title="Social Media"
            link="https://www.instagram.com/teamplenum"
            linkLabel="Instagram DM"
            description="Follow us @teamplenum for visual updates and news on our progress."
          />
        </div>

        <section className="glass rounded-3xl p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] -z-10" />
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Looking for something specific? Check our announcements or reach out to us directly through any of the channels above.
          </p>
          <div className="flex justify-center">
            <a 
              href="/announcements" 
              className="btn-primary flex items-center gap-2"
            >
              View Announcements
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-muted-foreground text-xs border-t border-white/5">
        &copy; {new Date().getFullYear()} Team Plenum · Trade Ecosystem
      </footer>
    </div>
  );
}

function ContactCard({ icon, title, link, linkLabel, description }: { 
  icon: React.ReactNode; 
  title: string; 
  link: string; 
  linkLabel: string;
  description: string;
}) {
  return (
    <div className="glass p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group hover:-translate-y-2 duration-500 flex flex-col h-full">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
        {description}
      </p>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-primary/20 transition-all group/link"
      >
        <span className="font-bold text-sm truncate">{linkLabel}</span>
        <ChevronRight className="w-4 h-4 text-primary group-hover/link:translate-x-1 transition-transform" />
      </a>
    </div>
  );
}
