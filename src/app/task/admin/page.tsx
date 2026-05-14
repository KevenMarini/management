"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Users, Calendar, Mail, Phone, Briefcase, ExternalLink, ChevronDown, ChevronUp, CheckCircle2, User, Trash2, LayoutList, PlusCircle, PenTool, Link2, FileText, ChevronRight, Eye, X, Lock } from "lucide-react";

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

type Task = {
  id: number;
  domain: string;
  technical_type: string | null;
  name: string;
  description: string;
  instructions: string;
  questions: TaskQuestion[];
};

type TaskQuestion = {
  id: number;
  question_text: string;
  answer_type: "text" | "link" | "file";
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"applicants" | "tasks" | "task_view" | "accepted" | "rejected">("applicants");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("task_admin_logged_in") === "true";
    if (loggedIn) setIsLoggedIn(true);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      if (res.ok) {
        sessionStorage.setItem("task_admin_logged_in", "true");
        setIsLoggedIn(true);
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // Applicants State
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // General State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [roles, setRoles] = useState<{title: string}[]>([]);
  
  // Manage Tasks State
  const [manageTaskDomain, setManageTaskDomain] = useState<string | null>(null);
  const [manageTaskTrack, setManageTaskTrack] = useState<string | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskInst, setNewTaskInst] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState<{text: string, type: "text" | "link" | "file"}[]>([{text: "", type: "text"}]);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Task View State
  const [viewTaskDomain, setViewTaskDomain] = useState<string | null>(null);
  const [viewTaskTrack, setViewTaskTrack] = useState<string | null>(null);
  const [viewSelectedTask, setViewSelectedTask] = useState<Task | null>(null);
  const [taskSubmissions, setTaskSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState<any[]>([]);
  const [expandedSubmission, setExpandedSubmission] = useState<number | null>(null);
  const [submissionFilter, setSubmissionFilter] = useState<"pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    fetch("/api/applicants-all")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setApplicants(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });

    fetch("/api/roles")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setRoles(data); })
      .catch(console.error);


    fetchTasks();
    fetchAllSubmissions();
  }, []);

  const fetchAllSubmissions = () => {
    fetch("/api/tasks/submissions?global=true")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAllSubmissions(data); })
      .catch(console.error);
  };

  const fetchTasks = () => {
    setLoadingTasks(true);
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setTasks(data); setLoadingTasks(false); })
      .catch(err => { console.error(err); setLoadingTasks(false); });
  };

  const fetchSubmissions = (taskId: number) => {
    setLoadingSubmissions(true);
    fetch(`/api/tasks/submissions?taskId=${taskId}&t=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setTaskSubmissions(data);
        else setTaskSubmissions([]); // ensure we clear it if there's an error
        setLoadingSubmissions(false);
      })
      .catch(err => { console.error(err); setTaskSubmissions([]); setLoadingSubmissions(false); });
  };



  const handleDeleteApplicant = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const res = await fetch("/api/delete-applicant", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error("Failed to delete application");
      setApplicants(applicants.filter(a => a.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/tasks?id=" + id, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!confirm("Are you sure you want to delete this applicant's submission? They will be able to submit again.")) return;
    try {
      const res = await fetch("/api/tasks/submissions?id=" + id, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete submission");
      setTaskSubmissions(taskSubmissions.filter(s => s.submission_id !== id));
      if (expandedSubmission === id) setExpandedSubmission(null);
    } catch (err: any) { alert(err.message); }
  };

  const handleUpdateSubmissionStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/tasks/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: id, status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setTaskSubmissions(taskSubmissions.map(s => s.submission_id === id ? { ...s, status } : s));
      if (expandedSubmission === id) setExpandedSubmission(null);
    } catch (err: any) { alert(err.message); }
  };

  const handleNumQuestionsChange = (num: number) => {
    setNumQuestions(num);
    const newQs = [...questions];
    if (num > newQs.length) {
      for (let i = newQs.length; i < num; i++) newQs.push({ text: "", type: "text" });
    } else {
      newQs.splice(num);
    }
    setQuestions(newQs);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTask(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: manageTaskDomain,
          technical_type: manageTaskTrack,
          name: newTaskName,
          description: newTaskDesc,
          instructions: newTaskInst,
          questions
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create task");
      
      setNewTaskName(""); setNewTaskDesc(""); setNewTaskInst("");
      setNumQuestions(1); setQuestions([{text: "", type: "text"}]);
      setIsCreatingTask(false);
      alert("Task created successfully!");
      fetchTasks();
    } catch (err: any) { alert(err.message); } 
    finally { setIsSubmittingTask(false); }
  };

  const filteredApplicants = applicants.filter(a => 
    a.name?.toLowerCase().includes(search.toLowerCase()) || 
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.domain?.toLowerCase().includes(search.toLowerCase())
  );

  const isDevDomain = (domain: string) => domain.toLowerCase().includes("develop") || domain.toLowerCase() === "technical";

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Navbar showAdmin={false} />
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom duration-500 pt-20">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Task Admin Portal</h1>
            <p className="text-muted-foreground">Authorized access only</p>
          </div>
          <div className="glass rounded-2xl p-8 shadow-2xl border border-white/5">
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-white/70">
                  <User className="w-4 h-4 text-primary" /> Username
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-white/70">
                  <Lock className="w-4 h-4 text-primary" /> Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground bg-background selection:bg-primary/30 selection:text-primary flex flex-col">
      <Navbar showAdmin={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-28 pb-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button onClick={() => setActiveTab("applicants")} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === "applicants" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-white/5 text-muted-foreground"}`}>
            <Users className="w-5 h-5" /> Applicants
          </button>
          <button onClick={() => { setActiveTab("tasks"); setManageTaskDomain(null); setManageTaskTrack(null); setIsCreatingTask(false); }} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === "tasks" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-white/5 text-muted-foreground"}`}>
            <PenTool className="w-5 h-5" /> Manage Tasks
          </button>
          <button 
                onClick={() => { setActiveTab("task_view"); setViewSelectedTask(null); setViewTaskDomain(null); setViewTaskTrack(null); setSubmissionFilter("pending"); }} 
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === "task_view" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-white/5"}`}
              >
                <Eye className="w-5 h-5" />
                <span className="font-bold">Task View</span>
              </button>

              <button 
                onClick={() => { setActiveTab("accepted"); setViewSelectedTask(null); setViewTaskDomain(null); setViewTaskTrack(null); setSubmissionFilter("approved"); }} 
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === "accepted" ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "text-muted-foreground hover:bg-white/5"}`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">Accepted List</span>
              </button>

              <button 
                onClick={() => { setActiveTab("rejected"); setViewSelectedTask(null); setViewTaskDomain(null); setViewTaskTrack(null); setSubmissionFilter("rejected"); }} 
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === "rejected" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-muted-foreground hover:bg-white/5"}`}
              >
                <X className="w-5 h-5" />
                <span className="font-bold">Rejected List</span>
              </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* APPLICANTS TAB */}
          {activeTab === "applicants" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Previous applicants code */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">Applicants Overview</h1>
                  <p className="text-muted-foreground">View and manage all applicant details.</p>
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
                  {filteredApplicants.length === 0 ? (
                    <div className="text-center py-16 glass rounded-3xl border border-white/5">
                      <p className="text-muted-foreground">No applicants found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredApplicants.map((applicant) => (
                      <motion.div key={applicant.id} className="glass rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10">
                        <div onClick={() => setExpandedId(expandedId === applicant.id ? null : applicant.id)} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                              {applicant.photo_link ? <img src={applicant.photo_link} alt={applicant.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6" />}
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
                            {applicant.userid && <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Profile Updated</div>}
                            <button onClick={(e) => handleDeleteApplicant(applicant.id, e)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete Application"><Trash2 className="w-4 h-4" /></button>
                            <div className="text-muted-foreground ml-2">{expandedId === applicant.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedId === applicant.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5 bg-black/20">
                              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Application Info</h4>
                                  <div><p className="text-xs text-muted-foreground mb-1">Phone Number</p><p className="font-medium">{applicant.phone}</p></div>
                                  <div><p className="text-xs text-muted-foreground mb-1">College</p><p className="font-medium">{applicant.college}</p></div>
                                  <div><p className="text-xs text-muted-foreground mb-1">Applied For</p><p className="font-medium">{applicant.domain}</p></div>
                                </div>
                                {applicant.userid ? (
                                  <>
                                    <div className="space-y-4">
                                      <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Personal Profile</h4>
                                      <div><p className="text-xs text-muted-foreground mb-1">Age & DOB</p><p className="font-medium">{applicant.age || "N/A"} years • {applicant.dob || "N/A"}</p></div>
                                      <div><p className="text-xs text-muted-foreground mb-1">Address</p><p className="font-medium">{applicant.address || "N/A"}</p></div>
                                      <div><p className="text-xs text-muted-foreground mb-1">User ID</p><p className="font-medium font-mono text-xs p-1 bg-white/5 rounded border border-white/10 inline-block">{applicant.userid}</p></div>
                                    </div>
                                    <div className="space-y-4">
                                      <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Professional Links</h4>
                                      <div><p className="text-xs text-muted-foreground mb-1">Resume / Portfolio</p>{applicant.resume_link ? <a href={applicant.resume_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 font-medium">View Document <ExternalLink className="w-3 h-3" /></a> : <p className="text-muted-foreground italic">Not provided</p>}</div>
                                      <div><p className="text-xs text-muted-foreground mb-1">LinkedIn</p>{applicant.linkedin ? <a href={applicant.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 font-medium truncate max-w-xs">{applicant.linkedin}</a> : <p className="text-muted-foreground italic">Not provided</p>}</div>
                                      <div><p className="text-xs text-muted-foreground mb-1">GitHub</p>{applicant.github ? <a href={applicant.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 font-medium truncate max-w-xs">{applicant.github}</a> : <p className="text-muted-foreground italic">Not provided</p>}</div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="md:col-span-2 flex items-center justify-center p-6 border border-dashed border-white/10 rounded-2xl bg-white/5"><p className="text-muted-foreground text-center">This applicant has not completed their detailed profile yet.</p></div>
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
            </motion.div>
          )}

          {/* MANAGE TASKS TAB */}
          {activeTab === "tasks" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {!manageTaskDomain ? (
                <>
                  <h2 className="text-3xl font-bold mb-2">Manage Tasks by Domain</h2>
                  <p className="text-muted-foreground mb-6">Select a domain to view or create tasks.</p>
                  <div className="grid gap-4">
                    {roles.map(r => (
                      <div key={r.title} onClick={() => setManageTaskDomain(r.title)} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><Briefcase className="w-6 h-6" /></div>
                          <h3 className="font-bold text-xl">{r.title}</h3>
                        </div>
                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                      </div>
                    ))}
                  </div>
                </>
              ) : isDevDomain(manageTaskDomain) && !manageTaskTrack ? (
                <>
                  <button onClick={() => setManageTaskDomain(null)} className="text-muted-foreground hover:text-white flex items-center gap-2 mb-4"><ChevronRight className="w-4 h-4 rotate-180" /> Back to Domains</button>
                  <h2 className="text-3xl font-bold mb-2">{manageTaskDomain} - Select Track</h2>
                  <p className="text-muted-foreground mb-6">Which track are you managing tasks for?</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Frontend", "Backend"].map(track => (
                      <button key={track} onClick={() => setManageTaskTrack(track)} className="p-8 rounded-2xl glass border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all text-center cursor-pointer group">
                        <PenTool className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-xl">{track}</h3>
                      </button>
                    ))}
                  </div>
                </>
              ) : !isCreatingTask ? (
                <>
                  <button onClick={() => { if(isDevDomain(manageTaskDomain)) setManageTaskTrack(null); else setManageTaskDomain(null); }} className="text-muted-foreground hover:text-white flex items-center gap-2 mb-4"><ChevronRight className="w-4 h-4 rotate-180" /> Back</button>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-3xl font-bold">{manageTaskDomain} Tasks</h2>
                      {manageTaskTrack && <span className="px-3 py-1 mt-2 inline-block rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold uppercase">{manageTaskTrack} Track</span>}
                    </div>
                    <button onClick={() => setIsCreatingTask(true)} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
                      <PlusCircle className="w-5 h-5" /> New Task
                    </button>
                  </div>

                  {loadingTasks ? <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
                    <div className="grid gap-4">
                      {tasks.filter(t => t.domain.toLowerCase() === manageTaskDomain.toLowerCase() && (!manageTaskTrack || t.technical_type?.toLowerCase() === manageTaskTrack.toLowerCase())).map(task => (
                        <div key={task.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{task.name}</h3>
                            <p className="text-muted-foreground text-sm mb-4">{task.description}</p>
                            <span className="px-3 py-1 bg-white/10 text-white/80 rounded-lg text-xs font-medium">{task.questions?.length || 0} Questions</span>
                          </div>
                          <button onClick={() => handleDeleteTask(task.id)} className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                        </div>
                      ))}
                      {tasks.filter(t => t.domain.toLowerCase() === manageTaskDomain.toLowerCase() && (!manageTaskTrack || t.technical_type?.toLowerCase() === manageTaskTrack.toLowerCase())).length === 0 && (
                        <p className="text-muted-foreground p-6 bg-white/5 rounded-2xl text-center">No tasks found for this domain.</p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                  <button onClick={() => setIsCreatingTask(false)} className="text-muted-foreground hover:text-white flex items-center gap-2 mb-6"><ChevronRight className="w-4 h-4 rotate-180" /> Cancel Creation</button>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><PlusCircle className="w-6 h-6 text-primary" /> Create New Task</h2>
                  <form onSubmit={handleCreateTask} className="space-y-6 max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 pointer-events-none">
                      <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">Domain</label><input type="text" value={manageTaskDomain} readOnly className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
                      {manageTaskTrack && <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">Track</label><input type="text" value={manageTaskTrack} readOnly className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>}
                    </div>
                    <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">Task Name</label><input type="text" required value={newTaskName} onChange={e => setNewTaskName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-white" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">Description</label><textarea required rows={3} value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-white resize-none" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">Instructions</label><textarea required rows={3} value={newTaskInst} onChange={e => setNewTaskInst(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-white resize-none" /></div>
                    
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Task Questions</h3>
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-muted-foreground">Number of questions:</label>
                          <input type="number" min="1" max="20" value={numQuestions} onChange={e => handleNumQuestionsChange(parseInt(e.target.value) || 1)} className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-1 outline-none text-white text-center" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        {questions.map((q, i) => (
                          <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex-1 space-y-2">
                              <label className="text-xs text-muted-foreground uppercase tracking-wider">Question {i + 1}</label>
                              <input type="text" required value={q.text} onChange={e => { const n = [...questions]; n[i].text = e.target.value; setQuestions(n); }} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 outline-none text-white" />
                            </div>
                            <div className="sm:w-48 space-y-2">
                              <label className="text-xs text-muted-foreground uppercase tracking-wider">Answer Type</label>
                              <select value={q.type} onChange={e => { const n = [...questions]; n[i].type = e.target.value as "text" | "link" | "file"; setQuestions(n); }} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 outline-none text-white appearance-none">
                                <option value="text">Text Response</option>
                                <option value="link">Link (URL)</option>
                                <option value="file">File Upload</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmittingTask} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                      {isSubmittingTask ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} Publish Task
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          {/* TASK VIEW/ACCEPTED/REJECTED TABS */}
            {(activeTab === "task_view" || activeTab === "accepted" || activeTab === "rejected") && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
                {!viewTaskDomain ? (
                  <>
                    <h2 className="text-3xl font-bold mb-6">
                      {activeTab === "task_view" ? "Task View (Pending)" : activeTab === "accepted" ? "Accepted Submissions" : "Rejected Submissions"}
                    </h2>
                    <p className="text-muted-foreground mb-8">Select a domain to view applicant submissions.</p>
                  <div className="grid gap-4">
                    {roles.map(r => {
                      const domainSubmissions = allSubmissions.filter(s => s.domain === r.title);
                      const pendingCount = domainSubmissions.filter(s => !s.status || s.status === 'pending').length;
                      const acceptedCount = domainSubmissions.filter(s => s.status === 'approved').length;
                      const rejectedCount = domainSubmissions.filter(s => s.status === 'rejected').length;
                      
                      const countToDisplay = activeTab === "task_view" ? pendingCount : 
                                           activeTab === "accepted" ? acceptedCount : rejectedCount;
                      
                      const label = activeTab === "task_view" ? "Pending" : 
                                  activeTab === "accepted" ? "Accepted" : "Rejected";
                                  
                      const badgeColor = activeTab === "task_view" ? "bg-amber-500/20 text-amber-400" : 
                                       activeTab === "accepted" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400";

                      return (
                        <div key={r.title} onClick={() => setViewTaskDomain(r.title)} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 hover:border-primary/50 transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              activeTab === "task_view" ? "bg-amber-500/20 text-amber-400" :
                              activeTab === "accepted" ? "bg-green-500/20 text-green-400" :
                              "bg-red-500/20 text-red-400"
                            }`}>
                              {activeTab === "task_view" ? <Eye className="w-6 h-6" /> : 
                               activeTab === "accepted" ? <CheckCircle2 className="w-6 h-6" /> : <X className="w-6 h-6" />}
                            </div>
                            <div>
                              <h3 className="font-bold text-xl">{r.title}</h3>
                              <div className="text-[10px] text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                <span className="flex items-center gap-1.5">
                                  <Users className="w-3 h-3 text-primary" />
                                  {applicants.filter(a => a.domain === r.title).length} Total Applicants
                                </span>
                                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${badgeColor}`}>
                                  <span className={`w-1 h-1 rounded-full ${activeTab === 'task_view' ? 'bg-amber-500' : activeTab === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`} />
                                  {countToDisplay} {label} Submissions
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : isDevDomain(viewTaskDomain) && !viewTaskTrack ? (
                <>
                  <button onClick={() => setViewTaskDomain(null)} className="text-muted-foreground hover:text-white flex items-center gap-2 mb-4"><ChevronRight className="w-4 h-4 rotate-180" /> Back to Domains</button>
                  <h2 className="text-3xl font-bold mb-2">{viewTaskDomain} - Select Track</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {["Frontend", "Backend"].map(track => (
                      <button key={track} onClick={() => setViewTaskTrack(track)} className="p-8 rounded-2xl glass border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all text-center cursor-pointer group">
                        <FileText className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-xl">{track}</h3>
                      </button>
                    ))}
                  </div>
                </>
              ) : !viewSelectedTask ? (
                <>
                  <button onClick={() => { if(isDevDomain(viewTaskDomain)) setViewTaskTrack(null); else setViewTaskDomain(null); }} className="text-muted-foreground hover:text-white flex items-center gap-2 mb-4"><ChevronRight className="w-4 h-4 rotate-180" /> Back</button>
                  <h2 className="text-3xl font-bold mb-6">{viewTaskDomain} Tasks</h2>
                  <div className="grid gap-4">
                    {tasks.filter(t => t.domain.toLowerCase() === viewTaskDomain.toLowerCase() && (!viewTaskTrack || t.technical_type?.toLowerCase() === viewTaskTrack.toLowerCase())).map(task => (
                      <div key={task.id} onClick={() => { setViewSelectedTask(task); fetchSubmissions(task.id); }} className="glass p-6 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors group">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{task.name}</h3>
                        <p className="text-muted-foreground text-sm">{task.description}</p>
                      </div>
                    ))}
                    {tasks.filter(t => t.domain.toLowerCase() === viewTaskDomain.toLowerCase()).length === 0 && (
                      <p className="text-muted-foreground p-6 bg-white/5 rounded-2xl text-center">No tasks exist for this domain yet.</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <button onClick={() => { setViewSelectedTask(null); setTaskSubmissions([]); setExpandedSubmission(null); }} className="text-muted-foreground hover:text-white flex items-center gap-2 mb-4"><ChevronRight className="w-4 h-4 rotate-180" /> Back to Tasks</button>
                  <h2 className="text-3xl font-bold">{viewSelectedTask.name} - Submissions</h2>
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <button onClick={() => setSubmissionFilter("pending")} className={`px-4 py-2 rounded-xl font-bold transition-all ${submissionFilter === 'pending' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-white/5'}`}>
                      Pending ({taskSubmissions.filter(s => !s.status || s.status === 'pending').length})
                    </button>
                    <button onClick={() => setSubmissionFilter("approved")} className={`px-4 py-2 rounded-xl font-bold transition-all ${submissionFilter === 'approved' ? 'bg-green-500 text-white' : 'text-muted-foreground hover:bg-white/5'}`}>
                      Approved ({taskSubmissions.filter(s => s.status === 'approved').length})
                    </button>
                    <button onClick={() => setSubmissionFilter("rejected")} className={`px-4 py-2 rounded-xl font-bold transition-all ${submissionFilter === 'rejected' ? 'bg-red-500 text-white' : 'text-muted-foreground hover:bg-white/5'}`}>
                      Rejected ({taskSubmissions.filter(s => s.status === 'rejected').length})
                    </button>
                  </div>
                  
                  {loadingSubmissions ? <div className="py-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div> : 
                    taskSubmissions.filter(s => (submissionFilter === 'pending' ? (!s.status || s.status === 'pending') : s.status === submissionFilter)).length === 0 ? <p className="glass p-6 text-center text-muted-foreground rounded-2xl">No submissions found in this list.</p> :
                    <div className="space-y-4">
                      {taskSubmissions.filter(s => (submissionFilter === 'pending' ? (!s.status || s.status === 'pending') : s.status === submissionFilter)).map(sub => (
                        <div key={sub.submission_id} className="glass rounded-2xl border border-white/5 overflow-hidden">
                          <div onClick={() => setExpandedSubmission(expandedSubmission === sub.submission_id ? null : sub.submission_id)} className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                            <div>
                              <h3 className="font-bold text-lg">{sub.user_name}</h3>
                              <p className="text-sm text-muted-foreground font-mono mt-1">{sub.userid}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-white/50">{new Date(sub.created_at).toLocaleString()}</span>
                              {expandedSubmission === sub.submission_id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                            </div>
                          </div>
                          <AnimatePresence>
                            {expandedSubmission === sub.submission_id && (
                              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/5 bg-black/20">
                                <div className="p-6 space-y-6">
                                    {sub.answers.map((ans: any, i: number) => (
                                      <div key={i}>
                                        <p className="font-medium text-white/90 mb-2"><span className="text-primary font-bold mr-2">Q{i+1}.</span>{ans.question_text}</p>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-muted-foreground whitespace-pre-wrap">
                                          {ans.answer_text.startsWith("http") ? <a href={ans.answer_text} target="_blank" className="text-blue-400 hover:underline flex items-center gap-1"><Link2 className="w-4 h-4"/> {ans.answer_text}</a> : ans.answer_text}
                                        </div>
                                      </div>
                                    ))}
                                    {sub.answers.length === 0 && <p className="text-muted-foreground italic">No answers provided.</p>}
                                    <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2 justify-end">
                                      {submissionFilter === 'pending' && (
                                        <>
                                          <button 
                                            onClick={() => handleUpdateSubmissionStatus(sub.submission_id, 'approved')}
                                            className="px-4 py-2 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors flex items-center gap-2 text-sm font-bold"
                                          >
                                            <CheckCircle2 className="w-4 h-4" /> Accept
                                          </button>
                                          <button 
                                            onClick={() => handleUpdateSubmissionStatus(sub.submission_id, 'rejected')}
                                            className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors flex items-center gap-2 text-sm font-bold"
                                          >
                                            <X className="w-4 h-4" /> Reject
                                          </button>
                                        </>
                                      )}
                                      <button 
                                        onClick={() => handleDeleteSubmission(sub.submission_id)}
                                        className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-sm font-bold"
                                      >
                                        <Trash2 className="w-4 h-4" /> Delete Applicant's Submission
                                      </button>
                                    </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  }
                </div>
              )}
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
