"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Users, Calendar, Mail, Phone, Briefcase, ExternalLink, ChevronDown, ChevronUp, CheckCircle2, User } from "lucide-react";

type Applicant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  college: string;
  domain: string;
  applied_at: string;
  userid: string | null;
  photo_link: string | null;
  age: string | null;
  dob: string | null;
  resume_link: string | null;
  linkedin: string | null;
  github: string | null;
  address: string | null;
};

export default function AdminDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/applicants-all")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setApplicants(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = applicants.filter(a => 
    a.name?.toLowerCase().includes(search.toLowerCase()) || 
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.domain?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-foreground bg-background selection:bg-primary/30 selection:text-primary">
      <Navbar showAdmin={false} />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" /> Task Applications
            </h1>
            <p className="text-muted-foreground">View and manage all applicant details, including updated profile data.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search applicants..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p>Loading applicants...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16 glass rounded-3xl border border-white/5">
                <p className="text-muted-foreground">No applicants found matching your criteria.</p>
              </div>
            ) : (
              filtered.map((applicant) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={applicant.id} 
                  className="glass rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10"
                >
                  <div 
                    onClick={() => setExpandedId(expandedId === applicant.id ? null : applicant.id)}
                    className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                        {applicant.photo_link ? (
                          <img src={applicant.photo_link} alt={applicant.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{applicant.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3"/> {applicant.domain}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {applicant.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                      <div className="text-right hidden md:block">
                        <div className="text-sm font-medium text-white/80">{new Date(applicant.applied_at).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">Applied</div>
                      </div>
                      {applicant.userid && (
                        <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Profile Updated
                        </div>
                      )}
                      <div className="text-muted-foreground">
                        {expandedId === applicant.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === applicant.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/5 bg-black/20"
                      >
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          
                          {/* Basic Old Details */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Application Info</h4>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                              <p className="font-medium">{applicant.phone}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">College</p>
                              <p className="font-medium">{applicant.college}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Applied For</p>
                              <p className="font-medium">{applicant.domain}</p>
                            </div>
                          </div>

                          {/* New Profile Details */}
                          {applicant.userid ? (
                            <>
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Personal Profile</h4>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Age & DOB</p>
                                  <p className="font-medium">{applicant.age || "N/A"} years • {applicant.dob || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                                  <p className="font-medium">{applicant.address || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">User ID</p>
                                  <p className="font-medium font-mono text-xs p-1 bg-white/5 rounded border border-white/10 inline-block">{applicant.userid}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Professional Links</h4>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Resume / Portfolio</p>
                                  {applicant.resume_link ? (
                                    <a href={applicant.resume_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 font-medium">
                                      View Document <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ) : <p className="text-muted-foreground italic">Not provided</p>}
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">LinkedIn</p>
                                  {applicant.linkedin ? (
                                    <a href={applicant.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 font-medium truncate max-w-xs">
                                      {applicant.linkedin}
                                    </a>
                                  ) : <p className="text-muted-foreground italic">Not provided</p>}
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">GitHub</p>
                                  {applicant.github ? (
                                    <a href={applicant.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 font-medium truncate max-w-xs">
                                      {applicant.github}
                                    </a>
                                  ) : <p className="text-muted-foreground italic">Not provided</p>}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="md:col-span-2 flex items-center justify-center p-6 border border-dashed border-white/10 rounded-2xl bg-white/5">
                              <p className="text-muted-foreground text-center">
                                This applicant has not completed their detailed profile via the Task Dashboard yet.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
