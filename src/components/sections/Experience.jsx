import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Experience.module.css';
import { Briefcase, GraduationCap, Code2, Award } from 'lucide-react';

const experienceData = [
  {
    type: 'work',
    title: 'Full Stack Developer',
    company: 'Freelance',
    period: 'May 2026-Present',
    location: 'Remote',
    description: 'A Full Stack Developer designs and develops complete web applications by working on both the front-end and back-end. They use technologies like React.js, Node.js, Express.js, MongoDB, and REST APIs to build scalable, secure, and high-performance applications while managing databases, authentication, and deployment.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express', 'Netlify'],
    icon: <Code2 size={18} />,
  },
  {
    type: 'work',
    title: 'Front-End Developer Intern',
    company: 'Softnova Technology',
    period: '2025 – Present',
    location: 'Tamil Nadu, India',
    description: 'A Front-End Developer builds responsive, interactive, and user-friendly web interfaces using modern technologies such as HTML, CSS, JavaScript, React.js, and Bootstrap. They focus on creating visually appealing designs, optimizing performance, and ensuring seamless user experiences across different devices and browsers.',
    tags: ['React', 'Node.js', 'Docker', 'REST APIs', 'PostgreSQL'],
    icon: <Briefcase size={18} />,
  },
  {
    type: 'education',
    title: 'BSC – Computer Science',
    company: 'Bharathidasan University',
    period: '2022 – 2025',
    location: 'Tamil Nadu, India',
    description: 'Completed a comprehensive undergraduate program covering programming, database management, software development, web technologies, data structures, algorithms, networking, and computer systems. Developed strong analytical, problem-solving, and technical skills through academic projects and practical learning.',
    tags: ['DSA', 'DBMS', 'OS', 'Java', 'Algorithm'],
    icon: <GraduationCap size={18} />,
  },

];

const typeColors = {
  work: 'var(--primary)',
  education: '#3b82f6',
};

const Experience = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['all', 'work', 'education', ];

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
