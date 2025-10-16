
import React from 'react';
import { PERSONAL_INFO } from '../constants';
import AnimatedSection from './AnimatedSection';
import { FaGithub, FaStar, FaCodeBranch, FaUserFriends } from 'react-icons/fa';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-4xl font-bold text-center mb-12 gradient-text">{children}</h2>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center bg-gray-900/50 p-4 rounded-lg border border-gray-800">
        <div className="text-indigo-400 mb-2">{icon}</div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-400 text-sm">{label}</p>
    </div>
);


const GitHub: React.FC = () => {
  return (
    <section id="github" className="py-24">
      <AnimatedSection>
        <SectionTitle>Find Me on GitHub</SectionTitle>
        <div className="max-w-4xl mx-auto bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center transition-all duration-300 hover:border-indigo-500">
            <FaGithub size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-3xl font-bold mb-2">@{PERSONAL_INFO.githubUsername}</h3>
            <p className="text-gray-400 mb-8">Passionate about open-source and building cool things.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
               <StatCard icon={<FaCodeBranch size={24} />} label="Repositories" value="120+" />
               <StatCard icon={<FaStar size={24} />} label="Stars" value="2.1k+" />
               <StatCard icon={<FaUserFriends size={24} />} label="Followers" value="500+" />
            </div>
            
            <a 
                href={`${PERSONAL_INFO.socials.github}/${PERSONAL_INFO.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                View Profile
            </a>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default GitHub;
