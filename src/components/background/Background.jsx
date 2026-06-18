import React, { useEffect, useRef, useState } from 'react';
import styles from './Background.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Shapes configurations
const NORMAL_SHAPES = ['CONFETTI', 'GALAXY', 'DNA', 'HEART', 'SHANMATHI'];
const DEV_SHAPES = ['GRID3D', 'MATRIX_RAIN'];

const getTextTargets = (text, count, width, height) => {
  const targets = [];
  const size = Math.min(width, height);
  
  // Wide canvas so all 9 characters of SHANMATHI fit without clipping
  const CW = 1000;
  const CH = 160;
  const offCanvas = document.createElement('canvas');
  const offCtx = offCanvas.getContext('2d');
  offCanvas.width = CW;
  offCanvas.height = CH;
  
  offCtx.clearRect(0, 0, CW, CH);
  offCtx.fillStyle = '#ffffff';
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  
  // 48px font + 8px letter spacing — all 9 chars fit within 1000px easily
  offCtx.letterSpacing = '8px';
  offCtx.font = '900 48px Outfit, Inter, sans-serif';
  offCtx.fillText(text, CW / 2, CH / 2);
  
  const imgData = offCtx.getImageData(0, 0, CW, CH);
  const points = [];
  
  // Step of 3 for dense, well-filled outlines
  const step = 3;
  for (let y = 0; y < CH; y += step) {
    for (let x = 0; x < CW; x += step) {
      const idx = (y * CW + x) * 4;
      if (imgData.data[idx + 3] > 120) {
        points.push({
          x: x - CW / 2,
          y: y - CH / 2,
          z: 0
        });
      }
    }
  }
  
  // Fallback if no pixels captured (e.g. font hasn't loaded)
  if (points.length === 0) {
    for (let i = 0; i < count; i++) {
      targets.push({ x: 0, y: 0, z: 0 });
    }
    return targets;
  }
  
  // Scale to fit the viewport
  const scale = size * 0.0017;
  for (let i = 0; i < count; i++) {
    const ptIdx = Math.floor((i / count) * points.length);
    const pt = points[ptIdx] || points[0];
    targets.push({
      x: pt.x * scale,
      y: pt.y * scale - 18,
      z: 0
    });
  }
  
  return targets;
};

const getShapeTargets = (shape, count, width, height) => {
  const targets = [];
  const size = Math.min(width, height);

  switch (shape) {
    case 'CONFETTI': {
      // Scatter particles randomly across the entire viewport (no circular layout)
      for (let i = 0; i < count; i++) {
        targets.push({
          x: (Math.random() - 0.5) * width * 0.98,
          y: (Math.random() - 0.5) * height * 0.95,
          z: (Math.random() - 0.5) * 120
        });
      }
      break;
    }
    case 'GALAXY': {
      const maxR = size * 0.38;
      for (let i = 0; i < count; i++) {
        const arm = i % 2;
        const progress = i / count;
        const angle = progress * 12 + arm * Math.PI;
        const r = progress * maxR;
        targets.push({
          x: r * Math.cos(angle) + (Math.random() - 0.5) * 30,
          y: (Math.random() - 0.5) * 20,
          z: r * Math.sin(angle) + (Math.random() - 0.5) * 30
        });
      }
      break;
    }
    case 'DNA': {
      const helixR = size * 0.13;
      const helixH = size * 0.6;
      for (let i = 0; i < count; i++) {
        const isStrandA = i < count * 0.4;
        const isStrandB = i >= count * 0.4 && i < count * 0.8;

        if (isStrandA) {
          const t = (i / (count * 0.4)) * Math.PI * 4;
          targets.push({
            x: helixR * Math.cos(t),
            y: (i / (count * 0.4)) * helixH - helixH / 2,
            z: helixR * Math.sin(t)
          });
        } else if (isStrandB) {
          const idx = i - count * 0.4;
          const t = (idx / (count * 0.4)) * Math.PI * 4 + Math.PI;
          targets.push({
            x: helixR * Math.cos(t),
            y: (idx / (count * 0.4)) * helixH - helixH / 2,
            z: helixR * Math.sin(t)
          });
        } else {
          const idx = i - count * 0.8;
          const progress = idx / (count * 0.2);
          const t = progress * Math.PI * 4;
          const ratio = Math.random();
          const xA = helixR * Math.cos(t);
          const zA = helixR * Math.sin(t);
          const xB = helixR * Math.cos(t + Math.PI);
          const zB = helixR * Math.sin(t + Math.PI);
          const yVal = progress * helixH - helixH / 2;

          targets.push({
            x: xA + (xB - xA) * ratio,
            y: yVal,
            z: zA + (zB - zA) * ratio
          });
        }
      }
      break;
    }
    case 'SHANMATHI': {
      const textTargets = getTextTargets('SHANMATHI', count, width, height);
      targets.push(...textTargets);
      break;
    }
    case 'HEART': {
      const scale = size * 0.017;
      for (let i = 0; i < count; i++) {
        // Uniform distribution on a 3D heart shell
        const u = (i / count) * Math.PI * 2;
        const v = Math.random() * Math.PI;
        
        // 3D Heart parametric equations
        const x = 16 * Math.pow(Math.sin(u), 3) * Math.sin(v);
        const y = (13 * Math.cos(u) - 5 * Math.cos(2*u) - 2 * Math.cos(3*u) - Math.cos(4*u)) * Math.sin(v);
        const z = 12 * Math.cos(v); // 3D depth
        
        targets.push({
          x: x * scale,
          y: -y * scale - size * 0.03, // Invert Y because screen Y goes down, center vertically
          z: z * scale
        });
      }
      break;
    }
    case 'MATRIX_RAIN': {
      const cols = 28;
      const colWidth = width / cols;
      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        targets.push({
          x: col * colWidth - width / 2 + colWidth / 2,
          y: row * 32 - height / 2,
          z: 0
        });
      }
      break;
    }
    case 'GRID3D': {
      const planeWidth = size * 0.7;
      const side = Math.floor(Math.sqrt(count));
      for (let i = 0; i < count; i++) {
        const xi = i % side;
        const zi = Math.floor(i / side);
        targets.push({
          x: (xi / side - 0.5) * planeWidth,
          y: Math.sin((xi + zi) * 0.35) * 25,
          z: (zi / side - 0.5) * planeWidth
        });
      }
      while (targets.length < count) {
        targets.push({ x: 0, y: 0, z: 0 });
      }
      break;
    }
    default:
      for (let i = 0; i < count; i++) {
        targets.push({
          x: (Math.random() - 0.5) * size * 0.5,
          y: (Math.random() - 0.5) * size * 0.5,
          z: (Math.random() - 0.5) * size * 0.5
        });
      }
  }
  return targets;
};

const Background = ({ devMode }) => {
  const canvasRef = useRef(null);
  const particleCount = 700;

  // Active shape names
  const shapes = devMode ? DEV_SHAPES : NORMAL_SHAPES;
  const [shapeIndex, setShapeIndex] = useState(0);
  const currentShape = shapes[shapeIndex];

  // Store variables in refs to access within requestAnimationFrame without re-binding
  const stateRef = useRef({
    particles: [],
    width: 0,
    height: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    angleX: 0,
    angleY: 0,
    currentShape: '',
    devMode: false,
    confettiOffsetX: 0,
    confettiOffsetY: 0,
    confettiVx: 0.35,
    confettiVy: 0.22
  });

  // Adjust shapeIndex during render if devMode toggles
  const [prevDevMode, setPrevDevMode] = useState(devMode);
  if (devMode !== prevDevMode) {
    setPrevDevMode(devMode);
    setShapeIndex(0);
  }

  useEffect(() => {
    stateRef.current.currentShape = currentShape;
    stateRef.current.devMode = devMode;

    // Reinitialize target coordinates when shape or devMode changes
    const w = stateRef.current.width;
    const h = stateRef.current.height;
    if (w && h) {
      const targets = getShapeTargets(currentShape, particleCount, w, h);
      stateRef.current.particles.forEach((p, idx) => {
        if (targets[idx]) {
          p.tx = targets[idx].x;
          p.ty = targets[idx].y;
          p.tz = targets[idx].z;
          p.baseTx = targets[idx].x;
          p.baseTy = targets[idx].y;
          p.baseTz = targets[idx].z;
        }
      });
    }
  }, [currentShape, devMode]);
  // Scroll-linked shape morphing
  useEffect(() => {
    if (devMode) {
      const handleScrollDev = () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollRatio = maxScroll > 0 ? scrollY / maxScroll : 0;
        
        if (scrollRatio < 0.55) {
          setShapeIndex(0); // GRID3D
        } else {
          setShapeIndex(1); // MATRIX_RAIN
        }
      };

      window.addEventListener('scroll', handleScrollDev);
      handleScrollDev();
      return () => window.removeEventListener('scroll', handleScrollDev);
    } else {
      const sectionIds = ['home', 'about', 'skills', 'projects', 'contact'];
      
      const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -35% 0px',
        threshold: 0.15
      };

      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const index = sectionIds.indexOf(id);
            if (index !== -1) {
              setShapeIndex(index);
            }
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);
      
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [devMode, shapes]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle screen resize
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      stateRef.current.width = w;
      stateRef.current.height = h;

      // Generate initial particles if empty, or update targets
      const targets = getShapeTargets(stateRef.current.currentShape, particleCount, w, h);
      if (stateRef.current.particles.length === 0) {
        stateRef.current.particles = Array.from({ length: particleCount }).map((_, i) => {
          const target = targets[i] || { x: 0, y: 0, z: 0 };
          // Random starting coordinates for a nice fly-in splash effect
          return {
            x: (Math.random() - 0.5) * w * 2,
            y: (Math.random() - 0.5) * h * 2,
            z: (Math.random() - 0.5) * 300,
            tx: target.x,
            ty: target.y,
            tz: target.z,
            baseTx: target.x,
            baseTy: target.y,
            baseTz: target.z,
            size: Math.random() * 2 + 1.2,
            alpha: Math.random() * 0.5 + 0.35,
            colorGroup: Math.random() < 0.28 ? 'gold' : (Math.random() < 0.6 ? 'accent' : 'primary'),
            hue: Math.floor(Math.random() * 360) // Random hue for confetti mode
          };
        });
      } else {
        // Adjust existing targets for new size
        stateRef.current.particles.forEach((p, i) => {
          if (targets[i]) {
            p.tx = targets[i].x;
            p.ty = targets[i].y;
            p.tz = targets[i].z;
            p.baseTx = targets[i].x;
            p.baseTy = targets[i].y;
            p.baseTz = targets[i].z;
          }
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse events
    const handleMouseMove = (e) => {
      stateRef.current.targetMouseX = e.clientX;
      stateRef.current.targetMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Window click listener to cycle morphing
    const handleWindowClick = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (
        tag === 'button' ||
        tag === 'a' ||
        tag === 'input' ||
        tag === 'textarea' ||
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.closest('.exitButton') // custom check
      ) {
        return;
      }
      setShapeIndex((prev) => (prev + 1) % shapes.length);
    };
    window.addEventListener('click', handleWindowClick);

    // Animation loop
    let animationFrameId;
    const fov = 400;

    const animate = (_time) => {
      const w = stateRef.current.width;
      const h = stateRef.current.height;
      const centerX = w / 2;
      const centerY = h / 2;

      // Soft trail background clear for a glowing movement trace
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.fillRect(0, 0, w, h);

      // Lerp mouse coordinates for smooth inertia
      stateRef.current.mouseX += (stateRef.current.targetMouseX - stateRef.current.mouseX) * 0.08;
      stateRef.current.mouseY += (stateRef.current.targetMouseY - stateRef.current.mouseY) * 0.08;

      const currentShapeName = stateRef.current.currentShape;
      const isMatrix = currentShapeName === 'MATRIX_RAIN';
      const isText = currentShapeName === 'SHANMATHI';
      const isConfetti = currentShapeName === 'CONFETTI';
      
      // Disable rotation for all shapes to keep them stable
      const cosY = 1;
      const sinY = 0;
      const cosX = 1;
      const sinX = 0;

      // Pass 1: Update particle physics, rotation & projection
      stateRef.current.particles.forEach((p) => {
        // Special animation behaviour for Matrix Rain columns
        if (isMatrix) {
          p.ty += 2.2;
          if (p.ty > h / 2) {
            p.ty = -h / 2;
            p.y = -h / 2;
          }
        }

        // Continuous drifting/floating movement in CONFETTI mode (no rotation, only floating/moving)
        if (isConfetti) {
          if (p.vx === undefined || p.vy === undefined || p.vz === undefined) {
            p.vx = (Math.random() - 0.5) * 0.65;
            p.vy = (Math.random() - 0.5) * 0.65;
            p.vz = (Math.random() - 0.5) * 0.15;
          }
          // Drift targets gently
          p.tx += p.vx;
          p.ty += p.vy;
          p.tz += p.vz;

          // Wrap-around boundaries for continuous drift across the full screen
          const limitX = w * 0.52;
          const limitY = h * 0.52;
          if (p.tx < -limitX) p.tx = limitX;
          if (p.tx > limitX) p.tx = -limitX;
          if (p.ty < -limitY) p.ty = limitY;
          if (p.ty > limitY) p.ty = -limitY;
        } else {
          p.vx = undefined;
          p.vy = undefined;
          p.vz = undefined;
        }

        // Swirling vortex physics when morphing shapes (far from target coordinates)
        const dxTarget = p.tx - p.x;
        const dyTarget = p.ty - p.y;
        const dzTarget = p.tz - p.z;
        const distTarget = Math.sqrt(dxTarget * dxTarget + dyTarget * dyTarget + dzTarget * dzTarget);

        if (distTarget > 12 && !isMatrix) {
          const swirlSpeed = 0.045 * (Math.min(distTarget, 220) / 220);
          const rx = p.x * Math.cos(swirlSpeed) - p.z * Math.sin(swirlSpeed);
          const rz = p.x * Math.sin(swirlSpeed) + p.z * Math.cos(swirlSpeed);
          p.x = rx;
          p.z = rz;
        }

        // Interpolate (ease) position towards targets
        p.x += (p.tx - p.x) * 0.065;
        p.y += (p.ty - p.y) * 0.065;
        p.z += (p.tz - p.z) * 0.065;

        // Apply 3D Rotations
        // Rotate Y axis
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;

        // Rotate X axis
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        // 3D Perspective Projection
        const scale = fov / (fov + z2);
        const screenX = x1 * scale + centerX;
        const screenY = y2 * scale + centerY;

        // Interactive mouse force (push away)
        const dx = screenX - stateRef.current.mouseX;
        const dy = screenY - stateRef.current.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130 && dist > 1) {
          const force = (130 - dist) / 130;
          p.x += (dx / dist) * force * 4.5;
          p.y += (dy / dist) * force * 4.5;
        }

        // Store calculated screen positions for the line connection pass
        p.screenX = screenX;
        p.screenY = screenY;
        p.projScale = scale;
        p.projAlpha = p.alpha * (scale * 0.6 + 0.4);
      });

      // Pass 2: Draw connecting constellation lines (optimized) - skip in CONFETTI mode
      if (!isConfetti) {
        ctx.strokeStyle = stateRef.current.devMode
          ? 'rgba(250, 204, 107, 0.035)'
          : 'rgba(224, 176, 255, 0.035)';
        ctx.lineWidth = 0.45;

        const len = stateRef.current.particles.length;
        for (let i = 0; i < len; i += 2) { // check every 2nd node to save CPU power
          const p1 = stateRef.current.particles[i];
          if (p1.screenX < 0 || p1.screenX > w || p1.screenY < 0 || p1.screenY > h) continue;

          let connections = 0;
          for (let j = i + 1; j < len; j++) {
            if (connections >= 2) break; // max 2 lines per checked node

            const p2 = stateRef.current.particles[j];
            if (p2.screenX < 0 || p2.screenX > w || p2.screenY < 0 || p2.screenY > h) continue;

            const dx = p1.screenX - p2.screenX;
            const dy = p1.screenY - p2.screenY;
            const distSq = dx * dx + dy * dy;

            const threshold = isText ? 625 : 2200; // ~25px threshold for text to keep letters sharp, 47px for normal 3D shapes
            if (distSq < threshold) {
              ctx.beginPath();
              ctx.moveTo(p1.screenX, p1.screenY);
              ctx.lineTo(p2.screenX, p2.screenY);
              ctx.stroke();
              connections++;
            }
          }
        }
      }

      // Pass 3: Draw particle nodes
      stateRef.current.particles.forEach((p) => {
        if (p.screenX < 0 || p.screenX > w || p.screenY < 0 || p.screenY > h) return;

        let color = '';
        const alpha = p.projAlpha;
        const isConfetti = stateRef.current.currentShape === 'CONFETTI';

        if (isConfetti) {
          // Multicolor confetti — each particle has its own random hue
          color = `hsla(${p.hue}, 85%, 65%, ${alpha * 0.55})`;
        } else if (stateRef.current.devMode) {
          if (p.colorGroup === 'gold') color = `rgba(250, 204, 107, ${alpha * 0.18})`;
          else if (p.colorGroup === 'accent') color = `rgba(184, 150, 11, ${alpha * 0.12})`;
          else color = `rgba(148, 0, 211, ${alpha * 0.18})`;
        } else {
          if (p.colorGroup === 'gold') color = `rgba(250, 204, 107, ${alpha * 0.14})`;
          else if (p.colorGroup === 'accent') color = `rgba(224, 176, 255, ${alpha * 0.16})`;
          else color = `rgba(255, 255, 255, ${alpha * 0.15})`;
        }

        // Confetti uses tiny dots (≤1px); other shapes use their normal depth-scaled size
        const dotRadius = isConfetti
          ? Math.max(0.3, p.size * 0.28)
          : Math.max(0.5, p.size * p.projScale);

        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleWindowClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shapes]);

  return (
    <div className={clsx(styles.backgroundContainer, devMode && styles.devMode)}>
      <div className={styles.overlay}></div>
      <canvas ref={canvasRef} className={styles.canvasBackground}></canvas>

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
            <div className={styles.gridLines}></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.blobs}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.blob3}></div>
      </div>
    </div>
  );
};

export default Background;
