
import React from 'react';
import { PERSONAL_INFO } from '../constants';
import AnimatedSection from './AnimatedSection';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-4xl font-bold text-center mb-12 gradient-text">{children}</h2>
);

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 text-center relative">
      <AnimatedSection>
        <SectionTitle>Get In Touch</SectionTitle>
        <div className="max-w-3xl mx-auto bg-[#111]/80 backdrop-blur-sm p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <h3 className="text-3xl font-bold text-white mb-6">Let's build something amazing together</h3>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            I'm currently open to new opportunities and collaborations. Whether you have a project in mind, a question, or just want to say hi, my inbox is always open.
          </p>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="group/btn relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-indigo-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-3">
              Say Hello
              <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default Contact;
