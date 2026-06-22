import React from 'react';
import { PERSONAL_INFO } from '../constants';
import AnimatedSection from './AnimatedSection';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 text-center relative">
      <AnimatedSection>
        <div className="text-center mb-12">
          <h2 className="section-title gradient-text">Get In Touch</h2>
          <div className="accent-bar" />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15} direction="scale">
        <div className="max-w-3xl mx-auto glass-card p-12 md:p-16 relative overflow-hidden group">
          {/* Gradient Border Glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[hsl(var(--color-emerald-base))] via-[hsl(var(--color-cyan-base))] to-[hsl(var(--color-amber-base))] rounded-[1.5rem] opacity-0 group-hover:opacity-[0.1] transition-opacity duration-700 -z-10 blur-sm" />

          {/* Top border strip */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[hsl(var(--color-emerald-base))] via-[hsl(var(--color-cyan-base))] to-[hsl(var(--color-amber-base))]" />

          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">
            Let's build something <span className="gradient-text">amazing</span> together
          </h3>
          <p className="text-base text-gray-400 mb-10 leading-relaxed max-w-xl mx-auto">
            I'm currently looking for new opportunities and collaborations. If you have a project idea, coding questions, or want to connect — shoot me a message!
          </p>
          
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Say Hello</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default Contact;
