
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

  // your existing useEffect for cursor

  return (
    <div className="bg-[#0a0a0a] text-gray-200 min-h-screen overflow-x-hidden">
      <Helmet>
        <title>Nihan Ali VP | Full-Stack Developer, IoT & AI Enthusiast</title>
        <meta
          name="description"
          content="Official portfolio of Nihan Ali VP — Full-Stack Developer skilled in React, Node.js, MongoDB, IoT, and AI projects. Explore projects, skills, and contact info."
        />
        <meta name="keywords" content="Full-Stack Developer, React, Node.js, MongoDB, IoT, AI, Portfolio, Nihan Ali VP" />
        <meta property="og:title" content="Nihan Ali VP | Full-Stack Developer" />
        <meta property="og:description" content="Explore the portfolio, projects, and skills of Nihan Ali VP, a Full-Stack Developer and tech enthusiast." />
        <meta property="og:image" content="https://nihan-vp.me/profile.jpg" />
        <meta property="og:url" content="https://nihan-vp.me" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nihan Ali VP | Full-Stack Developer" />
        <meta name="twitter:description" content="Explore the portfolio, projects, and skills of Nihan Ali VP, a Full-Stack Developer and tech enthusiast." />
        <meta name="twitter:image" content="https://nihan-vp.me/profile.jpg" />
      </Helmet>

      {/* Your cursor gradient */}
      <div 
        className="hidden lg:block pointer-events-none fixed inset-0 z-50 transition duration-300"
        style={{
          background: `radial-gradient(600px at ${cursorPos.x}px ${cursorPos.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />

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
