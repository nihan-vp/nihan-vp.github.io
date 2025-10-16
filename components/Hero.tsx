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
    <section id="home" className="min-h-screen flex flex-col justify-center items-start text-left">
      <AnimatedSection className="w-full">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4">
          Hi, I'm <span className="gradient-text">{PERSONAL_INFO.name}</span>.
        </h1>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-300 mb-8">
          I build things for the web and beyond.
        </h2>
        <p className="max-w-3xl text-lg text-gray-400 mb-10">
          A passionate full-stack developer with a knack for creating innovative solutions, from dynamic web applications to complex IoT systems.
        </p>
        <div className="flex items-center flex-wrap gap-6">
          <a
            href="#projects"
            onClick={(e) => handleScrollTo(e, '#projects')}
            className="inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full animated-gradient-bg transition-transform duration-300 transform hover:scale-105 shadow-lg"
          >
            View My Work
          </a>
          <div className="flex items-center space-x-6">
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="text-gray-400 hover:text-white transition-transform duration-300 transform hover:scale-125"
            >
              <FaGithub size={32} />
            </a>
            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="text-gray-400 hover:text-white transition-transform duration-300 transform hover:scale-125"
            >
              <FaLinkedin size={32} />
            </a>
            <a
              href={PERSONAL_INFO.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter Profile"
              className="text-gray-400 hover:text-white transition-transform duration-300 transform hover:scale-125"
            >
              <FaTwitter size={32} />
            </a>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default Hero;