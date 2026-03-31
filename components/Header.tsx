import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../constants';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#github', label: 'GitHub' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({
          behavior: 'smooth'
      });
      setMenuOpen(false);
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
          isScrolled ? 'bg-[#050505]/80 backdrop-blur-md shadow-lg border-white/10 py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-24 flex justify-between items-center">
          <a href="#" onClick={(e) => handleScrollTo(e, '#root')} className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
            {PERSONAL_INFO.name.split(' ')[0]}
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a 
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="hidden md:inline-block px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600/10 border border-indigo-500/50 rounded-full hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.1)] hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transform hover:-translate-y-0.5"
          >
            Hire Me
          </a>
          <button 
            className="md:hidden text-2xl z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-screen bg-[#050505]/95 backdrop-blur-xl z-40 transition-all duration-500 ease-in-out ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
          <nav className="flex flex-col items-center justify-center h-full space-y-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-3xl font-semibold text-gray-300 hover:text-indigo-400 transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                className="mt-8 px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                Hire Me
              </a>
          </nav>
      </div>
    </>
  );
};

export default Header;