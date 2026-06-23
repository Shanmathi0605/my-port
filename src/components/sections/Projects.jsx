import React, { useState } from "react";
import styles from "./Projects.module.css";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "../../assets/chair1.jpg";
import img2 from "../../assets/flowers.jpg";
import img3 from "../../assets/shofa.jpg";
import img4 from "../../assets/crm.jpg";
import img5 from "../../assets/shoes.jpg";
import img6 from "../../assets/placement_portal.png";

const galleryData = [
  { 
    img: img1, 
    title: "Modern Furniture", 
    category: "MERN E-Commerce", 
    filter: "react",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    description: "A sleek MERN stack e-commerce app with secure payment integrations, JWT authentication, and automated admin dashboards.",
    link: "https://e-commerce-elegant.netlify.app/" 
  },
  { 
    img: img2, 
    title: "Floral Boutique", 
    category: "Shopify Store", 
    filter: "react",
    tags: ["React", "Shopify API", "CSS Modules", "Netlify"],
    description: "High-conversion custom storefront built for floral ordering, featuring automated local delivery schedules and carts.",
    link: "https://flowerproject-store.netlify.app/" 
  },
  { 
    img: img3, 
    title: "Addine Decor", 
    category: "Interior Design", 
    filter: "react",
    tags: ["React", "Framer Motion", "CSS Modules", "Vite"],
    description: "Premium interior design showcase leveraging React and smooth scroll animations for a clean, editorial look.",
    link: "https://addina-project.netlify.app/" 
  },
  { 
    img: img4, 
    title: "NextGen CRM", 
    category: "Full-Stack SaaS", 
    filter: "react",
    tags: ["React", "Chart.js", "Express", "Node.js", "MongoDB"],
    description: "Enterprise dashboard for client relations featuring analytics widgets, team action logs, and modern UX design.",
    link: "https://management-crm.netlify.app/" 
  },
  { 
    img: img5, 
    title: "Elite Kicks", 
    category: "Shoe Store", 
    filter: "react",
    tags: ["React", "Framer Motion", "Redux", "CSS Variables"],
    description: "High-performance online sneaker store featuring animated transitions, dynamic multi-attribute filters, and custom cart states.",
    link: "https://shoes-task.netlify.app/" 
  },
  { 
    img: img6, 
    title: "Placement Portal", 
    category: "MERN Full-Stack / Backend", 
    filter: "mern",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    description: "Robust student placement system featuring secure JWT authentication, student profile creation, department/batch segmentation, and a dashboard for managing applications.",
    link: "https://school-system-ashen-alpha.vercel.app/" 
  },
];

const filters = ["all", "react", "mern", "e-commerce"];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = activeFilter === "all"
    ? galleryData
    : galleryData.filter(p => p.filter === activeFilter);

  const handleFilterClick = (f) => {
    setActiveFilter(f);
    setActiveIndex(0);
  };

  return (
    <section className={styles.gallerySection} id="projects">
      {/* Background Decor */}
      <div className={styles.sectionHeading}>
        <span className={styles.number}>04</span>
        <h2 className={styles.verticalText}>PROJECTS</h2>
      </div>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          className={styles.header}
        >
          <h2 className="gradient-text">Recent Work</h2>
          <p className={styles.subtitle}>A collection of projects built with precision and passion</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className={styles.filterRow}>
          {filters.map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.activeFilter : ""}`}
              onClick={() => handleFilterClick(f)}
            >
              {f === "all" ? "All" : f === "react" ? "React Project" : f === "mern" ? "MERN Full Stack" : "E-Commerce"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className={styles.accordionContainer}
          >
            {filtered.map((project, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={project.title}
                  className={`${styles.panel} ${isActive ? styles.activePanel : ""}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className={styles.panelImageContainer}>
                    <img src={project.img} alt={project.title} className={styles.panelImage} />
                    <div className={styles.panelOverlay} />
                  </div>

                  {/* Collapsed Vertical Title */}
                  <div className={styles.collapsedHeader}>
                    <span className={styles.collapsedNumber}>0{index + 1}</span>
                    <h3 className={styles.collapsedTitle}>{project.title}</h3>
                  </div>

                  {/* Expanded Glassmorphic Content Card */}
                  <div className={styles.expandedContent}>
                    <div className={styles.expandedInner}>
                      <div className={styles.expandedHeader}>
                        <span className={styles.indexBadge}>0{index + 1}</span>
                        <span className={styles.categoryBadge}>{project.category}</span>
                      </div>
                      
                      <h3 className={styles.title}>{project.title}</h3>
                      
                      {project.tags && (
                        <div className={styles.tagList}>
                          {project.tags.map(tag => (
                            <span key={tag} className={styles.tagBadge}>{tag}</span>
                          ))}
                        </div>
                      )}
                      
                      <p className={styles.description}>{project.description}</p>
                      
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.viewLink}
                      >
                        <span>Visit Site</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;
