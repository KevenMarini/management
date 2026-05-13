"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Megaphone, LogOut, User, X } from "lucide-react";
import Sidebar from "./Sidebar";

interface NavbarProps {
  showAdmin?: boolean;
  showLogout?: boolean;
  onLogout?: () => void;
}

export default function Navbar({ showAdmin = true, showLogout = false, onLogout }: NavbarProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 glass z-[2000] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden group-hover:rotate-12 transition-transform flex-shrink-0">
                <Image src="/logo.png" alt="Plenum Logo" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white uppercase hidden sm:block">PLENUM</span>
            </Link>
            
            <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />
            
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-bold tracking-widest uppercase hidden lg:block">Navigation</span>
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <Link
              href="/"
              className={`text-xs font-bold tracking-widest uppercase transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              HOME
            </Link>
            
            <Link
              href="/announcements"
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Announcements"
            >
              <Megaphone className="w-5 h-5" />
            </Link>

            {showLogout && (
              <button
                onClick={onLogout}
                className="text-muted-foreground hover:text-red-500 flex items-center gap-2 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-xs font-bold tracking-widest uppercase hidden md:block">Logout</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
