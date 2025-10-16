import React from 'react';
import { ExternalLink, Github, Code, Smartphone, Globe, Cpu, Video, Zap } from 'lucide-react';

const Projects: React.FC = () => {
  const projects = [
    {
      title: "Smart IoT Home Automation",
      description: "A comprehensive IoT solution using Raspberry Pi for home automation. Features include smart lighting, temperature control, security monitoring, and mobile app integration built with Flutter.",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["IoT", "Raspberry Pi", "Flutter", "PCB Design", "Sensors"],
      githubUrl: "https://github.com/shabeer-wms",
      liveUrl: "#",
      category: "IoT Project",
      icon: <Cpu className="w-5 h-5" />
    },
    {
      title: "Cross-Platform Mobile App",
      description: "A feature-rich mobile application built with Flutter for both iOS and Android. Includes real-time data synchronization, offline capabilities, and beautiful UI/UX design.",
      image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Flutter", "Dart", "Firebase", "REST API", "Material Design"],
      githubUrl: "https://github.com/shabeer-wms",
      liveUrl: "#",
      category: "Mobile App",
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      title: "Professional Video Production Suite",
      description: "Complete video editing and production workflow using Final Cut Pro X and Adobe Creative Suite. Includes motion graphics, color grading, and audio synchronization for broadcast quality content.",
      image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Final Cut Pro X", "Adobe Creative Suite", "Motion Graphics", "Audio Editing"],
      githubUrl: "https://github.com/shabeer-wms",
      liveUrl: "#",
      category: "Video Production",
      icon: <Video className="w-5 h-5" />
    },
    {
      title: "PCB Design for IoT Devices",
      description: "Custom PCB designs for various IoT applications including sensor modules, communication boards, and power management systems. Optimized for performance and cost-effectiveness.",
      image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["PCB Design", "Electronics", "Circuit Analysis", "Component Selection"],
      githubUrl: "https://github.com/shabeer-wms",
      liveUrl: "#",
      category: "Hardware Design",
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "Broadcasting System Management",
      description: "Comprehensive system for managing radio broadcasting operations including audio routing, live streaming, and equipment monitoring. Built for Peace Radio's technical infrastructure.",
      image: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Audio Engineering", "Broadcasting", "System Integration", "Network Management"],
      githubUrl: "https://github.com/shabeer-wms",
      liveUrl: "#",
      category: "Broadcasting",
      icon: <Globe className="w-5 h-5" />
    },
    {
      title: "Educational Flutter Course Platform",
      description: "Interactive learning platform for teaching Flutter development. Includes hands-on projects, code examples, and progress tracking for students at Skilshore.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Flutter", "Education Technology", "Interactive Learning", "Progress Tracking"],
      githubUrl: "https://github.com/shabeer-wms",
      liveUrl: "#",
      category: "Education",
      icon: <Code className="w-5 h-5" />
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Here are some of my recent projects showcasing Flutter development, IoT innovation, and creative solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden group"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-4">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors duration-200"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    {project.icon}
                    <span className="text-sm font-medium">{project.category}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {project.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Github size={16} className="mr-2" />
                    Code
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View Project
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Projects */}
        <div className="text-center mt-12">
          <a
            href="https://github.com/shabeer-wms"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Github size={20} className="mr-2" />
            View More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;