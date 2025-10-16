
import React from 'react';
import { PERSONAL_INFO } from '../constants';
import AnimatedSection from './AnimatedSection';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-4xl font-bold text-center mb-12 gradient-text">{children}</h2>
);

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 text-center">
      <AnimatedSection>
        <SectionTitle>Get In Touch</SectionTitle>
        <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-8">
          I'm currently open to new opportunities and collaborations. Whether you have a project in mind, a question, or just want to say hi, my inbox is always open.
        </p>
        <a
          href={`mailto:${PERSONAL_INFO.email}`}
          className="inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full animated-gradient-bg transition-transform duration-300 transform hover:scale-105 shadow-lg"
        >
          Say Hello
        </a>
      </AnimatedSection>
    </section>
  );
};

export default Contact;
