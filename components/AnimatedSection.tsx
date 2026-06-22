import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'blur' | 'slide-scale' | '3d-flip' | '3d-unfold';
}

const variants = {
  up:    { hidden: { opacity: 0, y: 50 },  visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 50 },  visible: { opacity: 1, x: 0 } },
  fade:  { hidden: { opacity: 0 },         visible: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1 } },
  blur:  { hidden: { opacity: 0, filter: 'blur(8px)', y: 20 }, visible: { opacity: 1, filter: 'blur(0px)', y: 0 } },
  'slide-scale': { hidden: { opacity: 0, scale: 0.92, y: 30 }, visible: { opacity: 1, scale: 1, y: 0 } },
  '3d-flip': { hidden: { opacity: 0, rotateX: 35, y: 40, z: -100 }, visible: { opacity: 1, rotateX: 0, y: 0, z: 0 } },
  '3d-unfold': { hidden: { opacity: 0, rotateY: -25, scale: 0.95 }, visible: { opacity: 1, rotateY: 0, scale: 1 } },
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of individual element relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculate dynamic 3D scroll transforms (tilt forward and slide back as you scroll)
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [15, 0, 0, -15]);
  const translateZ = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [-80, 0, 0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.5, 1, 1, 0.5]);

  // If using standard 3D flip or unfold, let it track scroll dynamically
  const is3D = direction === '3d-flip' || direction === '3d-unfold';

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-100px" }}
      variants={variants[direction]}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      style={is3D ? {
        perspective: 1200,
        rotateX,
        z: translateZ,
        opacity,
        transformStyle: 'preserve-3d',
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
