import { Phone } from 'lucide-react';
import type { Project } from './types';

export const PERSONAL_INFO = {
  name: "Nihan Ali",
  title: "Full-Stack Developer",
  githubUsername: "nihan-vp",
  socials: {
    github: "https://github.com/nihan-vp",
    linkedin: "https://in.linkedin.com/in/nihan-ali-vp-b902ab382",
    twitter: "https://twitter.com",
  },
  email: "qwerty311980@gmail.com",
  phone: "+91 7736708566"
};

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
