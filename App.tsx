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
import Pro26VortexSection from './components/Pro26VortexSection';
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
    "alternateName": ["Nihan Ali", "Nihan VP", "nihanvp"],
    "url": "https://nihanvp.in",
    "image": "https://nihanvp.in/profile.jpg",
    "jobTitle": "Full-Stack Developer, IoT & AI Enthusiast",
    "description":
      "Official portfolio of Nihan Ali VP — Full-Stack Developer skilled in React, Node.js, MongoDB, IoT, and AI. Building modern, scalable applications and digital experiences.",
    "email": "mailto:qwerty311980@gmail.com",
    "telephone": "+917736708566",
    "sameAs": [
      "https://github.com/nihan-vp",
      "https://in.linkedin.com/in/nihan-ali-vp-b902ab382",
      "https://twitter.com/nihan_vp",
      "https://www.instagram.com/nihan_vp/"
    ],
    "knowsAbout": [
      "React", "Node.js", "MongoDB", "JavaScript", "TypeScript", "IoT", "AI",
      "Web Development", "API Integration", "UI/UX Design", "Next.js"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "UNIFIED PRO26 LLP",
      "url": "https://www.pro26.in"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Calicut University"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
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
          content="Official portfolio of Nihan Ali VP — Full-Stack Developer skilled in React, Node.js, IoT, and AI. Explore innovative software projects, skills, and contact info."
        />
        <meta
          name="keywords"
          content="Nihan Ali VP, Nihan VP, nihanvp.in, Full-Stack Developer, React, Node.js, MongoDB, IoT, AI, Developer Portfolio, Web Developer India"
        />
        <meta name="author" content="Nihan Ali VP" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:site_name" content="Nihan Ali VP Portfolio" />
        <meta property="og:title" content="Nihan Ali VP | Full-Stack Developer, IoT & AI Enthusiast" />
        <meta
          property="og:description"
          content="Explore the portfolio and projects of Nihan Ali VP — Full-Stack Developer and AI innovator."
        />
        <meta property="og:image" content="https://nihanvp.in/profile.jpg" />
        <meta property="og:url" content="https://nihanvp.in/" />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@nihan_vp" />
        <meta name="twitter:creator" content="@nihan_vp" />
        <meta name="twitter:title" content="Nihan Ali VP | Full-Stack Developer, IoT & AI Enthusiast" />
        <meta
          name="twitter:description"
          content="Explore the portfolio and skills of Nihan Ali VP — Full-Stack Developer and AI Enthusiast."
        />
        <meta name="twitter:image" content="https://nihanvp.in/profile.jpg" />
        <link rel="canonical" href="https://nihanvp.in/" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Mouse glow follower */}
      <div
        className="hidden lg:block pointer-events-none fixed inset-0 z-40 transition duration-150"
        style={{
          background: `radial-gradient(240px at ${cursorPos.x}px ${cursorPos.y}px, rgba(13, 137, 232, 0.05), transparent 75%)`,
        }}
      />

      {/* Page content */}
      <Header />
      <main className="relative z-10 w-full overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <Hero />
          <About />
        </div>

        {/* Standalone Full-Width 3D Pro26 Vortex Section */}
        <Pro26VortexSection />

        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <Skills />
          <Projects />
          <ProductsSection />
          <Contact />
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default App;
