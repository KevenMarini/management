"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Loader2, CheckCircle2, User, Phone, Mail } from "lucide-react";

export default function TaskPage() {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Login State
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile State
  const [profile, setProfile] = useState<{
    name: string;
    firstName: string;
    email: string;
    phone: string;
    domains: string[];
  } | null>(null);

  // Verification Form State
  const [verifyName, setVerifyName] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/task-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to login");
      }

      setProfile(data);
      setVerifyName(data.name);
      setVerifyPhone(data.phone);
      setVerifyEmail(data.email);
      setStep(2);
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
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
                
                <h1 className="text-3xl font-bold tracking-tight mb-2">Access Portal</h1>
                <p className="text-muted-foreground mb-8">Enter your User ID and Password to verify your details.</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="userid" className="text-sm font-medium text-muted-foreground">User ID</label>
                    <input
                      id="userid"
                      type="text"
                      value={userid}
                      onChange={(e) => setUserid(e.target.value)}
                      required
                      placeholder="Enter your User ID"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-muted-foreground">Password</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-white/20"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                    {isLoading ? "Authenticating..." : "Login"}
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
              </div>
            </motion.div>
          )}

          {step === 2 && profile && (
            <motion.div 
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-lg"
            >
              <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                  <h1 className="text-3xl font-bold tracking-tight">Verify Details</h1>
                </div>
                <p className="text-muted-foreground mb-8">Please review your registered information below.</p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="w-4 h-4" /> Name
                    </label>
                    <input
                      type="text"
                      value={verifyName}
                      onChange={(e) => setVerifyName(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white"
                    />
                    {/* If different name is entered, display the first name entered as requested */}
                    {verifyName.trim().toLowerCase() !== profile.name.trim().toLowerCase() && (
                      <motion.p 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-xs text-amber-500 mt-1"
                      >
                        Note: Registered first name is <span className="font-bold">{profile.firstName}</span>
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone Number
                    </label>
                    <input
                      type="text"
                      value={verifyPhone}
                      onChange={(e) => setVerifyPhone(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={verifyEmail}
                      onChange={(e) => setVerifyEmail(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-muted-foreground mb-3">Registered Domains</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.domains.map((d) => (
                        <span key={d} className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setStep(1);
                      setProfile(null);
                      setUserid("");
                      setPassword("");
                    }}
                    className="w-full py-4 mt-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
