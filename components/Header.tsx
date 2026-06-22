import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../constants';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'skills', 'projects', 'products', 'contact'];
      let currentSection = 'home';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'unset';
  }, [menuOpen]);

  const navLinks = [
    { href: '#about', label: 'About', id: 'about' },
    { href: '#skills', label: 'Skills', id: 'skills' },
    { href: '#projects', label: 'Projects', id: 'projects' },
    { href: '#products', label: 'Products', id: 'products' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 w-full px-6`}
      >
        <div className={`container flex justify-between items-center max-w-5xl transition-all duration-300 ${
          isScrolled 
            ? 'pill-navbar shadow-2xl shadow-black/40 mt-4' 
            : 'bg-transparent border-transparent py-6 mt-0'
        }`}>
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMenuOpen(false);
            }}
            className="text-xl font-bold font-heading gradient-text-shimmer hover:opacity-80 transition-opacity"
          >
            {PERSONAL_INFO.name.split(' ')[0]}
            <span className="text-[hsl(var(--color-cyan-base))]">.</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={`text-sm font-medium transition-all duration-300 hover:text-[hsl(var(--color-cyan-base))] relative py-1.5 ${
                  activeSection === link.id ? 'text-[hsl(var(--color-cyan-base))]' : 'text-gray-400'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[hsl(var(--color-emerald-base))] to-[hsl(var(--color-cyan-base))]" />
                )}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="hidden md:inline-flex items-center px-4 py-1.5 text-xs font-semibold text-black rounded-full transition-all duration-300 bg-gradient-to-r from-[hsl(var(--color-emerald-base))] to-[hsl(var(--color-cyan-base))] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105"
          >
            <span>Let's talk</span>
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-300 z-50 p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(9,9,11,0.96)',
          backdropFilter: 'blur(30px)',
        }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className={`text-2xl font-semibold transition-all duration-300 hover:text-[hsl(var(--color-cyan-base))] ${
                activeSection === link.id ? 'text-[hsl(var(--color-cyan-base))]' : 'text-gray-300'
              }`}
              style={{
                transitionDelay: menuOpen ? `${i * 50}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="btn-primary mt-4 text-base px-8 py-3"
          >
            <span>Let's talk</span>
          </a>
        </nav>
      </div>
    </>
  );
};

export default Header;