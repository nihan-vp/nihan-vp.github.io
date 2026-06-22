import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ProductsSection from './components/ProductsSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { Helmet } from 'react-helmet-async';

const App: React.FC = () => {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Structured data for SEO + AI recognition
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
      "React", "Node.js", "MongoDB", "JavaScript", "IoT", "AI",
      "Web Development", "API Integration", "UI/UX Design"
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
    <div className="bg-[#0a0e17] text-gray-200 min-h-screen overflow-x-hidden relative">
      {/* Scroll Progress Bar */}
      <div 
        className="scroll-progress" 
        style={{ transform: `scaleX(${scrollProgress / 100})` }} 
      />

      {/* Aurora Ambient Backgrounds */}
      <div className="aurora-container">
        <div className="aurora-mesh aurora-1" />
        <div className="aurora-mesh aurora-2" />
        <div className="aurora-mesh aurora-3" />
      </div>

      {/* Grid Overlay */}
      <div className="grid-overlay" />

      <Helmet>
        <title>Nihan Ali VP | Full-Stack Developer, IoT & AI Enthusiast</title>
        <meta
          name="description"
          content="Official portfolio of Nihan Ali VP — Full-Stack Developer skilled in React, Node.js, MongoDB, IoT, and AI. Explore innovative projects, skills, and contact info."
        />
        <meta
          name="keywords"
          content="Nihan Ali VP, Full-Stack Developer, React, Node.js, MongoDB, IoT, AI, Developer Portfolio, Web Developer India"
        />
        <meta property="og:title" content="Nihan Ali VP | Full-Stack Developer, IoT & AI Enthusiast" />
        <meta
          property="og:description"
          content="Explore the portfolio and projects of Nihan Ali VP — Full-Stack Developer and AI innovator."
        />
        <meta property="og:image" content="https://nihan-vp.me/profile.jpg" />
        <meta property="og:url" content="https://nihan-vp.me" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nihan Ali VP Portfolio" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nihan Ali VP | Full-Stack Developer" />
        <meta
          name="twitter:description"
          content="Explore the portfolio and skills of Nihan Ali VP — Full-Stack Developer and AI Enthusiast."
        />
        <meta name="twitter:image" content="https://nihan-vp.me/profile.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <link rel="canonical" href="https://nihan-vp.me" />
      </Helmet>

      {/* Mouse glow follower */}
      <div
        className="hidden lg:block pointer-events-none fixed inset-0 z-40 transition duration-150"
        style={{
          background: `radial-gradient(500px at ${cursorPos.x}px ${cursorPos.y}px, rgba(6, 182, 212, 0.05), transparent 80%)`,
        }}
      />

      {/* Page content */}
      <Header />
      <main className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <ProductsSection />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default App;
