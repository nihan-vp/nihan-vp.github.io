import React from 'react';
import { Download, Github, Linkedin, Phone, Mail, Star, Code, Cpu } from 'lucide-react';


const Hero: React.FC = () => {

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 pb-16 md:pt-0">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900"></div>

      {/* Animated Background Blobs - Responsive */}
      <div className="absolute top-10 md:top-20 left-5 md:left-10 w-48 h-48 md:w-72 md:h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 md:top-40 right-5 md:right-10 w-48 h-48 md:w-72 md:h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-10 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Floating Tech Icons - Hidden on mobile */}
      <div className="hidden md:block absolute top-32 left-1/4 opacity-20 dark:opacity-10 animate-pulse">
        <Code size={40} className="text-blue-500" />
      </div>
      <div className="hidden md:block absolute top-1/3 right-1/4 opacity-20 dark:opacity-10 animate-bounce" style={{ animationDelay: '1s' }}>
        <Cpu size={32} className="text-purple-500" />
      </div>
      <div className="hidden md:block absolute bottom-1/3 left-1/3 opacity-20 dark:opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>
        <Star size={28} className="text-yellow-500" />
      </div>

      <div className="container mx-auto px-4 mt-20 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Enhanced Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
            <div className="mb-6 lg:mb-8">
              {/* Greeting with animation */}
              <div className="mb-3 lg:mb-4">
                <span className="inline-block text-base lg:text-lg text-blue-600 dark:text-blue-400 font-medium mb-2 animate-fade-in">
                  👋 Hello, I'm
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 lg:mb-4 leading-tight tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient-x">
                  Muhammed Shabeer OP
                </span>
              </h1>


              {/* Static Subtitle */}
              <div className="h-12 sm:h-14 lg:h-20 mb-3 lg:mb-4">
                <h2 className="text-lg sm:text-xl lg:text-3xl text-gray-600 dark:text-gray-300 font-light">
                  Full Stack Flutter Developer
                </h2>
              </div>

              <h3 className="text-base sm:text-lg lg:text-2xl text-blue-600 dark:text-blue-400 mb-4 lg:mb-6 font-medium px-2 lg:px-0">
                Managing Director at PRO26 | IoT Innovator | Tech Mentor
              </h3>

              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed px-2 lg:px-0">
                Passionate about crafting exceptional digital experiences through innovative mobile apps and cutting-edge IoT solutions.
                I bring ideas to life with Flutter's cross-platform magic and hardware expertise in PCB design.
              </p>
            </div>

            {/* Quick Contact */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start mb-6 lg:mb-8">
              <a
                href="tel:+916238261610"
                className="flex items-center gap-2 text-sm lg:text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 justify-center lg:justify-start"
              >
                <Phone size={16} className="lg:hidden" />
                <Phone size={18} className="hidden lg:block" />
                +91 6238261610
              </a>
              <a
                href="mailto:androlite4@gmail.com"
                className="flex items-center gap-2 text-sm lg:text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 justify-center lg:justify-start"
              >
                <Mail size={16} className="lg:hidden" />
                <Mail size={18} className="hidden lg:block" />
                androlite4@gmail.com
              </a>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start mb-6 lg:mb-8 px-4 sm:px-0">
              <a
                href="/Profile.pdf"
                download
                className="group px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm lg:text-base"
              >
                <Download size={18} className="lg:hidden group-hover:animate-bounce" />
                <Download size={20} className="hidden lg:block group-hover:animate-bounce" />
                Download CV
              </a>
              <button
                onClick={scrollToAbout}
                className="px-6 lg:px-8 py-3 lg:py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
              >
                View My Work
              </button>
            </div>

            {/* Enhanced Social Links */}
            <div className="flex gap-4 lg:gap-6 justify-center lg:justify-start mb-6 lg:mb-8">
              <a
                href="https://www.linkedin.com/in/shabeer-wms"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 lg:p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Linkedin size={20} className="lg:hidden group-hover:animate-pulse" />
                <Linkedin size={24} className="hidden lg:block group-hover:animate-pulse" />
              </a>
              <a
                href="https://github.com/shabeer-wms"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 lg:p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Github size={20} className="lg:hidden group-hover:animate-pulse" />
                <Github size={24} className="hidden lg:block group-hover:animate-pulse" />
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4 max-w-sm sm:max-w-md mx-auto lg:mx-0">
              <div className="text-center p-3 lg:p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg">
                <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">5+</div>
                <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg">
                <div className="text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400">50+</div>
                <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Projects Done</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg col-span-2 sm:col-span-1">
                <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">1</div>
                <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Company</div>
              </div>
            </div>
          </div>

          {/* Enhanced Profile Image */}
          <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative">
              {/* Glowing ring animation */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-spin opacity-75 blur-sm" style={{ animationDuration: '3s' }}></div>

              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl border-4 lg:border-8 border-white dark:border-gray-700 transform hover:scale-105 transition-all duration-500 hover:shadow-3xl">
                <img
                  src="/profile.jpg"
                  alt="Muhammed Shabeer OP"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Floating Skill Badges */}
              <div className="pointer-events-none">
                {/* Top Right - Flutter */}
                <div className="absolute -top-2 lg:-top-4 -right-8 lg:-right-12 px-2 lg:px-4 py-1 lg:py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border border-blue-200 dark:border-gray-600 transform rotate-12 hover:rotate-0 transition-transform duration-300">
                  <span className="text-xs lg:text-sm font-semibold text-blue-600 dark:text-blue-400">Flutter</span>
                </div>

                {/* Top Left - IoT */}
                <div className="absolute -top-4 lg:-top-8 -left-4 lg:-left-8 px-2 lg:px-3 py-1 lg:py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border border-purple-200 dark:border-gray-600 transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                  <span className="text-xs lg:text-sm font-semibold text-purple-600 dark:text-purple-400">IoT</span>
                </div>

                {/* Bottom Left - PCB */}
                <div className="absolute -bottom-3 lg:-bottom-6 -left-6 lg:-left-10 px-2 lg:px-3 py-1 lg:py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border border-green-200 dark:border-gray-600 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                  <span className="text-xs lg:text-sm font-semibold text-green-600 dark:text-green-400">PCB</span>
                </div>

                {/* Bottom Right - Mobile */}
                <div className="absolute -bottom-2 lg:-bottom-4 -right-10 lg:-right-16 px-2 lg:px-4 py-1 lg:py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border border-orange-200 dark:border-gray-600 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <span className="text-xs lg:text-sm font-semibold text-orange-600 dark:text-orange-400">Mobile Apps</span>
                </div>

                {/* Subtle Tech Icons - Hidden on mobile */}
                <div className="hidden lg:block absolute top-8 right-8 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center opacity-60 animate-pulse">
                  <Code size={14} className="text-blue-600 dark:text-blue-400" />
                </div>

                <div className="hidden lg:block absolute bottom-12 left-6 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>
                  <Cpu size={14} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;