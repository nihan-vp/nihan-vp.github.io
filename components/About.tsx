import React from 'react';
import AnimatedSection from './AnimatedSection';
import profile from '../assets/profile.jpg';

const stats = [
  { value: "5+", label: "Years Coding", color: "from-emerald-500 to-cyan-500" },
  { value: "50+", label: "Projects Built", color: "from-cyan-500 to-amber-500" },
  { value: "1000+", label: "Contributions", color: "from-amber-500 to-purple-500" },
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-28 relative">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="section-title gradient-text font-heading">About Me</h2>
          <div className="accent-bar" />
        </div>
      </AnimatedSection>

      <div className="grid md:grid-cols-12 gap-12 items-center relative">
        {/* Profile Image & Accents */}
        <div className="md:col-span-5 flex justify-center">
          <AnimatedSection delay={0.1} direction="left">
            <div className="relative group max-w-sm">
              <div className="absolute -inset-4 bg-gradient-to-r from-[hsl(var(--color-emerald-base))]/15 via-[hsl(var(--color-cyan-base))]/15 to-[hsl(var(--color-amber-base))]/15 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--color-emerald-base))] to-[hsl(var(--color-cyan-base))] rounded-[2rem] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <img
                src={profile}
                alt="Nihan Ali — Full-Stack Developer"
                className="relative rounded-[2rem] shadow-2xl border border-white/10 w-full object-cover aspect-square transform transition-all duration-700 group-hover:scale-[1.02] group-hover:-rotate-1"
              />
              <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-[hsl(var(--color-cyan-base))]/40 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-[hsl(var(--color-amber-base))]/40 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </AnimatedSection>
        </div>

        {/* Bio Text */}
        <div className="md:col-span-7">
          <AnimatedSection delay={0.2} direction="3d-flip">
            <div className="glass-card p-8 md:p-10 space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                Hello! I'm{' '}
                <span className="text-white font-semibold">Nihan Ali</span>, a
                full-stack developer with a deep passion for technology and
                creative problem-solving. My journey started with a simple "Hello,
                World!" and has since evolved into building scalable web
                applications and intricate IoT solutions.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                I thrive on turning complex ideas into tangible products that are
                both{' '}
                <span className="text-[hsl(var(--color-cyan-base))] font-medium">user-friendly</span>{' '}
                and{' '}
                <span className="text-[hsl(var(--color-amber-base))] font-medium">powerful</span>. From
                designing responsive front-end interfaces with React and Next.js to
                architecting robust back-end services and databases, I enjoy every
                aspect of the development lifecycle.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                When I'm not coding, you can find me tinkering with hardware
                projects, exploring new tech, or contributing to open-source
                communities.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Stats Row */}
      <AnimatedSection delay={0.3} direction="3d-flip">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card group">
              <div
                className={`text-3xl md:text-4xl font-extrabold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-110`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
};

export default About;
