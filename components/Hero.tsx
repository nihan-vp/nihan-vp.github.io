import React from 'react';
import { PERSONAL_INFO } from '../constants';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';

const Hero: React.FC = () => {

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({
          behavior: 'smooth'
      });
  }

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-start text-left relative pt-20">
      <AnimatedSection className="w-full" delay={0.1}>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-6 tracking-tight">
          Hi, I'm <br className="md:hidden" /><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">{PERSONAL_INFO.name}</span>.
        </h1>
      </AnimatedSection>
      <AnimatedSection className="w-full" delay={0.3}>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-300 mb-8 leading-tight">
          I build things for the web <br className="hidden md:block" /> and beyond.
        </h2>
      </AnimatedSection>
      <AnimatedSection className="w-full" delay={0.5}>
        <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
          A passionate full-stack developer with a knack for creating innovative solutions, from dynamic web applications to complex IoT systems.
        </p>
        <div className="flex items-center flex-wrap gap-8">
          <a
            href="#projects"
            onClick={(e) => handleScrollTo(e, '#projects')}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">View My Work</span>
          </a>
          <div className="flex items-center space-x-6">
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="text-gray-400 hover:text-indigo-400 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(79,70,229,0.8)]"
            >
              <FaGithub size={32} />
            </a>
            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="text-gray-400 hover:text-indigo-400 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(79,70,229,0.8)]"
            >
              <FaLinkedin size={32} />
            </a>
            <a
              href={PERSONAL_INFO.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter Profile"
              className="text-gray-400 hover:text-indigo-400 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(79,70,229,0.8)]"
            >
              <FaTwitter size={32} />
            </a>
          </div>
        </div>
      </AnimatedSection>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce flex flex-col items-center text-gray-500">
        <span className="text-sm font-medium tracking-widest uppercase mb-2">Scroll Down</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;