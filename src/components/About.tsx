import React, { useEffect, useRef, useState } from 'react';
import { Smartphone, Cpu, Palette, Users, Award, Lightbulb, Code, Zap, Target, Heart } from 'lucide-react';

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const highlights = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Flutter Expert",
      description: "Building smooth cross-platform mobile apps that work like a charm",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "IoT Innovation",
      description: "Creating smart solutions with IoT and PCB design expertise",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Creative Design",
      description: "Adobe Creative Suite, Final Cut Pro X, and Blender for stunning visuals",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Leadership",
      description: "Managing Director at PRO26, leading teams and driving innovation",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Tech Mentor",
      description: "Teaching and guiding the next generation of developers",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Problem Solver",
      description: "Solving tricky problems with smart, practical fixes",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const stats = [
    { number: "5+", label: "Years Experience", icon: <Target className="w-6 h-6" /> },
    { number: "50+", label: "Projects Completed", icon: <Code className="w-6 h-6" /> },
    { number: "100%", label: "Client Satisfaction", icon: <Heart className="w-6 h-6" /> },
    { number: "24/7", label: "Innovation Drive", icon: <Zap className="w-6 h-6" /> }
  ];

  return (
    <section ref={sectionRef} id="about" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
              About Me
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Passionate Full Stack Developer & Innovation Leader, crafting digital experiences that matter
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-blue-600 dark:text-blue-400 mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Enhanced Content */}
          <div className={`space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="relative">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Full Stack Flutter Developer & 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> IoT Innovator</span>
              </h3>
              
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="relative pl-6">
                  <span className="absolute left-0 top-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                  I'm a passionate Full Stack Flutter Developer who transforms ideas into elegant, user-friendly mobile applications. 
                  As the Managing Director at <span className="font-semibold text-blue-600 dark:text-blue-400">PRO26</span>, I lead innovative projects that bridge cutting-edge technology with real-world solutions.
                </p>
                
                <p className="relative pl-6">
                  <span className="absolute left-0 top-2 w-2 h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></span>
                  My expertise spans Flutter development, IoT systems, and PCB design — I thrive on solving complex technical challenges with creative, efficient solutions. 
                  My creative toolkit includes Adobe Creative Suite, Final Cut Pro X, and Blender, ensuring every project delivers both functionality and aesthetic excellence.
                </p>
                
                <p className="relative pl-6">
                  <span className="absolute left-0 top-2 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                  From video editing at Wisdom Media School to technical innovation at Peace Radio, I bring a unique blend of technical mastery and creative vision. 
                  I'm constantly learning, evolving, and pushing boundaries — let's collaborate on something extraordinary!
                </p>
              </div>
            </div>

            {/* Enhanced Key Points */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-xl">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Target className="w-5 h-5 text-white" />
                </span>
                Core Strengths
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "5+ years in development & technical leadership",
                  "Managing Director with proven team leadership",
                  "Flutter, IoT & PCB design expertise",
                  "Creative mastery in video editing & design",
                  "Current CS student with academic foundation"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-gray-600/30 rounded-xl">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                  </div>
                ))}
                
              </div>
            </div>

            {/* Enhanced Education */}
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <Award className="w-5 h-5 text-white" />
                </span>
                Education Journey
              </h4>
              <div className="space-y-4">
                {[
                  {
                    degree: "Bachelor of Science - Computer Science",
                    institution: "College of Applied Sciences, IHRD, Vazhakkad",
                    period: "2023-2026",
                    status: "Current"
                  },
                  {
                    degree: "Higher Secondary - Computer Science",
                    institution: "VHSS",
                    period: "2021-2023",
                    status: "Completed"
                  }
                ].map((edu, index) => (
                  <div key={index} className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-gradient-to-b from-blue-500 to-purple-500">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-bold text-gray-900 dark:text-white text-lg">{edu.degree}</h5>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        edu.status === 'Current' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {edu.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">{edu.institution}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Highlights Grid */}
          <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Icon with Gradient Background */}
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${highlight.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {highlight.icon}
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {highlight.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                    {highlight.description}
                  </p>
                  
                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-600 rounded-2xl transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;