import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, FileDown, Terminal, Database, Code, Play, RefreshCw, Heart, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import MagneticButton from '../ui/MagneticButton';

const Hero = ({ devMode: _devMode }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Full Stack Developer | UI Designer";

  // Playground States
  const [activeTab, setActiveTab] = useState('react');
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    '$ curl -X GET https://api.shanmathi.dev/v1/projects',
    '// Click Run API to request projects list'
  ]);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const [dbDocuments, setDbDocuments] = useState([
    { id: 1, title: 'E-Commerce App', status: 'Active', tech: 'React, Node.js' },
    { id: 2, title: 'Furniture Store', status: 'Active', tech: 'MERN Stack' },
    { id: 3, title: 'Modern SaaS CRM', status: 'Pending', tech: 'Next.js, Mongo' }
  ]);

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, currentIdx + 1));
      currentIdx++;
      if (currentIdx >= fullText.length) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const renderTypedSubtitle = () => {
    const pipeIndex = typedText.indexOf('|');
    if (pipeIndex === -1) {
      return (
        <span className={styles.subtitlePart}>
          {typedText.slice(0, -1)}
          <span style={{ whiteSpace: 'nowrap' }}>
            {typedText.slice(-1)}
            <span className={styles.cursorMark}>|</span>
          </span>
        </span>
      );
    }

    const part1 = typedText.substring(0, pipeIndex).trim();
    const part2 = typedText.substring(pipeIndex + 1).trim();

    return (
      <>
        <span className={styles.subtitlePart}>{part1}</span>
        <span className={styles.subtitlePipe}> | </span>
        {part2 && (
          <span className={styles.subtitlePart}>
            {part2.slice(0, -1)}
            <span style={{ whiteSpace: 'nowrap' }}>
              {part2.slice(-1)}
              <span className={styles.cursorMark}>|</span>
            </span>
          </span>
        )}
        {!part2 && (
          <span className={styles.subtitlePart}>
            <span className={styles.cursorMark}>|</span>
          </span>
        )}
      </>
    );
  };

  // Terminal Runner Simulation
  const handleRunApi = () => {
    if (isApiLoading) return;
    setIsApiLoading(true);
    setTerminalLogs(prev => [
      ...prev,
      '> Initializing API connection...',
      '> Dispatching HTTP GET /api/v1/projects...'
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        '> Querying Cluster0 MongoDB Atlas...',
        '> Found 3 active project records...'
      ]);
    }, 600);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        '> HTTP/1.1 200 OK (38ms)',
        '> Response: [ {id:1, title:"E-Commerce"...}, {id:2...} ]',
        '$ _'
      ]);
      setIsApiLoading(false);
    }, 1200);
  };

  const handleClearTerminal = () => {
    setTerminalLogs([
      '$ curl -X GET https://api.shanmathi.dev/v1/projects',
      '// Click Run API to request projects list'
    ]);
  };

  // MongoDB Status Toggler
  const toggleStatus = (id) => {
    setDbDocuments(prev =>
      prev.map(doc =>
        doc.id === id
          ? { ...doc, status: doc.status === 'Active' ? 'Maintenance' : 'Active' }
          : doc
      )
    );
  };

  return (
    <section id="home" className={styles.heroSection}>
      <div className={styles.heroContent}>
        
        {/* Left Column: Developer Info & Intro */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroLeft}
        >
          <span className={styles.greeting}>HI, I'm</span>
          <h1 className={styles.heroTitle}>
            <span className={styles.nameHighlight}>Shanmathi</span>
          </h1>
          <p className={styles.heroSubtitle}>
            {renderTypedSubtitle()}
          </p>

          <p className={styles.heroBio}>
            I design and build scalable, secure, and modern full-stack web applications. 
            Specializing in Node.js, React, Express, and MongoDB to deliver high-performance 
            user experiences with clean architectures.
          </p>

          <div className={styles.ctaGroup}>
            <MagneticButton href="#projects" className={clsx(styles.ctaButton, styles.primaryCta)}>
              View Projects <ArrowRight size={20} className={styles.ctaIcon} />
            </MagneticButton>
            <MagneticButton href="#contact" className={clsx(styles.ctaButton, styles.secondaryCta)}>
              Hire Me
            </MagneticButton>
            <MagneticButton 
              href="/shanma.pdf" 
              className={clsx(styles.ctaButton, styles.outlineCta)}
              target="_blank"
              rel="noreferrer"
            >
              Resume <FileDown size={18} className={styles.ctaIcon} />
            </MagneticButton>
          </div>

          <div className={styles.statCards}>
            <div className={styles.statCard}>
              <h3>Ready</h3>
              <p>To Build</p>
            </div>
            <div className={styles.statCard}>
              <h3>5+</h3>
              <p>Projects</p>
            </div>
            <div className={styles.statCard}>
              <h3>Fast</h3>
              <p>Learner</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive Full-Stack Playground */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.heroRight}
        >
          <div className={styles.playgroundCard}>
            
            {/* Card Header (Mac-like Terminal bar) */}
            <div className={styles.cardHeader}>
              <div className={styles.windowControls}>
                <span className={clsx(styles.dot, styles.redDot)}></span>
                <span className={clsx(styles.dot, styles.yellowDot)}></span>
                <span className={clsx(styles.dot, styles.greenDot)}></span>
              </div>
              <span className={styles.windowTitle}>fullstack_playground.js</span>
            </div>

            {/* Code Tabs */}
            <div className={styles.playgroundTabs}>
              <button 
                className={clsx(styles.tabButton, activeTab === 'react' && styles.activeTab)}
                onClick={() => setActiveTab('react')}
              >
                <Code size={14} /> React
              </button>
              <button 
                className={clsx(styles.tabButton, activeTab === 'express' && styles.activeTab)}
                onClick={() => setActiveTab('express')}
              >
                <Layers size={14} /> Express
              </button>
              <button 
                className={clsx(styles.tabButton, activeTab === 'mongodb' && styles.activeTab)}
                onClick={() => setActiveTab('mongodb')}
              >
                <Database size={14} /> MongoDB
              </button>
            </div>

            {/* Code Editor Window */}
            <div className={styles.editorBody}>
              <div className={styles.editorLines}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className={styles.lineNumber}>{i + 1}</span>
                ))}
              </div>
              <div className={styles.editorCode}>
                <AnimatePresence mode="wait">
                  {activeTab === 'react' && (
                    <motion.div
                      key="react-code"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <pre>
                        <code>
                          <span className={styles.keyword}>import</span> React, &#123; useState &#125; <span className={styles.keyword}>from</span> <span className={styles.string}>'react'</span>;<br />
                          <br />
                          <span className={styles.keyword}>export default function</span> <span className={styles.func}>LikeButton</span>() &#123;<br />
                          &nbsp;&nbsp;<span className={styles.keyword}>const</span> [likes, setLikes] = useState(<span className={styles.number}>42</span>);<br />
                          &nbsp;&nbsp;<span className={styles.keyword}>return</span> (<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className={styles.tag}>button</span> <span className={styles.attr}>onClick</span>=&#123;() =&gt; setLikes(likes+<span className={styles.number}>1</span>)&#125;&gt;<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❤️ &#123;likes&#125; Likes<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className={styles.tag}>button</span>&gt;<br />
                          &nbsp;&nbsp;);<br />
                          &#125;
                        </code>
                      </pre>
                    </motion.div>
                  )}

                  {activeTab === 'express' && (
                    <motion.div
                      key="express-code"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <pre>
                        <code>
                          <span className={styles.keyword}>const</span> express = require(<span className={styles.string}>'express'</span>);<br />
                          <span className={styles.keyword}>const</span> app = express();<br />
                          <br />
                          app.get(<span className={styles.string}>'/api/projects'</span>, (req, res) =&gt; &#123;<br />
                          &nbsp;&nbsp;Project.find().then(projects =&gt; &#123;<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;res.json(&#123; success: <span className={styles.number}>true</span>, data: projects &#125;);<br />
                          &nbsp;&nbsp;&#125;);<br />
                          &#125;);<br />
                          app.listen(<span className={styles.number}>5000</span>);
                        </code>
                      </pre>
                    </motion.div>
                  )}

                  {activeTab === 'mongodb' && (
                    <motion.div
                      key="mongo-code"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <pre>
                        <code>
                          <span className={styles.keyword}>const</span> projectSchema = <span className={styles.keyword}>new</span> Schema(&#123;<br />
                          &nbsp;&nbsp;title: &#123; type: String, required: <span className={styles.number}>true</span> &#125;,<br />
                          &nbsp;&nbsp;status: &#123; type: String, default: <span className={styles.string}>'Active'</span> &#125;,<br />
                          &nbsp;&nbsp;techStack: [String]<br />
                          &#125;);<br />
                          <br />
                          <span className={styles.keyword}>const</span> Project = model(<span className={styles.string}>'Project'</span>, projectSchema);<br />
                          <span className={styles.keyword}>module.exports</span> = Project;
                        </code>
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Live Demo Preview Box */}
            <div className={styles.livePreviewBox}>
              <div className={styles.previewLabel}>LIVE PREVIEW / INTERACTIVE SIMULATOR</div>

              <div className={styles.previewContent}>
                {activeTab === 'react' && (
                  <div className={styles.reactDemo}>
                    <p className={styles.demoDesc}>Interact with the state of this live React Component:</p>
                    <motion.button 
                      onClick={() => {
                        setLikes(prev => isLiked ? prev - 1 : prev + 1);
                        setIsLiked(!isLiked);
                      }}
                      className={clsx(styles.likeBtn, isLiked && styles.likedBtn)}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                      <span>{isLiked ? 'Liked!' : 'Click to Like'} • {likes}</span>
                    </motion.button>
                  </div>
                )}

                {activeTab === 'express' && (
                  <div className={styles.expressDemo}>
                    <div className={styles.terminalHeader}>
                      <span className={styles.termTitle}>Developer Terminal</span>
                      <div className={styles.termActions}>
                        <button 
                          onClick={handleRunApi} 
                          disabled={isApiLoading}
                          className={styles.termActionBtn}
                        >
                          <Play size={12} /> {isApiLoading ? 'Running...' : 'Run API'}
                        </button>
                        <button 
                          onClick={handleClearTerminal}
                          className={styles.termActionBtn}
                        >
                          <RefreshCw size={12} /> Reset
                        </button>
                      </div>
                    </div>
                    <div className={styles.terminalLogs}>
                      {terminalLogs.map((log, idx) => (
                        <div key={idx} className={clsx(
                          styles.logLine, 
                          log.startsWith('$') && styles.logInput,
                          log.startsWith('>') && styles.logSystem,
                          log.includes('200 OK') && styles.logSuccess
                        )}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'mongodb' && (
                  <div className={styles.mongodbDemo}>
                    <p className={styles.demoDesc}>Click a collection document to toggle its state:</p>
                    <div className={styles.dbList}>
                      {dbDocuments.map(doc => (
                        <div 
                          key={doc.id} 
                          className={styles.dbRow}
                          onClick={() => toggleStatus(doc.id)}
                        >
                          <div className={styles.dbField}>
                            <span className={styles.dbLabel}>id:</span>
                            <span className={styles.dbVal}>{doc.id}</span>
                          </div>
                          <div className={styles.dbField}>
                            <span className={styles.dbLabel}>title:</span>
                            <span className={styles.dbVal}>"{doc.title}"</span>
                          </div>
                          <div className={styles.dbField}>
                            <span className={styles.dbLabel}>status:</span>
                            <span className={clsx(
                              styles.statusPill, 
                              doc.status === 'Active' ? styles.statusActive : styles.statusMaint
                            )}>
                              {doc.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>

      </div>

      <motion.a
        href="#about"
        className={styles.scrollDown}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={30} color="var(--text-dim)" />
      </motion.a>
    </section>
  );
};

export default Hero;

