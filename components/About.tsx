
import React from 'react';
import AnimatedSection from './AnimatedSection';
import profile from '../assets/profile.jpg';
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-4xl font-bold text-center mb-12 gradient-text">{children}</h2>
);

const About: React.FC = () => {
  return (
    <section id="about" className="py-24">
      <AnimatedSection>
        <SectionTitle>About Me</SectionTitle>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3">
            <img 
              src={profile}
              alt="Profile" 
              className="rounded-full shadow-lg border-4 border-gray-700 mx-auto"
            />
          </div>
          <div className="md:w-2/3 text-lg text-gray-300 space-y-4">
            <p>
              Hello! I'm Nihan Ali, a full-stack developer with a deep passion for technology and creative problem-solving. My journey in software development started with a simple "Hello, World!" and has since evolved into a career where I build scalable web applications and intricate IoT solutions.
            </p>
            <p>
              I thrive on turning complex ideas into tangible products that are both user-friendly and powerful. From designing responsive front-end interfaces with React and Next.js to architecting robust back-end services and databases, I enjoy every aspect of the development lifecycle.
            </p>
            <p>
              When I'm not coding, you can find me tinkering with hardware projects, exploring new tech, or contributing to open-source communities.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default About;
