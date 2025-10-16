import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Mobile",
      value: "+91 6238261610",
      link: "tel:+916238261610"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "androlite4@gmail.com",
      link: "mailto:androlite4@gmail.com"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      value: "Kottakkal, Kerala, India",
      link: null
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="w-6 h-6" />,
      name: "GitHub",
      url: "https://github.com/shabeer-wms",
      color: "hover:text-gray-900 dark:hover:text-white"
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/shabeer-wms",
      color: "hover:text-blue-600"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      name: "WhatsApp",
      url: "https://wa.me/916238261610",
      color: "hover:text-green-600"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Always learning, always improving — hit me up if you want to collaborate or chat about cool projects!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Let's Connect
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Whether you have a Flutter project in mind, need IoT solutions, want to collaborate on 
                innovative tech projects, or just want to chat about technology, I'd love to hear from you. 
                Feel free to reach out through any of the channels below.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {info.title}
                    </h4>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Professional Info */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Professional Roles
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-300">Managing Director at PRO26</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-300">Full Stack Flutter Developer</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-300">IoT Innovator & Tech Mentor</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Connect With Me
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 text-gray-600 dark:text-gray-300 ${social.color}`}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;