import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Experience.module.css';
import { Briefcase, GraduationCap, Code2, Award } from 'lucide-react';

const experienceData = [
  {
    type: 'work',
    title: 'Full Stack Developer',
    company: 'Freelance',
    period: '2024 – Present',
    location: 'Remote',
    description: 'Developed and deployed full-stack web applications for clients across e-commerce, CRM, and interior design domains. Built MERN stack solutions with JWT auth, payment integrations, and responsive UIs.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express', 'Netlify'],
    icon: <Code2 size={18} />,
  },
  {
    type: 'work',
    title: 'Web Developer Intern',
    company: 'Tech Startup',
    period: '2023 – 2024',
    location: 'Tamil Nadu, India',
    description: 'Worked on frontend development using React and contributed to backend REST APIs with Node.js. Gained hands-on experience with database design, Docker containers, and agile workflows.',
    tags: ['React', 'Node.js', 'Docker', 'REST APIs', 'PostgreSQL'],
    icon: <Briefcase size={18} />,
  },
  {
    type: 'education',
    title: 'B.Tech – Computer Science',
    company: 'Anna University',
    period: '2021 – 2025',
    location: 'Tamil Nadu, India',
    description: 'Studied core CS fundamentals including data structures, algorithms, operating systems, and software engineering. Built multiple full-stack projects and participated in technical events and hackathons.',
    tags: ['DSA', 'DBMS', 'OS', 'Software Engineering', 'Java'],
    icon: <GraduationCap size={18} />,
  },
  {
    type: 'achievement',
    title: 'Open Source Contributor',
    company: 'GitHub Community',
    period: '2023 – Present',
    location: 'Global',
    description: 'Contributed to open source repositories with bug fixes and feature additions. Maintained personal repositories with 5+ live production projects deployed on Netlify.',
    tags: ['Open Source', 'GitHub', 'Netlify', 'CI/CD'],
    icon: <Award size={18} />,
  },
];

const typeColors = {
  work: 'var(--primary)',
  education: '#3b82f6',
  achievement: '#10b981',
};

const Experience = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['all', 'work', 'education', 'achievement'];

  const filtered = activeFilter === 'all'
    ? experienceData
    : experienceData.filter(e => e.type === activeFilter);

  return (
    <section className={styles.section} id="experience">
      <div className={styles.sectionHeading}>
        <span className={styles.number}>03</span>
        <h2 className={styles.verticalText}>EXPERIENCE</h2>
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
        >
          <h2 className="gradient-text">My Journey</h2>
          <p className={styles.subtitle}>A timeline of work, education & achievements</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className={styles.filterRow}>
          {filters.map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.activeFilter : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className={styles.timeline}>
          {filtered.map((item, index) => (
            <motion.div
              key={index}
              className={styles.timelineItem}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.12, duration: 0.6, ease: 'easeOut' }}
            >
              <div className={styles.timelineConnector}>
                <div
                  className={styles.dot}
                  style={{ background: typeColors[item.type] }}
                >
                  {item.icon}
                </div>
                <div className={styles.line} />
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <span
                      className={styles.typeBadge}
                      style={{ color: typeColors[item.type], borderColor: typeColors[item.type] }}
                    >
                      {item.type}
                    </span>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.company}>{item.company} · {item.location}</p>
                  </div>
                  <span className={styles.period}>{item.period}</span>
                </div>
                <p className={styles.description}>{item.description}</p>
                <div className={styles.tags}>
                  {item.tags.map((tag, i) => (
                    <span key={i} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
