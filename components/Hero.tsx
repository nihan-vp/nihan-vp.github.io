import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../constants';
import AnimatedSection from './AnimatedSection';

const HERO_ROLES = [
  "Full-Stack Web Apps",
  "Connected IoT Systems",
  "Intelligent AI Solutions",
  "Scalable Software Products"
];

const CUBE_FACES = [
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", label: "React" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", label: "Node.js" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", label: "Python" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", label: "TypeScript" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", label: "MongoDB" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", label: "Flutter" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", label: "JavaScript" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", label: "HTML" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", label: "CSS" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg", label: "Bootstrap" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", label: "Tailwind CSS" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", label: "Git" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", label: "GitHub" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg", label: "GitLab" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg", label: "Bitbucket" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", label: "Docker" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg", label: "Kubernetes" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", label: "VS Code" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg", label: "IntelliJ" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg", label: "PyCharm" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg", label: "Android" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg", label: "Apple" },
  { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", label: "Linux" },

];

const FACE_CLASSES = [
  'cube-face--front',
  'cube-face--back',
  'cube-face--right',
  'cube-face--left',
  'cube-face--top',
  'cube-face--bottom'
];

const Hero: React.FC = () => {
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [cubeOffset, setCubeOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCubeOffset((prev) => (prev + 1) % CUBE_FACES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect logic
  useEffect(() => {
    let timer: number;
    const currentFullText = HERO_ROLES[roleIndex];

    if (isDeleting) {
      // Deleting speed
      timer = window.setTimeout(() => {
        setRoleText((prev) => prev.substring(0, prev.length - 1));
      }, 50);
    } else {
      // Typing speed
      timer = window.setTimeout(() => {
        setRoleText((prev) => currentFullText.substring(0, prev.length + 1));
      }, 100);
    }

    // Switch states
    if (!isDeleting && roleText === currentFullText) {
      // Pause at full word
      timer = window.setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && roleText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
    }

    return () => clearTimeout(timer);
  }, [roleText, isDeleting, roleIndex]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * -30;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center relative pt-24 pb-12 overflow-hidden">
      <div className="w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Content Column */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left z-10 order-2 lg:order-1">
          <AnimatedSection delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Open for Collaborations</span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} direction="blur">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight leading-[0.95] font-heading">
              Hi, I'm <br />
              <span className="gradient-text-shimmer">{PERSONAL_INFO.name}</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.3} direction="blur" className="h-[48px] md:h-[60px] overflow-hidden mb-6">
            <div className="flex items-center gap-2 text-2xl md:text-4xl font-semibold text-gray-300">
              <span>I build</span>
              <div className="relative inline-block min-w-[200px]">
                <span className="gradient-text font-bold">
                  {roleText}
                </span>
                <span className="inline-block w-[3px] h-[30px] md:h-[40px] bg-[hsl(var(--color-cyan-base))] ml-1 animate-pulse vertical-align-middle" style={{ verticalAlign: 'middle' }} />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4} direction="blur">
            <p className="max-w-lg text-base md:text-lg text-gray-400 mb-10 leading-relaxed">
              Crafting premium digital platforms — combining full-stack development expertise with hardware integrations and AI services. Turning ideas into responsive software.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.5} direction="blur">
            <div className="flex items-center flex-wrap gap-4 mb-8">
              <a
                href="#projects"
                onClick={(e) => handleScrollTo(e, '#projects')}
                className="btn-primary"
              >
                <span>Explore Projects</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                className="btn-outline"
              >
                <span>Get in Touch</span>
              </a>
            </div>

            {/* Social profiles */}
            <div className="flex items-center gap-3">
              {[
                { href: PERSONAL_INFO.socials.github, path: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z", label: "GitHub" },
                { href: PERSONAL_INFO.socials.linkedin, path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", label: "LinkedIn" }
              ].map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  className="social-icon"
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d={soc.path} />
                  </svg>
                </a>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Right Graphic Column: 3D rotating Cube */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center relative order-1 lg:order-2 w-full mt-8 lg:mt-0">
          <AnimatedSection direction="scale" delay={0.3}>
            <div className="cube-scene">
              <div
                className="cube-gimbal"
                style={{
                  transform: `rotateX(${mouseOffset.y * 0.15}deg) rotateY(${mouseOffset.x * 0.15}deg)`,
                }}
              >
                <div className="cube">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const faceData = CUBE_FACES[(cubeOffset + idx) % CUBE_FACES.length];
                    return (
                      <div key={idx} className={`cube-face ${FACE_CLASSES[idx]}`}>
                        <img src={faceData.icon} alt={faceData.label} />
                        <span>{faceData.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Cube shadow */}
            <div className="cube-shadow" />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Hero;