import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Cpu, Briefcase, Mail, FileDown, Github } from 'lucide-react';
import { clsx } from 'clsx';

const navLinks = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: User },
  { name: 'Skills', href: '#skills', icon: Cpu },
  { name: 'Projects', href: '#projects', icon: Briefcase },
  { name: 'Contact', href: '#contact', icon: Mail },
];

const Navbar = ({ devMode, toggleDevMode }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [hoveredLink, setHoveredLink] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor scroll for active section
  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'projects', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -45% 0px', // check when section covers center area
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveSection(id);
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
  }, []);

  useEffect(() => {
    if (devMode) {
      document.body.classList.add('dev-mode-active');
    } else {
      document.body.classList.remove('dev-mode-active');
    }
  }, [devMode]);

  return (
    <>
      {/* Branding Logo anchored at Top-Left */}
      <a href="#home" className={styles.logoAnchor}>
        {!devMode && <span className={styles.logoText}>Shanmathi.</span>}
      </a>

      {/* Utilities Container anchored at Top-Right */}
      {!devMode && (
        <div className={clsx(styles.utilitiesContainer, scrolled && styles.scrolledUtils)}>
          <a href="/Shan.pdf.pdf" download className={styles.resumeBtn} title="Download Resume" target="_blank" rel="noreferrer">
            <FileDown size={14} /> <span>RESUME</span>
          </a>
          <button 
            className={clsx(styles.devToggle, devMode && styles.devToggleActive)} 
            onClick={toggleDevMode}
            title="Developer Mode"
          >
            DEV ON
          </button>
          <a href="https://github.com/Shanmathi0605" target="_blank" rel="noreferrer" className={styles.socialIcon}>
            <Github size={18} />
          </a>
        </div>
      )}

      {/* Sleek Bottom capsule Dock (Unified Desktop & Mobile view) */}
      {!devMode && (
        <div className={styles.bottomDock}>
          <ul className={styles.dockLinks}>
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = activeSection === link.href.slice(1);
              const isHovered = hoveredLink === link.name;
              
              return (
                <li 
                  key={link.name}
                  className={styles.dockItem}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {/* Tooltip popping up above the icon */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className={styles.tooltip}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                      >
                        <span className={styles.tooltipText}>{link.name}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <a href={link.href} className={clsx(styles.dockLink, isActive && styles.activeLink)}>
                    <IconComponent size={20} className={styles.dockIcon} />
                    {/* Glowing active indicator dot centered underneath icon */}
                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        className={styles.activeDot}
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
