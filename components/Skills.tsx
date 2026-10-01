import React from 'react';
import { PERSONAL_INFO } from '../constants';
import AnimatedSection from './AnimatedSection';

const row1Skills = [
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Dart", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },
  { name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "HTML5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Flutter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
];

const row2Skills = [
  { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "VS Code", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
  { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "Photoshop", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" },
  { name: "Blender", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" },
];

const githubUsername = PERSONAL_INFO.githubUsername;

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-16 sm:py-28 relative overflow-hidden">
      <AnimatedSection>
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="section-title gradient-text font-heading">Skills & Stack</h2>
          <div className="accent-bar" />
          <p className="section-subtitle">
            Professional stack and technologies I use to architect robust, scalable products
          </p>
        </div>
      </AnimatedSection>

      {/* Infinite Horizontal Scrolling Row 1 (Forward direction) */}
      <div className="marquee-container mb-4 sm:mb-6">
        <div className="marquee-track gap-4">
          {[...row1Skills, ...row1Skills, ...row1Skills].map((skill, idx) => (
            <div key={idx} className="glass-card px-8 py-4 flex items-center gap-3 w-48 justify-start hover:border-[hsl(var(--color-cyan-base))]/30 flex-shrink-0">
              <div className="w-8 h-8 flex items-center justify-center bg-white/[0.02] rounded-lg p-1.5">
                <img
                  src={skill.logo}
                  alt={`${skill.name} icon`}
                  width="32"
                  height="32"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-300">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Horizontal Scrolling Row 2 (Reverse direction) */}
      <div className="marquee-container mb-16 sm:mb-24">
        <div className="marquee-track-reverse gap-4">
          {[...row2Skills, ...row2Skills, ...row2Skills].map((skill, idx) => (
            <div key={idx} className="glass-card px-8 py-4 flex items-center gap-3 w-48 justify-start hover:border-[hsl(var(--color-cyan-base))]/30 flex-shrink-0">
              <div className="w-8 h-8 flex items-center justify-center bg-white/[0.02] rounded-lg p-1.5">
                <img
                  src={skill.logo}
                  alt={`${skill.name} icon`}
                  width="32"
                  height="32"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-300">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Summary Integration */}
      <AnimatedSection>
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold font-heading text-white">GitHub Contributions</h3>
          <div className="accent-bar" />
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto w-full">

        {/* Contribution Line Graph / Heatmap */}
        <AnimatedSection className="md:col-span-3" delay={0.08}>
          <div className="glass-card p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h4 className="font-bold text-gray-200 font-heading text-sm sm:text-base">Contribution Activity Graph</h4>
              <span className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wider">Trend Analysis</span>
            </div>
            <div className="bg-black/30 rounded-xl p-3 sm:p-4 overflow-x-auto custom-scrollbar flex items-center justify-center">
              <img
                src={`https://ghchart.rshah.org/06b6d4/${githubUsername}`}
                alt="GitHub Contributions Calendar Graph"
                className="w-full min-w-[540px] sm:min-w-0 max-w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  // Fallback to github-readme-stats if ghchart is unavailable
                  e.currentTarget.src = `https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&bg_color=0a0e17&title_color=06b6d4&text_color=94a3b8&icon_color=3b82f6&border_color=00000000&hide_border=true`;
                }}
              />
            </div>
            <p className="text-[11px] text-gray-500 text-center mt-2.5 sm:hidden">
              Swipe horizontally to view full activity calendar
            </p>
          </div>
        </AnimatedSection>

        {/* Activity Streak */}
        <AnimatedSection className="md:col-span-2" delay={0.1}>
          <div className="glass-card p-4 sm:p-6 flex flex-col h-full justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-200 font-heading text-sm sm:text-base">Activity Streak</h4>
              <span className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wider">Live Stats</span>
            </div>
            <div className="bg-black/30 rounded-xl p-2 sm:p-3 flex items-center justify-center overflow-hidden">
              <img
                src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=dark&hide_border=true&stroke=3b82f6&ring=06b6d4&fire=f59e0b&currStreakLabel=D1D5DB&sideLabels=D1D5DB&currStreakNum=FFFFFF&sideNums=FFFFFF&dates=D1D5DB&background=00000000`}
                alt="GitHub Streak"
                className="w-full max-w-full sm:max-w-md h-auto rounded-lg object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* GitHub Profile Card */}
        <AnimatedSection className="md:col-span-1" delay={0.15}>
          <div className="glass-card p-5 sm:p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3 sm:mb-4 text-black shadow-lg shadow-cyan-500/10">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <h4 className="font-bold text-base sm:text-lg text-white mb-1 font-heading">@{githubUsername}</h4>
            <p className="text-xs text-gray-400 mb-4 sm:mb-5 max-w-[200px]">Explore open source codes & contributions</p>
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Nihan Ali's GitHub Profile (@${githubUsername})`}
              className="btn-outline !py-2 !px-5 !text-xs w-full sm:w-auto text-center"
            >
              <span>Visit Profile</span>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Skills;
