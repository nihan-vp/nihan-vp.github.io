import React, { useState, useEffect } from 'react';
import { PROJECTS as DEFAULT_PROJECTS } from '../constants';
import type { Project } from '../types';
import AnimatedSection from './AnimatedSection';
import { db, collection, addDoc, getDocs, query } from '../firebase';
import { ExternalLink, Plus, Lock, LogOut, Check } from 'lucide-react';

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  return (
    <AnimatedSection delay={index * 0.1} direction="scale">
      <div className="project-card-premium flex flex-col h-full overflow-hidden group cursor-default border border-white/[0.08] bg-slate-900/40 rounded-xl hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1">
        {/* Project Thumbnail Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Info Content Panel */}
        <div className="p-6 flex flex-col flex-grow relative z-20">
          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[hsl(var(--color-cyan-base))] transition-colors duration-300 font-heading">
            {project.title}
          </h3>
          <p className="text-sm text-gray-400 mb-5 leading-relaxed flex-grow">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white/[0.02] border border-white/[0.04] text-gray-400 text-xs px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-3 mt-auto pt-4 border-t border-white/[0.04]">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon !w-9 !h-9"
              aria-label="GitHub Repository"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon !w-9 !h-9"
                aria-label="Live Demo"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

const Projects: React.FC = () => {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // New project form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newImgUrl, setNewImgUrl] = useState("");
  const [newLiveUrl, setNewLiveUrl] = useState("");
  const [newRepoUrl, setNewRepoUrl] = useState("");

  // Sync / Load database helper
  const syncProjects = async () => {
    try {
      const q = query(collection(db, "projects"));
      const querySnapshot = await getDocs(q);
      const items: Project[] = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as Project);
      });
      if (items.length > 0) {
        setProjectsList(items);
        localStorage.setItem("nihan_portfolio_projects", JSON.stringify(items));
      } else {
        // Fallback if db is empty
        loadLocalFallback();
      }
    } catch (error) {
      console.warn("Firebase query failed, loading local storage:", error);
      loadLocalFallback();
    }
  };

  const loadLocalFallback = () => {
    const saved = localStorage.getItem("nihan_portfolio_projects");
    if (saved) {
      try {
        setProjectsList(JSON.parse(saved));
      } catch (e) {
        setProjectsList(DEFAULT_PROJECTS);
      }
    } else {
      setProjectsList(DEFAULT_PROJECTS);
    }
  };

  useEffect(() => {
    syncProjects();
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "nihan311980") {
      setIsAdmin(true);
      setShowLogin(false);
      setPasswordInput("");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newRepoUrl) return;

    const tagsArray = newTags
      ? newTags.split(",").map(t => t.trim()).filter(Boolean)
      : ["React", "Node.js"];

    const newProj: Project = {
      title: newTitle,
      description: newDesc,
      tags: tagsArray,
      imageUrl: newImgUrl || "https://picsum.photos/seed/newproject/600/400",
      repoUrl: newRepoUrl,
      liveUrl: newLiveUrl || undefined
    };

    // Optimistically update UI local states
    const updated = [newProj, ...projectsList];
    setProjectsList(updated);
    localStorage.setItem("nihan_portfolio_projects", JSON.stringify(updated));

    // Try to write to Firestore
    try {
      await addDoc(collection(db, "projects"), newProj);
      alert("Project saved successfully to Firebase!");
    } catch (err: any) {
      console.error("Firestore write failed:", err);
      alert("Firebase Save Failed: " + (err.message || err.code || err) + "\n\n(Tip: Check Firestore Security Rules in Firebase console to allow unauthenticated writes, or configure Auth.)");
    }

    // Reset Form
    setNewTitle("");
    setNewDesc("");
    setNewTags("");
    setNewImgUrl("");
    setNewLiveUrl("");
    setNewRepoUrl("");
  };

  return (
    <section id="projects" className="py-28 relative">
      <AnimatedSection>
        <div className="text-center mb-16 relative">
          <h2 className="section-title gradient-text font-heading">Featured Projects</h2>
          <div className="accent-bar" />
          <p className="section-subtitle">
            A selection of key builds that showcase my engineering skills and capabilities
          </p>

          {/* Secret Login Lock Button */}
          <div className="absolute right-0 top-0">
            {!isAdmin ? (
              <button
                onClick={() => setShowLogin(!showLogin)}
                className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-gray-500 hover:text-white hover:bg-white/[0.05] transition-colors"
                title="Admin Access"
              >
                <Lock size={16} />
              </button>
            ) : (
              <button
                onClick={() => setIsAdmin(false)}
                className="px-4 py-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-950/60 transition-colors flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <LogOut size={12} />
                <span>Admin Logout</span>
              </button>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Secret Password Modal Overlay */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="glass-card p-8 w-full max-w-sm border-cyan-500/20 relative">
            <h4 className="text-lg font-bold font-heading text-white mb-2 flex items-center gap-2">
              <Lock size={18} className="text-[hsl(var(--accent-cyan))]" />
              <span>Project Portal</span>
            </h4>
            <p className="text-xs text-gray-400 mb-6">Enter secret key to unlock manager.</p>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                placeholder="Secret Key"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm mb-4 focus:outline-none focus:border-cyan-500/50"
              />
              {loginError && <p className="text-xs text-red-400 mb-4">Invalid credentials.</p>}
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin project adding form panel */}
      {isAdmin && (
        <AnimatedSection>
          <div className="glass-card p-6 max-w-2xl mx-auto mb-16 border-cyan-500/30">
            <h3 className="text-lg font-bold text-white font-heading mb-4 flex items-center gap-2">
              <Plus size={18} className="text-cyan-400" />
              <span>Add New Showcase Project</span>
            </h3>
            <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Tags / Tech (comma separated)"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newImgUrl}
                onChange={(e) => setNewImgUrl(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Repo URL"
                value={newRepoUrl}
                onChange={(e) => setNewRepoUrl(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Live Demo URL (optional)"
                value={newLiveUrl}
                onChange={(e) => setNewLiveUrl(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 md:col-span-2"
              />
              <textarea
                placeholder="Project Description..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 md:col-span-2"
                required
              />
              <button
                type="submit"
                className="btn-primary md:col-span-2 flex items-center justify-center gap-2 !py-2.5"
              >
                <Check size={16} />
                <span>Save Project Showcase</span>
              </button>
            </form>
          </div>
        </AnimatedSection>
      )}

      {/* Projects Grid Display */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {projectsList.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
