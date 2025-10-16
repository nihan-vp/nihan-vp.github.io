
import React from 'react';
import { PERSONAL_INFO } from '../constants';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-800 py-8">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center text-gray-400">
        <div className="flex justify-center space-x-6 mb-4">
            <a href={PERSONAL_INFO.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                <FaGithub size={24} />
            </a>
            <a href={PERSONAL_INFO.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                <FaLinkedin size={24} />
            </a>
            <a href={PERSONAL_INFO.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                <FaTwitter size={24} />
            </a>
        </div>
        <p>&copy; {new Date().getFullYear()} {PERSONAL_INFO.name}. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
