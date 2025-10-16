
import React from 'react';
import { PROJECTS } from '../constants';
import type { Project } from '../types';
import AnimatedSection from './AnimatedSection';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-4xl font-bold text-center mb-12 gradient-text">{children}</h2>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500 transform hover:-translate-y-2">
    <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
      <p className="text-gray-400 mb-4 text-sm">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span key={tag} className="bg-indigo-900/50 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-end items-center gap-4 mt-4">
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
          <FaGithub size={24} />
        </a>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
            <FaExternalLinkAlt size={22} />
          </a>
        )}
      </div>
    </div>
  </div>
);

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24">
      <AnimatedSection>
        <SectionTitle>Featured Projects</SectionTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
};

export default Projects;
