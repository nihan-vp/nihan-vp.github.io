import React from 'react';
import { PERSONAL_INFO } from '../constants';

const Skills: React.FC = () => {
  const isDark = true; // The portfolio is dark-themed
  const githubUsername = PERSONAL_INFO.githubUsername;

  const skillCategories = [
    {
      title: "Programming Languages",
      skills: [
        { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
        { name: "Dart", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },
        { name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },     
        { name: "HTML5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { name: "CSS3", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        { name: "Bash", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" }
      ]
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        { name: "Flutter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
        { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "Bootstrap", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
        { name: "Tailwind CSS", logo: "https://res.cloudinary.com/dfg2erf3z/image/upload/v1760345760/3920388-middle-removebg-preview_qsjshz.png" },       
      ]
    },
    {
      title: "Cloud & Backend Services",
      skills: [
        { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
        { name: "Appwrite", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/appwrite/appwrite-original.svg" },
        { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
        { name: "Nginx", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" },
        { name: "WordPress", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg" }
      ]
    },
    {
      title: "Developer Tools & Platforms",
      skills: [
        { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
        { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
        { name: "GitLab", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" },
        { name: "GitHub Actions", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg" },
        { name: "NPM", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" },
        { name: "VS Code", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
        { name: "Gradle", logo: "https://raw.githubusercontent.com/devicons/devicon/6910f0503efdd315c8f9b858234310c06e04d9c0/icons/gradle/gradle-original.svg" },
      ]
    },
    {
      title: "IoT & Hardware",
      skills: [
        { name: "Raspberry Pi", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg" },
        { name: "Arduino", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg" },
        { name: "Ubiquiti", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Ubiquiti_Logo_2023.svg" },
        { name: "ESP32", logo: "https://res.cloudinary.com/dfg2erf3z/image/upload/v1760345819/png-transparent-espressif-systems-hd-logo-removebg-preview_moi0id.png" },
        { name: "Home Assistant", logo: "https://www.home-assistant.io/images/favicon-192x192.png" }
      ]
    },
    {
      title: "Design & Creative Tools",
      skills: [
        { name: "Adobe Photoshop", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" },
        { name: "Adobe After Effects", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg" },
        { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
        { name: "Blender", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" },
        { name: "GIMP", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gimp/gimp-original.svg" },
        { name: "Canva", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg" }       
      ]
    },
    {
      title: "Gaming & Entertainment",
      skills: [
        { name: "Unity", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg" },
        { name: "Xbox", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg" },
        { name: "Steam", logo: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" }
      ]
    },
    {
      title: "Utilities & Extensions",
      skills: [
        { name: "Tampermonkey", logo: "https://tampermonkey.net/favicon.ico" },
        { name: "Meta", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" }
      ]
    }
  ];

  return (
    <section id="skills" className="py-24 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 gradient-text">
            Skills & Technologies
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="group bg-gray-900/50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-700 hover:border-indigo-600"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                  {category.title}
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skillIndex} 
                    className="group/item flex flex-col items-center p-4 bg-gray-800/70 rounded-xl hover:bg-gray-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-500"
                  >
                    <div className="w-14 h-14 mb-3 p-2 bg-gray-900 rounded-lg shadow-sm group-hover/item:shadow-md transition-all duration-300 flex items-center justify-center">
                      <img
                        src={skill.logo}
                        alt={skill.name}
                        className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="text-gray-300 font-semibold text-center text-sm leading-tight group-hover/item:text-indigo-400 transition-colors duration-300">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-600">
                <div className="text-center">
                  <span className="text-sm text-gray-400 font-medium">
                    {category.skills.length} Technologies
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 gradient-text">
              Core Technologies
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              The primary technologies I use to build exceptional solutions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Flutter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", category: "Mobile Development", color: "from-blue-500 to-cyan-500" },
              { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", category: "Web Frontend", color: "from-cyan-500 to-blue-400" },
              { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", category: "Backend & AI", color: "from-green-500 to-blue-500" },
              { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", category: "Full Stack", color: "from-yellow-500 to-orange-500" },
              { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", category: "Cloud Platform", color: "from-orange-500 to-red-500" },
              { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", category: "Backend Runtime", color: "from-green-600 to-green-400" },
              { name: "Arduino", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg", category: "IoT Hardware", color: "from-teal-500 to-cyan-500" },
              { name: "Raspberry Pi", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg", category: "Edge Computing", color: "from-pink-500 to-red-500" },
              { name: "Unity", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg", category: "Game Engine", color: "from-gray-700 to-gray-500" },
              { name: "Photoshop", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg", category: "Design Tools", color: "from-blue-600 to-purple-600" },
              { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", category: "Version Control", color: "from-gray-800 to-gray-600" },
              { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", category: "Database", color: "from-green-600 to-green-800" }
            ].map((skill, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden bg-gradient-to-br ${skill.color} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                <div className="relative z-10 flex flex-col items-center text-center text-white">
                  <div className="w-16 h-16 mb-4 p-3 bg-white/90 rounded-xl backdrop-blur-sm group-hover:bg-white transition-colors duration-300">
                    <img
                      src={skill.logo}
                      alt={skill.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <h4 className="font-bold text-lg mb-1 group-hover:scale-110 transition-transform duration-300">
                    {skill.name}
                  </h4>
                  <p className="text-sm opacity-90 font-medium">
                    {skill.category}
                  </p>
                </div>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 rounded-full border border-indigo-500/30">
              <span className="text-indigo-400 font-semibold">
                🚀 Specialized in Cross-Platform Development & IoT Solutions
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 gradient-text">
              GitHub Activity
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
              My coding journey and contributions on GitHub
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              <div className="group bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">5+</div>
                <div className="text-sm opacity-90 font-medium">Years Coding</div>
              </div>
              <div className="group bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
                <div className="text-sm opacity-90 font-medium">Repositories</div>
              </div>
              <div className="group bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">1000+</div>
                <div className="text-sm opacity-90 font-medium">Contributions</div>
              </div>
              <div className="group bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">⭐</div>
                <div className="text-sm opacity-90 font-medium">Active Daily</div>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            <div className="group bg-gray-900/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-700 hover:border-indigo-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-white">GitHub Statistics</h4>
                <div className="w-10 h-10 bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-4">
                <img
                  src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=dark&hide_border=true&title_color=60A5FA&icon_color=8B5CF6&text_color=D1D5DB&bg_color=1F293700`}
                  alt="GitHub Stats"
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            <div className="group bg-gray-900/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-700 hover:border-purple-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-white">Most Used Languages</h4>
                <div className="w-10 h-10 bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-4">
                <img
                  src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=dark&hide_border=true&title_color=60A5FA&text_color=D1D5DB&bg_color=1F293700`}
                  alt="Top Languages"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="lg:col-span-2 group bg-gray-900/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-700 hover:border-green-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-white">Contribution Streak</h4>
                <div className="w-10 h-10 bg-green-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-4">
                <img
                  src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=dark&hide_border=true&stroke=60A5FA&ring=A78BFA&fire=F59E0B&currStreakLabel=D1D5DB&sideLabels=D1D5DB&currStreakNum=FFFFFF&sideNums=FFFFFF&dates=D1D5DB&background=1F293700`}
                  alt="GitHub Streak"
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            <div className="group bg-gradient-to-br from-indigo-900/20 to-pink-900/20 p-8 rounded-3xl border border-indigo-400/30 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">GitHub Profile</h4>
                  <p className="text-sm text-gray-400 mb-6">Explore my open source contributions and projects</p>
                  <a
                    href={`https://github.com/${githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 gap-2 shadow-lg"
                  >
                    Visit GitHub
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="group bg-gray-900/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-700 hover:border-indigo-500 max-w-6xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-bold text-white">Contribution Activity</h4>
              <div className="w-10 h-10 bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-6">
              <img
                src={`https://github-readme-activity-graph.vercel.app/graph?username=${githubUsername}&theme=github-dark&hide_border=true&bg_color=1F293700&color=D1D5DB&line=60A5FA&point=A78BFA&area=true&area_color=60A5FA`}
                alt="GitHub Activity Graph"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
