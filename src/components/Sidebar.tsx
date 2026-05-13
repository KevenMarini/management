"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ChevronRight } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[2100] transition-opacity duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] glass border-r border-white/5 z-[2200] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isOpen ? "translate-x-0" : "-translate-x-full shadow-none"
        } shadow-[20px_0_50px_rgba(0,0,0,0.5)]`}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                <Image src="/logo.png" alt="Plenum Logo" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white uppercase">PLENUM</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-xl transition-all text-muted-foreground hover:text-white active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4 px-4">Menu</div>
            <SidebarLink href="/" label="Home" onClick={onClose} />
            <SidebarLink href="/announcements" label="Announcements" onClick={onClose} />
            <SidebarLink href="/recruitment" label="Recruitment" onClick={onClose} />
            <SidebarLink href="/about" label="About Us" onClick={onClose} />
            <SidebarLink href="/contact" label="Contact" onClick={onClose} />
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5">
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <p className="text-xs text-muted-foreground leading-relaxed text-center italic">
                "Modernizing B2B trade through transparency and technology."
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground/30 text-center mt-6 uppercase tracking-widest">
              © 2026 Team Plenum
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3.5 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all group border border-transparent hover:border-white/5"
    >
      <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
    </Link>
  );
}
