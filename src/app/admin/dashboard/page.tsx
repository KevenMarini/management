"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { Download, Search, Users, ExternalLink, Loader2, Calendar, Trash2, ShieldCheck, History, Filter, X, ArrowRight, Mail, Phone, MapPin, Briefcase, Code2, GraduationCap, Info, Lock, User } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  year: string;
  college: string | null;
  interest: string;
  experience: string;
  linkedin: string | null;
  skills: string;
  questions: string | null;
  domain: string;
  created_at: string;
  userid?: string;
  user_password?: string;
}

interface AdminLog {
  id: number;
  admin_username: string;
  action: string;
  details: string;
  created_at: string;
}

const DOMAINS = ["All Domains", "Management", "Design", "Frontend", "Backend"];

export default function AdminDashboard() {
  const router = useRouter();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All Domains");
  const [view, setView] = useState<"applicants" | "logs" | "announcements">("applicants");
  const [logCategory, setLogCategory] = useState<"All" | "Sign In" | "Deletions" | "Announcements">("All");
  const [currentAdmin, setCurrentAdmin] = useState<string | null>(null);
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [announcementsList, setAnnouncementsList] = useState<any[]>([]);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    link_text: "",
    link_url: "",
  });

  useEffect(() => {
    if (sessionStorage.getItem("admin_logged_in") !== "true") {
      router.push("/admin");
      return;
    }
    const admin = sessionStorage.getItem("admin_username");
    setCurrentAdmin(admin);
    fetchApplicants();
    fetchAnnouncementsList();
    if (admin === "Keven1") {
      fetchLogs();
    }
  }, [router]);

  const fetchAnnouncementsList = async () => {
    try {
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncementsList(data);
      }
    } catch (error) {
      console.error("Failed to fetch announcements");
    }
  };

  const fetchApplicants = async () => {
    try {
      const admin = sessionStorage.getItem("admin_username");
      const res = await fetch(`/api/applicants?username=${admin}`);
      if (res.ok) {
        const data = await res.json();
        // Ensure every applicant has a domain field for filtering
        const processedData = data.map((a: any) => ({
          ...a,
          domain: a.domain || "Management"
        }));
        setApplicants(processedData);
      }
    } catch (error) {
      toast.error("Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/logs?username=${sessionStorage.getItem("admin_username")}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch logs");
    }
  };

  const logAction = async (action: string, details: string) => {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentAdmin,
          action,
          details
        }),
      });
      if (currentAdmin === "Keven1") fetchLogs();
    } catch (error) {
      console.error("Logging failed");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete applicant "${name}"?`)) return;

    try {
      const res = await fetch(`/api/applicants/${id}?username=${currentAdmin}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`Applicant ${name} deleted`);
        setApplicants(applicants.filter((a) => a.id !== id));
        logAction("Delete Applicant", `Deleted applicant: ${name} (ID: ${id})`);
      } else {
        toast.error("Failed to delete applicant");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/announcements?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Announcement deleted");
        fetchAnnouncementsList();
        logAction("Delete Announcement", `Deleted announcement ID: ${id}`);
      } else {
        toast.error("Failed to delete announcement");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in");
    sessionStorage.removeItem("admin_username");
    router.push("/admin");
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.content) {
      toast.error("Title and Content are required");
      return;
    }
    setAnnouncementLoading(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...announcementForm,
          author: "Team Admin", // Always show Team Admin publicly
        }),
      });
      if (res.ok) {
        toast.success("Announcement posted successfully!");
        setAnnouncementForm({ title: "", content: "", link_text: "", link_url: "" });
        fetchAnnouncementsList();
        logAction("Post Announcement", `"${announcementForm.title}" posted by ${currentAdmin}`);
      } else {
        toast.error("Failed to post announcement");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const exportToCSV = () => {
    if (applicants.length === 0) return;
    const headers = ["Name", "Email", "Phone", "Year", "College", "Domain", "Interest", "Experience", "LinkedIn", "Skills", "Questions", "Submitted At"];
    const rows = applicants.map((a) => [
      a.name, a.email, a.phone, a.year, a.college || "", a.domain, a.interest || "", a.experience || "", a.linkedin || "", a.skills || "", a.questions || "", new Date(a.created_at).toLocaleString(),
    ]);
    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `applicants_${selectedDomain.replace(" ", "_")}_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    logAction("Export CSV", `Exported ${applicants.length} applicants (${selectedDomain}) to CSV`);
  };

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.skills || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDomain = selectedDomain === "All Domains" || a.domain === selectedDomain;
    
    return matchesSearch && matchesDomain;
  });

  const isSuperAdmin = currentAdmin === "Keven1";

  return (
    <div className="min-h-screen bg-background relative">
      <Toaster position="top-center" richColors />
      <Navbar showAdmin={false} showLogout onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full w-fit">
              <ShieldCheck className="w-3 h-3" />
              Logged in as {currentAdmin}
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold tracking-tight">Admin Portal</h1>
              <p className="text-muted-foreground">Manage recruitment data and filter by domain</p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex bg-muted p-1 rounded-lg w-fit">
                <button
                  onClick={() => setView("applicants")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === "applicants" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Applicants
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => setView("logs")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === "logs" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    System Logs
                  </button>
                )}
                <button
                  onClick={() => setView("announcements")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === "announcements" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Announcements
                </button>
              </div>

              {view === "applicants" && (
                <div className="flex bg-muted p-1 rounded-lg w-fit">
                  {DOMAINS.map((domain) => (
                    <button
                      key={domain}
                      onClick={() => setSelectedDomain(domain)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${selectedDomain === domain ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {view === "applicants" && (
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  className="form-input pl-10 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={exportToCSV}
                disabled={filteredApplicants.length === 0}
                className="btn-primary py-2 px-4 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          )}
        </header>

        {view === "applicants" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p>Syncing application data...</p>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="p-20 text-center text-muted-foreground space-y-2 glass rounded-2xl">
                <Users className="w-12 h-12 mx-auto opacity-20" />
                <p className="text-lg font-medium">No records found for {selectedDomain}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredApplicants.map((a) => (
                  <div 
                    key={a.id}
                    onClick={() => setSelectedApplicant(a)}
                    className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/50 hover:bg-white/[0.03] transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          a.domain === "Management" ? "bg-blue-500/10 text-blue-500" :
                          a.domain === "Design" ? "bg-purple-500/10 text-purple-500" :
                          a.domain === "Frontend" ? "bg-green-500/10 text-green-500" :
                          "bg-orange-500/10 text-orange-500"
                        }`}>
                          {a.domain}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(a.id, a.name);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{a.name}</h3>
                        <p className="text-muted-foreground text-sm font-medium">{a.phone}</p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold">
                          {new Date(a.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-wider">
                          View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedApplicant && (
              <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={() => setSelectedApplicant(null)}>
                <div 
                  className="bg-[#0a0a0a] border border-white/10 p-8 md:p-10 rounded-[2.5rem] w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                  
                  <button 
                    onClick={() => setSelectedApplicant(null)} 
                    className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white transition-all"
                  >
                    <X className="w-6 h-6"/>
                  </button>

                  <div className="relative space-y-8">
                    <header className="space-y-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                        selectedApplicant.domain === "Management" ? "bg-blue-500/10 text-blue-500" :
                        selectedApplicant.domain === "Design" ? "bg-purple-500/10 text-purple-500" :
                        selectedApplicant.domain === "Frontend" ? "bg-green-500/10 text-green-500" :
                        "bg-orange-500/10 text-orange-500"
                      }`}>
                        {selectedApplicant.domain} Domain
                      </span>
                      <h2 className="text-4xl font-black tracking-tight">{selectedApplicant.name}</h2>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> {selectedApplicant.email}</div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {selectedApplicant.phone}</div>
                      </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      <div className="space-y-4">
                        <DetailItem icon={<GraduationCap className="w-4 h-4" />} label="Education" value={`${selectedApplicant.year}, ${selectedApplicant.college || 'N/A'}`} />
                        <DetailItem 
                          icon={<Code2 className="w-4 h-4" />} 
                          label={selectedApplicant.domain === "Frontend" || selectedApplicant.domain === "Backend" ? "Programming Languages" : "Unique Skills"} 
                          value={selectedApplicant.skills || "N/A"} 
                        />
                        {(currentAdmin === "Keven1" || currentAdmin === "Smitha2") && selectedApplicant.userid && (
                          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Access Credentials</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-sm"><User className="w-3.5 h-3.5" /> {selectedApplicant.userid}</div>
                              <div className="flex items-center gap-2 text-sm font-mono"><Lock className="w-3.5 h-3.5" /> {selectedApplicant.user_password}</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <DetailItem 
                          icon={<Info className="w-4 h-4" />} 
                          label={
                            selectedApplicant.domain === "Frontend" ? "Website Link" :
                            selectedApplicant.domain === "Design" ? "Why Take You" :
                            selectedApplicant.domain === "Management" ? "Why Interested" :
                            "Statement of Interest"
                          } 
                          value={selectedApplicant.interest || "N/A"} 
                        />
                        {selectedApplicant.experience && (
                          <DetailItem 
                            icon={<Briefcase className="w-4 h-4" />} 
                            label={selectedApplicant.domain === "Frontend" || selectedApplicant.domain === "Backend" ? "Projects" : "Experience"} 
                            value={selectedApplicant.experience || "N/A"} 
                          />
                        )}
                      </div>
                    </div>

                    {selectedApplicant.linkedin && (
                      <div className="pt-6 border-t border-white/5">
                        <a 
                          href={selectedApplicant.linkedin} 
                          target="_blank" 
                          className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" /> View Professional Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : view === "logs" ? (
          <div className="glass rounded-2xl overflow-hidden border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/5">
              {/* Category filter tabs */}
              <div className="flex bg-muted p-1 rounded-lg gap-0.5">
                {(["All", "Sign In", "Deletions", "Announcements"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLogCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      logCategory === cat ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">
                  {logs.filter((log) => {
                    if (logCategory === "All") return true;
                    if (logCategory === "Sign In") return log.action === "Login" || log.action === "Login Failed";
                    if (logCategory === "Deletions") return log.action === "Delete Applicant" || log.action === "Delete Announcement";
                    if (logCategory === "Announcements") return log.action === "Post Announcement";
                    return true;
                  }).length} entries
                </p>
                <button
                  onClick={fetchLogs}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white/5 hover:bg-primary/20 text-primary rounded-lg transition-all"
                >
                  <History className="w-3 h-3" />
                  Refresh
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-muted-foreground border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Time</th>
                    <th className="px-6 py-4 font-semibold">Admin</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                    <th className="px-6 py-4 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(() => {
                    const filtered = logs.filter((log) => {
                      if (logCategory === "All") return true;
                      if (logCategory === "Sign In") return log.action === "Login" || log.action === "Login Failed";
                      if (logCategory === "Deletions") return log.action === "Delete Applicant" || log.action === "Delete Announcement";
                      if (logCategory === "Announcements") return log.action === "Post Announcement";
                      return true;
                    });
                    if (filtered.length === 0) return (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">
                          <History className="w-10 h-10 mx-auto mb-3 opacity-20" />
                          <p className="text-sm font-medium">No logs in this category</p>
                          <p className="text-xs mt-1 opacity-60">Actions will appear here once recorded</p>
                        </td>
                      </tr>
                    );
                    return filtered.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.admin_username === "Keven1" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            {log.admin_username}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            log.action === "Login" ? "bg-green-500/10 text-green-400" :
                            log.action === "Login Failed" ? "bg-red-500/10 text-red-400" :
                            log.action === "Delete Applicant" || log.action === "Delete Announcement" ? "bg-orange-500/10 text-orange-400" :
                            log.action === "Post Announcement" ? "bg-blue-500/10 text-blue-400" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs italic">
                          {log.details}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        ) : view === "announcements" ? (
          <div className="glass rounded-2xl p-8 border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Post New Announcement</h2>
            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title <span className="text-primary">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Temporary Recruitment Website Launched"
                  className="form-input"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content <span className="text-primary">*</span></label>
                <textarea
                  placeholder="Hi everyone, we have launched..."
                  className="form-input min-h-[150px] resize-none"
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Button Text (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Visit Recruitment Site"
                    className="form-input"
                    value={announcementForm.link_text}
                    onChange={(e) => setAnnouncementForm({...announcementForm, link_text: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Button Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://example.com"
                    className="form-input"
                    value={announcementForm.link_url}
                    onChange={(e) => setAnnouncementForm({...announcementForm, link_url: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={announcementLoading}
                  className="btn-primary w-full flex justify-center items-center gap-2"
                >
                  {announcementLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Announcement"}
                </button>
              </div>
            </form>

            <div className="mt-12 border-t border-white/10 pt-8">
              <h3 className="text-xl font-bold mb-4">Existing Announcements</h3>
              <div className="space-y-4">
                {announcementsList.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No announcements found.</p>
                ) : (
                  announcementsList.map((ann) => (
                    <div key={ann.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                      <div>
                        <h4 className="font-bold">{ann.title}</h4>
                        <p className="text-xs text-muted-foreground">{new Date(ann.created_at).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="p-2 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
        {icon}
        {label}
      </div>
      <p className="text-sm text-white/80 leading-relaxed">{value}</p>
    </div>
  );
}
