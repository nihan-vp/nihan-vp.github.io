import React, { useState, useEffect } from 'react';
import { PROJECTS as DEFAULT_PROJECTS } from '../constants';
import type { Project } from '../types';
import AnimatedSection from './AnimatedSection';
import Card3DTilt from './Card3DTilt';
import { db, collection, addDoc, getDocs, query } from '../firebase';
import {
  ExternalLink,
  Plus,
  Lock,
  LogOut,
  Sparkles,
  Cpu,
  Bot,
  Globe,
  Maximize2,
  X
} from 'lucide-react';

const PROJECT_CATEGORIES = [
  { id: 'all', label: 'All Projects', icon: Sparkles },
  { id: 'iot', label: 'IoT & Embedded', icon: Cpu },
  { id: 'ai', label: 'AI & Intelligence', icon: Bot },
  { id: 'web', label: 'Full-Stack Web', icon: Globe },
];

const ProjectCard: React.FC<{
  project: Project;
  index: number;
  onPreview: (project: Project) => void;
}> = ({ project, index, onPreview }) => {
  return (
    <AnimatedSection delay={index * 0.08} direction="scale">
      <Card3DTilt intensity={14} glareOpacity={0.22} className="h-full">
        <div className="project-card-premium flex flex-col h-full overflow-hidden group cursor-default border border-white/[0.08] bg-slate-900/50 rounded-2xl hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">

          {/* Project Thumbnail Image with 3D Gloss & Preview Trigger */}
          <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-950">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
            <img
              src={project.imageUrl}
              alt={`${project.title} - Project by Nihan Ali VP`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Quick Preview Hover Button */}
            <button
              onClick={() => onPreview(project)}
              className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-gray-300 opacity-100 sm:opacity-0 group-hover:opacity-100 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-300 shadow-lg"
              title="Inspect 3D Specs"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          {/* Info Content Panel */}
          <div className="p-5 sm:p-6 flex flex-col flex-grow relative z-20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 font-heading">
                {project.title}
              </h3>
            </div>

            <p className="text-sm text-gray-300 mb-5 leading-relaxed flex-grow line-clamp-3">
              {project.description}
            </p>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/[0.03] border border-white/[0.06] text-cyan-300/90 text-xs px-2.5 py-1 rounded-full font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center gap-3 mt-auto pt-4 border-t border-white/[0.06]">
              <button
                onClick={() => onPreview(project)}
                className="text-xs font-mono text-gray-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
              >
                <span>View Specs</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon !w-9 !h-9"
                  aria-label={`View source code for ${project.title} on GitHub`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon !w-9 !h-9 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
                    aria-label={`View live demo of ${project.title}`}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card3DTilt>
    </AnimatedSection>
  );
};

const Projects: React.FC = () => {
  const [projectsList, setProjectsList] = useState<Project[]>(DEFAULT_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

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
  useEffect(() => {
    const loadLocalFallback = () => {
      const saved = localStorage.getItem("nihan_portfolio_projects");
      if (saved) {
        try {
          setProjectsList(JSON.parse(saved));
        } catch {
          setProjectsList(DEFAULT_PROJECTS);
        }
      } else {
        setProjectsList(DEFAULT_PROJECTS);
      }
    };

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
          loadLocalFallback();
        }
      } catch (error) {
        console.warn("Firebase query failed, loading fallback:", error);
        loadLocalFallback();
      }
    };

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
      ...(newLiveUrl ? { liveUrl: newLiveUrl } : {})
    };

    const updated = [newProj, ...projectsList];
    setProjectsList(updated);
    localStorage.setItem("nihan_portfolio_projects", JSON.stringify(updated));

    try {
      await addDoc(collection(db, "projects"), newProj);
      alert("Project saved successfully to Firebase!");
    } catch (err: any) {
      console.error("Firestore write failed:", err);
      alert("Saved locally! Firebase remote notice: " + (err.message || err.code || err));
    }

    setNewTitle("");
    setNewDesc("");
    setNewTags("");
    setNewImgUrl("");
    setNewLiveUrl("");
    setNewRepoUrl("");
  };

  const filteredProjects = projectsList.filter((proj) => {
    if (selectedCategory === 'all') return true;
    const tagString = proj.tags.join(" ").toLowerCase();
    const titleString = (proj.title + " " + proj.description).toLowerCase();
    const combined = `${tagString} ${titleString}`;

    if (selectedCategory === 'iot') {
      return combined.includes('iot') || combined.includes('raspberry') || combined.includes('arduino') || combined.includes('sensor');
    }
    if (selectedCategory === 'ai') {
      return combined.includes('ai') || combined.includes('ml') || combined.includes('model') || combined.includes('neural');
    }
    if (selectedCategory === 'web') {
      return combined.includes('react') || combined.includes('node') || combined.includes('next') || combined.includes('web');
    }
    return true;
  });

  return (
    <section id="projects" className="py-20 sm:py-32 relative">

      {/* Section Header */}
      <AnimatedSection>
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
            <Sparkles size={12} />
            <span>PORTFOLIO & CASE STUDIES</span>
          </div>
          <h2 className="section-title gradient-text font-heading">Featured Creations</h2>
          <div className="accent-bar" />
          <p className="section-subtitle">
            A curated index of production full-stack systems, connected IoT solutions, and AI automation engines.
          </p>
        </div>
      </AnimatedSection>

      {/* Category Tabs */}
      <AnimatedSection>
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12 max-w-2xl mx-auto px-4">
          {PROJECT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 scale-105'
                    : 'bg-slate-900/60 border border-white/10 text-gray-400 hover:text-white hover:bg-slate-800/80'
                  }`}
              >
                <Icon size={14} className={isSelected ? 'text-white' : 'text-cyan-400'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </AnimatedSection>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-16">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.title + index}
            project={project}
            index={index}
            onPreview={(p) => setPreviewProject(p)}
          />
        ))}
      </div>

      {/* Project Detail Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade">
          <div className="glass-card max-w-2xl w-full p-6 sm:p-8 relative border border-cyan-500/30 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setPreviewProject(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all z-10"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Project Specification</span>
            </div>

            <h3 className="text-2xl font-bold text-white font-heading mb-4">
              {previewProject.title}
            </h3>

            <div className="rounded-xl overflow-hidden mb-5 max-h-60 bg-slate-950">
              <img
                src={previewProject.imageUrl}
                alt={previewProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
              {previewProject.description}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Technologies Deployed</h4>
              <div className="flex flex-wrap gap-2">
                {previewProject.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <a
                href={previewProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline !py-2 !px-4 !text-xs"
              >
                <span>Source Code</span>
              </a>
              {previewProject.liveUrl && previewProject.liveUrl !== '#' && (
                <a
                  href={previewProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !py-2 !px-4 !text-xs"
                >
                  <span>Launch Live App</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Portal Toggle / Bar */}
      <div className="flex justify-center mt-12">
        {!isAdmin ? (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]"
          >
            <Lock size={12} />
            <span>Developer Admin Gateway</span>
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin Mode Active</span>
            </span>
            <button
              onClick={() => setIsAdmin(false)}
              className="text-xs font-mono text-rose-400 hover:underline flex items-center gap-1"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Admin Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card p-6 max-w-sm w-full border border-cyan-500/30">
            <h4 className="font-bold text-white text-lg font-heading mb-4 flex items-center gap-2">
              <Lock size={18} className="text-cyan-400" />
              <span>Admin Verification</span>
            </h4>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
              {loginError && (
                <p className="text-xs text-rose-400">Incorrect password. Access denied.</p>
              )}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="btn-outline !py-1.5 !px-3 !text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !py-1.5 !px-4 !text-xs"
                >
                  Authenticate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add Project Drawer */}
      {isAdmin && (
        <div className="max-w-xl mx-auto mt-8 p-6 glass-card border border-emerald-500/30">
          <h4 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <Plus size={16} className="text-emerald-400" />
            <span>Deploy New Project</span>
          </h4>
          <form onSubmit={handleAddProject} className="space-y-3">
            <input
              type="text"
              placeholder="Project Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              required
            />
            <textarea
              placeholder="Description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Tags (comma separated, e.g. React, Node.js, IoT)"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={newImgUrl}
              onChange={(e) => setNewImgUrl(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
            <input
              type="url"
              placeholder="GitHub Repo URL"
              value={newRepoUrl}
              onChange={(e) => setNewRepoUrl(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              required
            />
            <input
              type="url"
              placeholder="Live Demo URL (optional)"
              value={newLiveUrl}
              onChange={(e) => setNewLiveUrl(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              className="btn-primary w-full text-center justify-center !py-2.5 mt-2"
            >
              <span>Publish to Firestore & Portfolio</span>
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default Projects;
