import React, { useEffect, useRef } from 'react';
import styles from './Background.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Particle colours – burgundy palette
const PARTICLE_COLORS = [
  'rgba(128, 0, 32,',   // primary #800020
  'rgba(180, 30, 60,',  // lighter wine
  'rgba(255, 143, 163,', // accent rose
  'rgba(200, 50, 80,',  // mid tone
  'rgba(90, 10, 25,',   // deep dark
];

const PARTICLE_COUNT = 80;

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset(true);
  }

  reset(initial = false) {
    const c = this.canvas;
    this.x = Math.random() * c.width;
    this.y = initial ? Math.random() * c.height : c.height + 10;
    this.size = Math.random() * 2.2 + 0.4;       // 0.4 – 2.6 px
    this.speedX = (Math.random() - 0.5) * 0.4;   // gentle drift
    this.speedY = -(Math.random() * 0.5 + 0.15); // float upward
    this.opacity = Math.random() * 0.55 + 0.1;
    this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    this.glow = Math.random() > 0.7;              // 30% particles glow
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.pulseAngle = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulseAngle += this.pulseSpeed;
    // wrap horizontally
    const c = this.canvas;
    if (this.x < -5) this.x = c.width + 5;
    if (this.x > c.width + 5) this.x = -5;
    // reset when off top
    if (this.y < -10) this.reset(false);
  }

  draw(ctx) {
    const pulse = 1 + Math.sin(this.pulseAngle) * 0.3;
    const alpha = this.opacity * pulse;

    if (this.glow) {
      // outer glow - optimized by using a larger translucent circle instead of creating a heavy radial gradient on every frame
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${(alpha * 0.12).toFixed(2)})`;
      ctx.fill();
    }

    // core dot
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color} ${alpha.toFixed(2)})`;
    ctx.fill();
  }
}

const Background = ({ devMode }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // init particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => new Particle(canvas));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={clsx(styles.backgroundContainer, devMode && styles.devMode)}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} className={styles.particleCanvas} />

      <div className={styles.overlay} />

      {/* Grid line overlay in devMode */}
      <AnimatePresence>
        {devMode && (
          <motion.div
            className={styles.devBackground}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.gridLines} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.blobs}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </div>
    </div>
  );
};

export default Background;
