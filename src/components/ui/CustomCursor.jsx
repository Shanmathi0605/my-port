import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';

// SVG Butterfly wings
const ButterflyWings = ({ flap }) => (
  <svg
    width="52"
    height="44"
    viewBox="0 0 52 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.butterflySvg}
    style={{ transform: flap ? 'scaleX(0.55) scaleY(0.9)' : 'scaleX(1) scaleY(1)', transition: 'transform 0.12s ease' }}
  >
    {/* Left upper wing */}
    <path
      d="M26 22 C14 8, -2 2, 2 16 C5 26, 16 28, 26 22Z"
      fill="url(#wingGradL)"
      opacity="0.92"
    />
    {/* Left lower wing */}
    <path
      d="M26 22 C12 24, 4 32, 8 38 C12 44, 22 38, 26 22Z"
      fill="url(#wingGradL2)"
      opacity="0.8"
    />
    {/* Right upper wing */}
    <path
      d="M26 22 C38 8, 54 2, 50 16 C47 26, 36 28, 26 22Z"
      fill="url(#wingGradR)"
      opacity="0.92"
    />
    {/* Right lower wing */}
    <path
      d="M26 22 C40 24, 48 32, 44 38 C40 44, 30 38, 26 22Z"
      fill="url(#wingGradR2)"
      opacity="0.8"
    />
    {/* Body */}
    <ellipse cx="26" cy="22" rx="2.5" ry="10" fill="#800020" opacity="0.95" />
    {/* Antennae */}
    <path d="M25 13 C22 6, 18 3, 16 1" stroke="#ff8fa3" strokeWidth="1" strokeLinecap="round" />
    <path d="M27 13 C30 6, 34 3, 36 1" stroke="#ff8fa3" strokeWidth="1" strokeLinecap="round" />
    <circle cx="16" cy="1" r="2" fill="#ff8fa3" />
    <circle cx="36" cy="1" r="2" fill="#ff8fa3" />

    <defs>
      <radialGradient id="wingGradL" cx="30%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#ff8fa3" />
        <stop offset="50%" stopColor="#800020" />
        <stop offset="100%" stopColor="#4a000f" stopOpacity="0.7" />
      </radialGradient>
      <radialGradient id="wingGradL2" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ff6b8a" />
        <stop offset="100%" stopColor="#4a000f" stopOpacity="0.6" />
      </radialGradient>
      <radialGradient id="wingGradR" cx="70%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#ff8fa3" />
        <stop offset="50%" stopColor="#800020" />
        <stop offset="100%" stopColor="#4a000f" stopOpacity="0.7" />
      </radialGradient>
      <radialGradient id="wingGradR2" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ff6b8a" />
        <stop offset="100%" stopColor="#4a000f" stopOpacity="0.6" />
      </radialGradient>
    </defs>
  </svg>
);

const CustomCursor = () => {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const [flap, setFlap] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const flapRef = useRef(null);
  const sparkleId = useRef(0);

  const springX = useSpring(cursorX, { damping: 18, stiffness: 200, mass: 0.6 });
  const springY = useSpring(cursorY, { damping: 18, stiffness: 200, mass: 0.6 });

  useEffect(() => {
    // Wing flap interval
    flapRef.current = setInterval(() => {
      setFlap(f => !f);
    }, 160);

    const handleMouseMove = (e) => {
      cursorX.set(e.clientX - 26);
      cursorY.set(e.clientY - 22);

      // Tiny sparkle trail every ~200ms
      const id = ++sparkleId.current;
      const s = {
        id,
        x: e.clientX + (Math.random() - 0.5) * 16,
        y: e.clientY + (Math.random() - 0.5) * 16,
      };
      setSparkles(prev => [...prev.slice(-7), s]);
      setTimeout(() => setSparkles(prev => prev.filter(sp => sp.id !== id)), 700);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"]')) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      clearInterval(flapRef.current);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Sparkle trail */}
      {sparkles.map(s => (
        <div
          key={s.id}
          className={styles.sparkle}
          style={{ left: s.x, top: s.y }}
        />
      ))}

      {/* Butterfly cursor */}
      <motion.div
        className={styles.butterfly}
        style={{ x: springX, y: springY }}
        animate={{ scale: hovered ? 1.35 : 1, rotate: hovered ? 10 : 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
      >
        <ButterflyWings flap={flap} />
      </motion.div>
    </>
  );
};

export default CustomCursor;
