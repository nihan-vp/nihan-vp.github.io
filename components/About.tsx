
import React from 'react';
import AnimatedSection from './AnimatedSection';
import profile from '../assets/profile.jpg';
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-4xl font-bold text-center mb-12 gradient-text">{children}</h2>
);

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 relative">
      <AnimatedSection>
        <SectionTitle>About Me</SectionTitle>
        <div className="flex flex-col md:flex-row items-center gap-16 relative">
          <div className="md:w-2/5 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <img 
              src={profile}
              alt="Profile" 
              className="relative rounded-[2rem] shadow-2xl border border-white/10 mx-auto w-full max-w-sm object-cover aspect-square transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:-rotate-1"
            />
          </div>
          <div className="md:w-3/5 text-lg text-gray-300 space-y-6">
            <p className="leading-relaxed">
              Hello! I'm <span className="text-white font-semibold">Nihan Ali</span>, a full-stack developer with a deep passion for technology and creative problem-solving. My journey in software development started with a simple "Hello, World!" and has since evolved into a career where I build scalable web applications and intricate IoT solutions.
            </p>
            <p className="leading-relaxed">
              I thrive on turning complex ideas into tangible products that are both <span className="text-indigo-400 font-medium">user-friendly</span> and <span className="text-pink-400 font-medium">powerful</span>. From designing responsive front-end interfaces with React and Next.js to architecting robust back-end services and databases, I enjoy every aspect of the development lifecycle.
            </p>
            <p className="leading-relaxed">
              When I'm not coding, you can find me tinkering with hardware projects, exploring new tech, or contributing to open-source communities.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default About;
