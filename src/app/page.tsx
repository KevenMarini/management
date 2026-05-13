"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Zap, Shield, Code2, Database, PenTool, Briefcase, CheckCircle2, Camera, MessageSquare, ChevronLeft } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

import { useState, useEffect } from "react";

export default function LandingPage() {
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");
        if (res.ok) setRoles(await res.json());
      } catch (error) {
        console.error("Failed to fetch roles");
      }
    };
    fetchRoles();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen text-foreground selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-[200px] pb-[100px] px-6 max-w-7xl mx-auto flex flex-col items-center text-center">


        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[3.5rem] md:text-[6rem] font-black leading-[1.05] tracking-tight mb-8 max-w-5xl"
        >
          Building the <br className="hidden md:block" />
          <span className="gradient-text">Future of Trade</span>
        </motion.h1>

        <motion.p 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed mb-12"
        >
          We are creating an open, transparent, and ultra-efficient digital marketplace that connects vendors, distributors, and manufacturers on a global scale.
        </motion.p>

        <motion.div 
          initial="hidden" 
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <button 
            onClick={() => scrollToSection('roles')} 
            className="btn-primary group flex items-center gap-2 text-lg px-8 py-4 cursor-pointer"
          >
            Apply Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="px-8 py-4 rounded-xl border border-white/10 text-white font-semibold text-lg hover:bg-white/5 transition-all cursor-pointer"
          >
            Explore Platform
          </button>
        </motion.div>
      </section>

      {/* Bento Box Mission Section */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Main Large Box */}
          <motion.div variants={fadeUp} className="md:col-span-2 glass rounded-3xl p-10 md:p-14 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/20 transition-colors duration-700" />
            <Globe className="w-12 h-12 text-primary mb-8" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">The Global Marketplace</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              We are building an e-commerce platform designed to facilitate all forms of trade. Our goal is to remove traditional supply chain barriers by providing a digital marketplace where businesses can easily discover suppliers, compare prices, and execute better purchasing decisions.
            </p>
          </motion.div>

          {/* Stacked Small Boxes */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <motion.div variants={fadeUp} className="glass rounded-3xl p-8 flex-1 flex flex-col justify-center">
              <Zap className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-3">Efficiency</h3>
              <p className="text-muted-foreground">Streamlining complex B2B interactions into seamless digital experiences.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="glass rounded-3xl p-8 flex-1 flex flex-col justify-center">
              <Shield className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-3">Transparency</h3>
              <p className="text-muted-foreground">Fostering fair competition through open data and reliable supplier networks.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Join The <span className="gradient-text">Ecosystem</span>
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            We are actively recruiting passionate individuals to help build and scale the Plenum platform.
          </motion.p>
        </div>

        <div className="relative group/carousel">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="flex gap-6 overflow-x-auto pb-12 pt-4 px-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
            id="roles-slider"
          >
            {roles.map((role) => (
              <div key={role.id} className="min-w-[320px] md:min-w-[450px] snap-center">
                <RoleCard 
                  title={role.title}
                  icon={role.tag === "Development" ? <Code2 className="w-8 h-8" /> : role.tag === "Creative" ? <PenTool className="w-8 h-8" /> : <Briefcase className="w-8 h-8" />}
                  desc={role.description}
                  href={`/apply/${role.slug}`}
                />
              </div>
            ))}
            {roles.length === 0 && (
              <div className="min-w-[320px] md:min-w-[450px] snap-center">
                <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/5 h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No open roles currently. Check back later!</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Carousel Controls */}
          <button 
            onClick={() => {
              const el = document.getElementById('roles-slider');
              if (el) el.scrollBy({ left: -450, behavior: 'smooth' });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-0 transition-all duration-300 z-[100] hover:bg-primary hover:border-primary shadow-2xl cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById('roles-slider');
              if (el) el.scrollBy({ left: 450, behavior: 'smooth' });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-0 transition-all duration-300 z-[100] hover:bg-primary hover:border-primary shadow-2xl cursor-pointer"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Socials & Benefits Split */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <motion.div variants={fadeUp} className="glass rounded-3xl p-10 md:p-14">
            <h3 className="text-3xl font-bold mb-8">Why Join Plenum?</h3>
            <ul className="space-y-6">
              {[
                "Work on a live, high-impact startup project",
                "Gain modern, hands-on technical experience",
                "Collaborate with highly motivated peers",
                "Build incredible portfolio pieces",
                "Shape the future of B2B digital marketplaces"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-4 text-lg text-muted-foreground">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="glass rounded-3xl p-10 md:p-14 bg-gradient-to-b from-white/[0.03] to-transparent">
            <h3 className="text-3xl font-bold mb-8">Connect With Us</h3>
            <p className="text-lg text-muted-foreground mb-10">
              Stay in the loop with our latest updates, announcements, and community discussions.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="https://chat.whatsapp.com/Dy5unI1CRR7EVwhgPDat98" target="_blank" className="flex items-center justify-between p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <MessageSquare className="w-8 h-8 text-green-500" />
                  <div>
                    <h4 className="font-bold text-lg">WhatsApp Community</h4>
                    <p className="text-sm text-muted-foreground">Join the conversation</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
              
              <Link href="https://www.instagram.com/teamplenum?igsh=MThtMm0wYWRrMXloNg%3D%3D&utm_source=qr" target="_blank" className="flex items-center justify-between p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <Camera className="w-8 h-8 text-pink-500" />
                  <div>
                    <h4 className="font-bold text-lg">Instagram Profile</h4>
                    <p className="text-sm text-muted-foreground">@teamplenum</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-5xl md:text-7xl font-black mb-8">Ready to <span className="gradient-text">Build?</span></h2>
          <p className="text-xl text-muted-foreground mb-12">
            We are looking for passionate individuals who are excited to create something impactful from the ground up.
          </p>
          <button 
            onClick={() => scrollToSection('roles')} 
            className="btn-primary inline-flex items-center gap-2 text-xl px-12 py-5 cursor-pointer"
          >
            View Open Roles
          </button>
        </motion.div>
      </section>

      <footer className="text-center py-12 border-t border-white/5 text-muted-foreground text-sm">
        © {new Date().getFullYear()} Team Plenum · Trade Ecosystem
      </footer>
    </div>
  );
}

function RoleCard({ title, desc, icon, href }: { title: string; desc: string; icon: React.ReactNode; href: string }) {
  return (
    <motion.div variants={fadeUp}>
      <Link href={href} className="block h-full">
        <div className="h-full glass rounded-3xl p-8 border border-white/5 hover:border-primary/30 hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
          
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-muted-foreground leading-relaxed mb-8">{desc}</p>
          
          <div className="inline-flex items-center gap-2 text-primary font-bold mt-auto group-hover:gap-4 transition-all">
            Apply Now <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
