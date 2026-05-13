"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { ShieldCheck, User, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    userid: "",
    password: "",
    confirmPassword: "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.userid.length < 3) {
      toast.error("User ID must be at least 3 characters");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully!");
        setSuccess(true);
        setTimeout(() => router.push("/"), 3000);
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch (err) {
      toast.error("A network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold">Account Created!</h2>
        <p className="text-muted-foreground">Redirecting you to the home page...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 md:p-12 rounded-3xl border border-white/5 max-w-md w-full mx-auto"
    >
      <div className="mb-8 text-center space-y-2">
        <h2 className="text-3xl font-bold">Create Your Account</h2>
        <p className="text-muted-foreground text-sm">Create a User ID and Password to manage your applications.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">User ID</label>
          <div className="flex items-center bg-muted border border-white/5 rounded-xl px-4 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all group">
            <User className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors flex-shrink-0" />
            <input
              type="text"
              required
              className="w-full bg-transparent border-none py-3 px-3 text-foreground outline-none placeholder:text-muted-foreground/30"
              placeholder="Pick a unique ID"
              value={formData.userid}
              onChange={(e) => setFormData({ ...formData, userid: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
          <div className="flex items-center bg-muted border border-white/5 rounded-xl px-4 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all group">
            <Lock className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors flex-shrink-0" />
            <input
              type="password"
              required
              className="w-full bg-transparent border-none py-3 px-3 text-foreground outline-none placeholder:text-muted-foreground/30"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm Password</label>
          <div className="flex items-center bg-muted border border-white/5 rounded-xl px-4 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all group">
            <ShieldCheck className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors flex-shrink-0" />
            <input
              type="password"
              required
              className="w-full bg-transparent border-none py-3 px-3 text-foreground outline-none placeholder:text-muted-foreground/30"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2 group mt-4"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Complete Registration
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="pt-4 text-center">
          <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Already have an account? Back to Main Page
          </Link>
        </div>
      </form>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster position="top-center" richColors />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-primary" />}>
          <RegisterContent />
        </Suspense>
      </main>
    </div>
  );
}
