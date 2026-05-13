"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";

export default function TaskPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setDomain(null);

    try {
      const res = await fetch("/api/fetch-domain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch domain");
      }

      setDomain(data.domain);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-foreground selection:bg-primary/30 selection:text-primary overflow-x-hidden flex flex-col">
      <Navbar showAdmin={false} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
            
            <h1 className="text-3xl font-bold tracking-tight mb-2">Check Domain</h1>
            <p className="text-muted-foreground mb-8">Enter your details to see which domain you registered for.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-white/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-white/20"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {isLoading ? "Searching..." : "Check Domain"}
              </button>
            </form>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center text-sm"
              >
                {error}
              </motion.div>
            )}

            {domain && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 bg-primary/10 border border-primary/20 rounded-xl text-center"
              >
                <p className="text-sm text-muted-foreground mb-1">Registered Domain</p>
                <p className="text-2xl font-bold text-primary">{domain}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
