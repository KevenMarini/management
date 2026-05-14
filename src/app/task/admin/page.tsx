"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Users, Calendar, Mail, Phone, Briefcase, ExternalLink, ChevronDown, ChevronUp, CheckCircle2, User, Trash2, LayoutList, PlusCircle, PenTool, Link2, FileText } from "lucide-react";

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
  answer_type: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"applicants" | "tasks">("applicants");
  
  // Applicants State
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [roles, setRoles] = useState<{title: string}[]>([]);
  
  const [newTaskDomain, setNewTaskDomain] = useState("");
  const [newTaskTechType, setNewTaskTechType] = useState("Frontend");
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskInst, setNewTaskInst] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState<{text: string, type: "text" | "link"}[]>([{text: "", type: "text"}]);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  useEffect(() => {
    // Fetch Applicants
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

    // Fetch Roles
    fetch("/api/roles")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRoles(data);
      })
      .catch(console.error);

    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setLoadingTasks(true);
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
        setLoadingTasks(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingTasks(false);
      });
  };

  const handleDeleteApplicant = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    
    try {
      const res = await fetch("/api/delete-applicant", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error("Failed to delete application");
      setApplicants(applicants.filter(a => a.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch("/api/tasks?id=" + id, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleNumQuestionsChange = (num: number) => {
    setNumQuestions(num);
    const newQs = [...questions];
    if (num > newQs.length) {
      for (let i = newQs.length; i < num; i++) {
        newQs.push({ text: "", type: "text" });
      }
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
          domain: newTaskDomain,
          technical_type: newTaskDomain.toLowerCase() === "technical" ? newTaskTechType : null,
          name: newTaskName,
          description: newTaskDesc,
          instructions: newTaskInst,
          questions
        })
      });
      if (!res.ok) throw new Error("Failed to create task");
      
      // Reset form
      setNewTaskDomain("");
      setNewTaskName("");
      setNewTaskDesc("");
      setNewTaskInst("");
      setNumQuestions(1);
      setQuestions([{text: "", type: "text"}]);
      alert("Task created successfully!");
      fetchTasks();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const filteredApplicants = applicants.filter(a => 
    a.name?.toLowerCase().includes(search.toLowerCase()) || 
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.domain?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-foreground bg-background selection:bg-primary/30 selection:text-primary flex flex-col">
      <Navbar showAdmin={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-28 pb-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button onClick={() => setActiveTab("applicants")} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === "applicants" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-white/5 text-muted-foreground"}`}>
            <Users className="w-5 h-5" /> Applicants
          </button>
          <button onClick={() => setActiveTab("tasks")} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === "tasks" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-white/5 text-muted-foreground"}`}>
            <PenTool className="w-5 h-5" /> Manage Tasks
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "applicants" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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
                            <button 
                              onClick={(e) => handleDeleteApplicant(applicant.id, e)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                              title="Delete Application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="text-muted-foreground ml-2">
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
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <div className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><PlusCircle className="w-6 h-6 text-primary" /> Create New Task</h2>
                
                <form onSubmit={handleCreateTask} className="space-y-6 relative z-10 max-w-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Domain</label>
                      <select 
                        required
                        value={newTaskDomain} 
                        onChange={e => setNewTaskDomain(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white appearance-none"
                      >
                        <option value="" disabled>Select a domain</option>
                        {roles.map(r => <option key={r.title} value={r.title}>{r.title}</option>)}
                      </select>
                    </div>

                    {newTaskDomain.toLowerCase() === "technical" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Technical Track</label>
                        <select 
                          value={newTaskTechType} 
                          onChange={e => setNewTaskTechType(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white appearance-none"
                        >
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Task Name</label>
                    <input 
                      type="text" required placeholder="e.g. Build a Landing Page"
                      value={newTaskName} onChange={e => setNewTaskName(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <textarea 
                      required rows={3} placeholder="Brief overview of the task..."
                      value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Instructions</label>
                    <textarea 
                      required rows={3} placeholder="Detailed steps and constraints..."
                      value={newTaskInst} onChange={e => setNewTaskInst(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Task Questions</h3>
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-muted-foreground">Number of questions:</label>
                        <input 
                          type="number" min="1" max="20" 
                          value={numQuestions} 
                          onChange={e => handleNumQuestionsChange(parseInt(e.target.value) || 1)}
                          className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-1 outline-none text-white text-center"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {questions.map((q, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex-1 space-y-2">
                            <label className="text-xs text-muted-foreground uppercase tracking-wider">Question {i + 1}</label>
                            <input 
                              type="text" required placeholder="e.g. Please provide the link to your deployment..."
                              value={q.text} 
                              onChange={e => {
                                const newQs = [...questions];
                                newQs[i].text = e.target.value;
                                setQuestions(newQs);
                              }}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 outline-none text-white"
                            />
                          </div>
                          <div className="sm:w-48 space-y-2">
                            <label className="text-xs text-muted-foreground uppercase tracking-wider">Answer Type</label>
                            <select 
                              value={q.type} 
                              onChange={e => {
                                const newQs = [...questions];
                                newQs[i].type = e.target.value as "text" | "link";
                                setQuestions(newQs);
                              }}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 outline-none text-white appearance-none"
                            >
                              <option value="text">Text Response</option>
                              <option value="link">Link (URL)</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" disabled={isSubmittingTask}
                    className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmittingTask ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Publish Task
                  </button>
                </form>
              </div>

              {/* Task List */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><LayoutList className="w-6 h-6 text-primary" /> Existing Tasks</h2>
                {loadingTasks ? (
                  <div className="flex items-center justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : tasks.length === 0 ? (
                  <p className="text-muted-foreground glass p-6 rounded-2xl text-center border border-white/5">No tasks have been created yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {tasks.map(task => (
                      <div key={task.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">{task.domain}</span>
                            {task.technical_type && (
                              <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">{task.technical_type}</span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold">{task.name}</h3>
                          <p className="text-muted-foreground">{task.description}</p>
                          <div className="pt-2 text-sm text-white/60">
                            <strong>{task.questions?.length || 0}</strong> Questions
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
