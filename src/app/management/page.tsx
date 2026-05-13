"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ManagementApplication() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
    college: "",
    domain: "Management",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = ["name", "email", "phone", "year"];
    const missingFields = requiredFields.filter((f) => !form[f as keyof typeof form]);

    if (missingFields.length > 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.needsAccount) {
          router.push(`/register?email=${encodeURIComponent(data.email)}&phone=${encodeURIComponent(data.phone)}`);
        } else {
          toast.success("Application submitted! Your account is already active.");
          router.push(`/success?domain=${encodeURIComponent(form.domain)}`);
        }
      } else {
        const data = await res.json();
        toast.error(data.error || "Submission failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" richColors />
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700">
        {/* Welcome Section */}
        <section className="glass rounded-2xl p-8 md:p-12 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Team <span className="gradient-text">Plenum</span>
          </h1>
          <h2 className="text-xl font-semibold text-primary uppercase tracking-widest">Management Domain Recruitment</h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Welcome to Team Plenum's Management Domain! We are a startup focused on building
            and scaling an e-commerce application. As part of the management domain, you'll be
            responsible for overseeing operations, coordinating between teams, managing timelines,
            and ensuring the smooth execution of our business goals.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Passionate about the e-commerce space? You're in the right place.</span>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold">Personal Information</h3>
            <div className="h-1 w-20 bg-primary rounded-full shadow-[0_0_10px_#cfff17]" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name <span className="text-primary">*</span></label>
            <input
              type="text"
              placeholder="Enter your name"
              className="form-input"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address <span className="text-primary">*</span></label>
            <input
              type="email"
              placeholder="your@email.com"
              className="form-input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number <span className="text-primary">*</span></label>
            <input
              type="tel"
              placeholder="+91 00000 00000"
              className="form-input"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Year of Study <span className="text-primary">*</span></label>
            <select
              className="form-input"
              value={form.year}
              onChange={(e) => update("year", e.target.value)}
              required
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium">College Name (VIT or other)</label>
            <input
              type="text"
              placeholder="Which college are you from?"
              className="form-input"
              value={form.college}
              onChange={(e) => update("college", e.target.value)}
            />
          </div>


          <div className="md:col-span-2 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Submit Application
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <footer className="py-12 text-center text-muted-foreground text-sm border-t border-border mt-12">
        &copy; {new Date().getFullYear()} Team Plenum · Trade Ecosystem
      </footer>
    </div>
  );
}
