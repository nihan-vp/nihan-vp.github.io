
import React from 'react';
import { PROJECTS } from '../constants';
import type { Project } from '../types';
import AnimatedSection from './AnimatedSection';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-4xl font-bold text-center mb-12 gradient-text">{children}</h2>
);

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
  <AnimatedSection delay={index * 0.1}>
    <div className="group relative bg-[#111]/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:border-indigo-500/50 flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-indigo-400 transition-colors duration-300">{project.title}</h3>
        <p className="text-gray-400 mb-6 text-sm leading-relaxed flex-grow">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-white/5 border border-white/10 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-md">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-end items-center gap-5 mt-auto border-t border-white/10 pt-5">
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-all duration-300 transform hover:scale-110" aria-label="GitHub Repository">
            <FaGithub size={24} />
          </a>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-all duration-300 transform hover:scale-110" aria-label="Live Demo">
              <FaExternalLinkAlt size={22} />
            </a>
          )}
        </div>
      </div>
    </div>
  </AnimatedSection>
);

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 relative">
      <AnimatedSection>
        <SectionTitle>Featured Projects</SectionTitle>
      </AnimatedSection>
      <div className="grid md:grid-cols-2 gap-10">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
