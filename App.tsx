
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import GitHub from './components/GitHub';
import Contact from './components/Contact';
import Footer from './components/Footer';


const App: React.FC = () => {
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="bg-[#0a0a0a] text-gray-200 min-h-screen overflow-x-hidden">
            <div 
                className="hidden lg:block pointer-events-none fixed inset-0 z-50 transition duration-300"
                style={{
                    background: `radial-gradient(600px at ${cursorPos.x}px ${cursorPos.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
                }}
            />
            <Header />
            <main className="container mx-auto px-6 md:px-12 lg:px-24">
                <Hero />
                <About />
                <Skills />
                <Projects />
                <GitHub />
                <Contact />
            </main>
            <Footer />
            
        </div>
    );
};

export default App;