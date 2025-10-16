
import React from 'react';
import type { SkillCategory, Project } from './types';
import { SiTypescript, SiJavascript, SiPython, SiCplusplus, SiHtml5, SiCss3, SiReact, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiDocker, SiGit, SiArduino, SiRaspberrypi, SiNextdotjs, SiTailwindcss, SiVercel, SiLinux } from 'react-icons/si';

export const PERSONAL_INFO = {
  name: "Nihan Ali",
  title: "Full-Stack Developer",
  githubUsername: "nihan-vp",                     
  socials: {
    github: "https://github.com/nihan-vp",
    linkedin: "https://in.linkedin.com/in/nihan-ali-vp-b902ab382",
    twitter: "https://twitter.com",
  },
  email: "qwerty311980@gmail.com"
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: [
      { name: "TypeScript", icon: <SiTypescript className="text-blue-500" /> },
      { name: "JavaScript", icon: <SiJavascript className="text-yellow-400" /> },
      { name: "Python", icon: <SiPython className="text-blue-400" /> },
      { name: "C++", icon: <SiCplusplus className="text-blue-600" /> },
      { name: "HTML5", icon: <SiHtml5 className="text-orange-600" /> },
      { name: "CSS3", icon: <SiCss3 className="text-blue-500" /> },
    ]
  },
  {
    title: "Frameworks & Libraries",
    skills: [
      { name: "React", icon: <SiReact className="text-sky-400" /> },
      { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
      { name: "Node.js", icon: <SiNodedotjs className="text-green-500" /> },
      { name: "Express.js", icon: <SiExpress className="text-white" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-400" /> },
    ]
  },
  {
    title: "Databases & DevOps",
    skills: [
      { name: "MongoDB", icon: <SiMongodb className="text-green-600" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-500" /> },
      { name: "Docker", icon: <SiDocker className="text-blue-500" /> },
      { name: "Git", icon: <SiGit className="text-orange-600" /> },
      { name: "Vercel", icon: <SiVercel className="text-white" /> },
      { name: "Linux", icon: <SiLinux className="text-white" /> },
    ]
  },
  {
    title: "IoT & Hardware",
    skills: [
      { name: "Arduino", icon: <SiArduino className="text-teal-500" /> },
      { name: "Raspberry Pi", icon: <SiRaspberrypi className="text-red-600" /> },
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    title: "Eco-Monitoring IoT System",
    description: "A comprehensive IoT platform to monitor environmental data in real-time. Features a React dashboard, Node.js backend, and data collection from Raspberry Pi sensors.",
    tags: ["React", "Node.js", "MongoDB", "IoT", "Raspberry Pi"],
    imageUrl: "https://picsum.photos/seed/project1/600/400",
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    title: "AI-Powered Code Assistant",
    description: "A web-based tool that leverages generative AI to help developers write, debug, and optimize code. Built with Next.js and Tailwind CSS for a seamless UX.",
    tags: ["Next.js", "TypeScript", "AI/ML", "Tailwind CSS"],
    imageUrl: "https://picsum.photos/seed/project2/600/400",
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    title: "Decentralized Voting App",
    description: "A secure and transparent voting application built on blockchain technology. The frontend is crafted with React, interacting with an Ethereum smart contract.",
    tags: ["React", "Blockchain", "Solidity", "Ethers.js"],
    imageUrl: "https://picsum.photos/seed/project3/600/400",
    repoUrl: "#",
  },
   {
    title: "Smart Home Automation Hub",
    description: "An open-source hub to control various smart home devices from a single, unified interface. The system runs on a central server and uses Arduino for custom device integrations.",
    tags: ["Python", "Flask", "React", "Arduino", "MQTT"],
    imageUrl: "https://picsum.photos/seed/project4/600/400",
    liveUrl: "#",
    repoUrl: "#",
  },
];
