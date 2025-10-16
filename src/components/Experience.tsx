import React from 'react';
import { Calendar, MapPin, Briefcase, Building } from 'lucide-react';

const Experience: React.FC = () => {
  const experiences = [
    {
      title: "Managing Director",
      company: "PRO26",
      location: "Kerala, India",
      period: "April 2025 - Present",
      duration: "4 months",
      description: [
        "Leading strategic initiatives and business development",
        "Overseeing technology projects and innovation",
        "Managing cross-functional teams and operations",
        "Driving company growth and market expansion"
      ],
      technologies: ["Leadership", "Strategy", "Innovation", "Team Management"]
    },
    {
      title: "Flutter Developer",
      company: "VectorCrop",
      location: "Kerala, India",
      period: "October 2021 - Present",
      duration: "3 years 10 months",
      description: [
        "Write clean and efficient Flutter code for cross-platform applications",
        "Work with designers and backend developers to ensure seamless integration",
        "Test thoroughly to maintain reliable and high-performance applications",
        "Collaborate on mobile app architecture and development best practices"
      ],
      technologies: ["Flutter", "Dart", "Mobile Development", "Cross-platform"]
    },
    {
      title: "Director of Development",
      company: "VectorCrop",
      location: "Kerala, India",
      period: "2021 - Present",
      duration: "4 years",
      description: [
        "Lead development teams and set technical direction",
        "Oversee project planning and execution",
        "Ensure code quality and development standards",
        "Mentor junior developers and foster team growth"
      ],
      technologies: ["Team Leadership", "Project Management", "Code Review", "Mentoring"]
    },
    {
      title: "A/V Studio Staff",
      company: "Peace Radio",
      location: "Kozhikode, Kerala, India",
      period: "December 2024 - Present",
      duration: "8 months",
      description: [
        "Manage audio/visual equipment and studio operations",
        "Support live broadcasts and ensure clear sound quality",
        "Handle technical troubleshooting during broadcasts",
        "Maintain broadcasting systems and equipment"
      ],
      technologies: ["Audio Engineering", "Broadcasting", "Live Production", "Equipment Management"]
    },
    {
      title: "Technical Assistant",
      company: "Peace Radio",
      location: "Kozhikode, Kerala, India",
      period: "2020 - Present",
      duration: "5 years",
      description: [
        "Fix hardware and software issues across various systems",
        "Set up and maintain audio equipment for broadcasts",
        "Manage network setups and ensure connectivity",
        "Keep broadcasting systems running smoothly and efficiently"
      ],
      technologies: ["Hardware Troubleshooting", "Network Management", "Audio Systems", "Technical Support"]
    },
    {
      title: "Crisis Manager",
      company: "Wisdom Media School",
      location: "Perintalmanna, Kerala, India",
      period: "March 2023 - Present",
      duration: "2 years 5 months",
      description: [
        "Handle crisis situations and emergency response",
        "Coordinate with teams during critical incidents",
        "Develop and implement crisis management protocols",
        "Ensure business continuity during challenging situations"
      ],
      technologies: ["Crisis Management", "Emergency Response", "Team Coordination", "Problem Solving"]
    },
    {
      title: "Video Editor",
      company: "Wisdom Media School",
      location: "Perintalmanna, Kerala, India",
      period: "2020 - January 2025",
      duration: "5 years",
      description: [
        "Edit videos by selecting the best shots and sequences",
        "Add transitions, graphics, and visual effects",
        "Sync audio to create smooth, professional content",
        "Work closely with directors and producers to achieve desired outcomes"
      ],
      technologies: ["Final Cut Pro X", "Video Editing", "Motion Graphics", "Audio Sync"]
    },
    {
      title: "Tutor",
      company: "Skilshore",
      location: "Manjeri, Kerala, India",
      period: "December 2024 - Present",
      duration: "8 months",
      description: [
        "Teach technical skills and programming concepts",
        "Mentor students in Flutter and mobile development",
        "Create educational content and curriculum",
        "Guide students through practical projects"
      ],
      technologies: ["Teaching", "Flutter", "Mentoring", "Curriculum Development"]
    }
  ];

  return (
    <section id="experience" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Professional Experience
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            My journey through various roles, building expertise in Flutter development, IoT, and technical leadership
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-500 to-blue-600 opacity-80"></div>

            {experiences.map((experience, index) => (
              <div key={index} className="relative mb-8 lg:mb-12 last:mb-0">
                {/* Timeline Dot - Hidden on mobile, visible on desktop */}
                <div className="hidden lg:block absolute left-6 w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>

                {/* Content */}
                <div className="lg:ml-20">
                  <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 group">
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {experience.title}
                          </h3>
                          <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold mb-3">
                            <Building size={18} className="mr-2 flex-shrink-0" />
                            <span className="text-base sm:text-lg">{experience.company}</span>
                          </div>
                        </div>
                        <div className="lg:text-right lg:flex-shrink-0">
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-4 lg:gap-2">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <Calendar size={16} className="mr-2 flex-shrink-0" />
                              <span className="text-sm font-medium">{experience.period}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <MapPin size={16} className="mr-2 flex-shrink-0" />
                              <span className="text-sm">{experience.location}</span>
                            </div>
                            <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                              {experience.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <ul className="space-y-3">
                        {experience.description.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                            <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="w-1 h-4 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-2"></span>
                        Key Skills & Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium rounded-full border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all duration-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-16 lg:mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Education
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  Bachelor of Science - Computer Science
                </h4>
                <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2 text-sm sm:text-base">
                  College of Applied Sciences, IHRD, Vazhakkad
                </p>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4 text-sm">
                  <Calendar size={14} className="mr-2" />
                  August 2023 - March 2026
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Currently pursuing degree with focus on software development and computer science fundamentals.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Higher Secondary - Computer Science
                </h4>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2 text-sm sm:text-base">
                  VHSS
                </p>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4 text-sm">
                  <Calendar size={14} className="mr-2" />
                  June 2021 - June 2023
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Specialized in computer science with strong foundation in programming and technology.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  High School Diploma - Computational Science
                </h4>
                <p className="text-green-600 dark:text-green-400 font-semibold mb-2 text-sm sm:text-base">
                  AKMHSS
                </p>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4 text-sm">
                  <Calendar size={14} className="mr-2" />
                  June 2015 - July 2021
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Early exposure to computational science and technology fundamentals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;