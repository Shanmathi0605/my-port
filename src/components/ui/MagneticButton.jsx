import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MagneticButton({ children, className, onClick, href, ...props }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rectRef = useRef(null);

  const handleMouseMove = (e) => {
    // Cache the bounding rect on first move so we don't force synchronous layouts on every frame
    if (!rectRef.current && ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    
    if (rectRef.current) {
      const { clientX, clientY } = e;
      const { height, width, left, top } = rectRef.current;
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    }
  };

  const handleMouseLeave = () => {
    rectRef.current = null; // Clear cached rect so it is recalculated correctly next time (e.g. after scroll)
    setPosition({ x: 0, y: 0 });
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
      href={href}
      style={{ display: 'inline-block' }}
      {...props}
    >
      {children}
    </Component>
  );
}
