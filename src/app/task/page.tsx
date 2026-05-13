"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Loader2, CheckCircle2, User, Phone, Mail, Menu, X, PlusCircle, LayoutList, ListTodo, Briefcase, ChevronRight } from "lucide-react";

export default function TaskPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
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

  // Dashboard State
  const [activeTab, setActiveTab] = useState<"applied" | "more" | "tasks">("applied");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [allRoles, setAllRoles] = useState<{title: string, slug: string, description: string}[]>([]);
  const [applyingDomain, setApplyingDomain] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/roles")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAllRoles(data);
      })
      .catch(console.error);
  }, []);

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

  const handleQuickApply = async (domainTitle: string) => {
    setApplyingDomain(domainTitle);
    try {
      const res = await fetch("/api/quick-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, password, domain: domainTitle })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply");

      // Update local profile state
      setProfile(prev => prev ? { ...prev, domains: [...prev.domains, domainTitle] } : null);
      alert(`Successfully applied for ${domainTitle}!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setApplyingDomain(null);
    }
  };

  // Get unapplied domains based on current roles minus profile.domains
  // Note: the backend uses Capitalized titles usually, but let's compare case-insensitively just in case
  const appliedLower = profile?.domains.map(d => d.toLowerCase()) || [];
  const unappliedRoles = allRoles.filter(role => !appliedLower.includes(role.title.toLowerCase()) && !appliedLower.includes(role.slug.toLowerCase()));

  return (
    <div className="min-h-screen text-foreground selection:bg-primary/30 selection:text-primary overflow-x-hidden flex flex-col bg-background">
      <Navbar showAdmin={false} />

      {step === 3 && (
        <header className="fixed top-16 left-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex justify-end items-center">

          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <User className="w-5 h-5 text-primary" />
            </button>
            
            <AnimatePresence>
              {isProfileOpen && profile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-14 w-64 glass rounded-2xl p-4 border border-white/10 shadow-2xl origin-top-right"
                >
                  <div className="font-bold text-lg mb-1">{profile.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><Mail className="w-3 h-3"/> {profile.email}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="w-3 h-3"/> {profile.phone}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-12 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md mt-16"
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
              className="w-full max-w-lg mt-16"
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
                  
                  <button 
                    onClick={() => setStep(3)}
                    className="w-full py-4 mt-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && profile && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-5xl flex flex-col md:flex-row gap-8 pt-12"
            >
              {/* Sidebar Menu */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full md:w-64 shrink-0 space-y-2"
              >
                <button onClick={() => setActiveTab("applied")} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === "applied" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-white/5 text-muted-foreground"}`}>
                  <LayoutList className="w-5 h-5" />
                  Check Applied Domains
                </button>
                <button onClick={() => setActiveTab("more")} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === "more" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-white/5 text-muted-foreground"}`}>
                  <PlusCircle className="w-5 h-5" />
                  Apply For More
                </button>
                <button onClick={() => setActiveTab("tasks")} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === "tasks" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-white/5 text-muted-foreground"}`}>
                  <ListTodo className="w-5 h-5" />
                  Complete Your Tasks
                </button>
              </motion.div>

              {/* Main Dashboard Area */}
              <div className="flex-1 glass rounded-3xl p-8 border border-white/5 min-h-[500px] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                {activeTab === "applied" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
                    <h2 className="text-2xl font-bold mb-6">Your Applications</h2>
                    <div className="grid gap-4">
                      {profile.domains.map((domain, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{domain}</h3>
                            <p className="text-sm text-green-400">Application Received</p>
                          </div>
                        </div>
                      ))}
                      {profile.domains.length === 0 && (
                        <p className="text-muted-foreground p-6 bg-white/5 rounded-2xl border border-white/5 text-center">No domains applied yet.</p>
                      )}
                    </div>

                    <div className="mt-auto pt-12 flex justify-center text-center">
                      <h2 className="text-3xl md:text-5xl font-black tracking-tight gradient-text py-2">
                        Are you excited to join us?
                      </h2>
                    </div>
                  </motion.div>
                )}

                {activeTab === "more" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
                    <h2 className="text-2xl font-bold mb-6">Explore More Domains</h2>
                    <div className="grid gap-4">
                      {unappliedRoles.map((role) => (
                        <div key={role.slug} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-lg">{role.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 max-w-md">{role.description}</p>
                          </div>
                          <button 
                            onClick={() => handleQuickApply(role.title)}
                            disabled={applyingDomain === role.title}
                            className="shrink-0 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center gap-2 cursor-pointer"
                          >
                            {applyingDomain === role.title ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                            Apply Now
                          </button>
                        </div>
                      ))}
                      {unappliedRoles.length === 0 && (
                        <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10">
                          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                          <h3 className="font-bold text-xl mb-2">You're all set!</h3>
                          <p className="text-muted-foreground">You have applied to all available domains.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "tasks" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
                    <h2 className="text-2xl font-bold mb-6">Domain Tasks</h2>
                    <p className="text-muted-foreground mb-6">Complete the required tasks for each of your applied domains.</p>
                    <div className="grid gap-4">
                      {profile.domains.map((domain, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                              <ListTodo className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{domain} Task</h3>
                              <p className="text-sm text-amber-400">Pending Completion</p>
                            </div>
                          </div>
                          <button className="shrink-0 px-6 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer">
                            View Task <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      ))}
                      {profile.domains.length === 0 && (
                        <p className="text-muted-foreground p-6 bg-white/5 rounded-2xl border border-white/5 text-center">Apply for a domain to see your tasks.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
