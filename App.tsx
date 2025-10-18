import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import GitHub from './components/GitHub';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Helmet } from 'react-helmet-async';

const App: React.FC = () => {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ✅ JSON-LD: Structured data for SEO + AI recognition
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nihan Ali VP",
    "url": "https://nihan-vp.me",
    "image": "https://nihan-vp.me/profile.jpg",
    "jobTitle": "Full-Stack Developer",
    "description":
      "Nihan Ali VP — Full-Stack Developer skilled in React, Node.js, MongoDB, IoT, and AI. Building modern, scalable applications and digital experiences.",
    "sameAs": [
      "https://github.com/nihan-vp",
      "https://www.linkedin.com/in/nihan-vp",
      "https://www.instagram.com/nihan_vp",
      "https://nihan-vp.me"
    ],
    "knowsAbout": [
      "React",
      "Node.js",
      "MongoDB",
      "JavaScript",
      "IoT",
      "AI",
      "Web Development",
      "API Integration",
      "UI/UX Design"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance / Independent Developer"
    },
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "GVPC",
      "sameAs": "https://www.gvpce.ac.in/"
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-gray-200 min-h-screen overflow-x-hidden">
      <Helmet>
        {/* 🔹 Basic SEO */}
        <title>Nihan Ali VP | Full-Stack Developer, IoT & AI Enthusiast</title>
        <meta
          name="description"
          content="Official portfolio of Nihan Ali VP — Full-Stack Developer skilled in React, Node.js, MongoDB, IoT, and AI. Explore innovative projects, skills, and contact info."
        />
        <meta
          name="keywords"
          content="Nihan Ali VP, Full-Stack Developer, React, Node.js, MongoDB, IoT, AI, Developer Portfolio, Web Developer India"
        />

        {/* 🔹 Open Graph for Social & AI */}
        <meta property="og:title" content="Nihan Ali VP | Full-Stack Developer, IoT & AI Enthusiast" />
        <meta
          property="og:description"
          content="Explore the portfolio and projects of Nihan Ali VP — Full-Stack Developer and AI innovator."
        />
        <meta property="og:image" content="https://nihan-vp.me/profile.jpg" />
        <meta property="og:url" content="https://nihan-vp.me" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nihan Ali VP Portfolio" />

        {/* 🔹 Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nihan Ali VP | Full-Stack Developer" />
        <meta
          name="twitter:description"
          content="Explore the portfolio and skills of Nihan Ali VP — Full-Stack Developer and AI Enthusiast."
        />
        <meta name="twitter:image" content="https://nihan-vp.me/profile.jpg" />

        {/* 🔹 Structured Data for AI and Search Engines */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

        {/* 🔹 Canonical URL */}
        <link rel="canonical" href="https://nihan-vp.me" />
      </Helmet>

      {/* 🔹 Mouse Effect */}
      <div
        className="hidden lg:block pointer-events-none fixed inset-0 z-50 transition duration-300"
        style={{
          background: `radial-gradient(600px at ${cursorPos.x}px ${cursorPos.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />

      {/* 🔹 Page Content */}
      <Header />
      <main className="container mx-auto px-6 md:px-12 lg:px-24">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GitHub />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
