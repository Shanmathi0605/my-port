import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import styles from './Contact.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Terminal, Sliders } from 'lucide-react';
import { clsx } from 'clsx';

const Contact = () => {
  const formRef = useRef(null);
  const [activeContactMode, setActiveContactMode] = useState('ui'); // 'ui' | 'api'
  
  // API console input states
  const [apiName, setApiName] = useState('');
  const [apiEmail, setApiEmail] = useState('');
  const [apiMessage, setApiMessage] = useState('');
  
  // API response panel states
  const [apiStatus, setApiStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [apiResponse, setApiResponse] = useState('// API response payload will appear here after request execution');

  const sendEmail = (e) => {
    e.preventDefault();

    if (activeContactMode === 'api') {
      if (apiStatus === 'loading') return;
      setApiStatus('loading');
      setApiResponse('> Establishing secure TLS connection to api.shanmathi.dev...\n> Resolving DNS hosts...');

      setTimeout(() => {
        setApiResponse(prev => prev + '\n> Dispatching HTTP POST /v1/messages...');
      }, 500);

      setTimeout(() => {
        setApiResponse(prev => prev + '\n> Authenticating request with local credentials...');
      }, 1000);

      setTimeout(() => {
        emailjs.sendForm(
          'service_7pm66nn',
          'template_kf83m5u',
          formRef.current,
          { publicKey: 'TFYCoxnoh3Oi4SMYl' }
        )
          .then(() => {
            setApiStatus('success');
            const responseObj = {
              status: 201,
              statusText: "Created",
              success: true,
              data: {
                messageId: `msg_${Math.random().toString(36).substring(2, 11)}`,
                timestamp: new Date().toISOString(),
                recipient: "Shanmathi R B",
                delivered: true
              }
            };
            setApiResponse(prev => prev + `\n\nHTTP/1.1 201 Created\nContent-Type: application/json\n\n${JSON.stringify(responseObj, null, 2)}\n\n$ _`);
            setApiName('');
            setApiEmail('');
            setApiMessage('');
          }, (err) => {
            console.error('EmailJS Error:', err);
            setApiStatus('error');
            setApiResponse(prev => prev + `\n\nHTTP/1.1 500 Internal Server Error\nError: ${err.text || err.message || 'Mail delivery failure'}\n\n$ _`);
          });
      }, 1500);

    } else {
      emailjs.sendForm(
        'service_7pm66nn',
        'template_kf83m5u',
        e.target,
        { publicKey: 'TFYCoxnoh3Oi4SMYl' }
      )
        .then(() => {
          alert("Message Sent Successfully ✅");
          e.target.reset();
        }, (err) => {
          console.error('EmailJS Error:', err);
          alert(`Failed to send ❌\nReason: ${err.text || err.message || 'Unknown error'}`);
        });
    }
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.sectionHeading}>
        <span className={styles.number}>05</span>
        <h2 className={styles.verticalText}>CONTACT</h2>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className={styles.title}
          >
            Get In <span className="text-gradient">Touch.</span>
          </motion.h2>
          <p className={styles.subtitle}>Have a project in mind or just want to say hello? Let's connect.</p>
        </div>

        <div className={styles.grid}>
          <motion.div
            className={styles.infoWrapper}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.infoItem}>
              <div className={styles.iconBox}><Mail size={24} /></div>
              <div className={styles.infoText}>
                <h4>Email</h4>
                <p>smily.shanvi6597@gmail.com</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.iconBox}><MapPin size={24} /></div>
              <div className={styles.infoText}>
                <h4>Location</h4>
                <p>Peravurani, Tamil Nadu, India</p>
              </div>
            </div>

            <div className={styles.socialGroup}>
              <a href="https://github.com/Shanmathi0605" target="_blank" rel="noreferrer" className={styles.socialLink}><Github size={24} /></a>
              <a href="https://linkedin.com/in/shanmathi-r-b-722a462a7" target="_blank" rel="noreferrer" className={styles.socialLink}><Linkedin size={24} /></a>
            </div>
          </motion.div>

          <motion.div
            className={styles.formOuterContainer}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <form
              className={styles.formWrapper}
              ref={formRef} 
              onSubmit={sendEmail}
            >
              {/* Tab Header Selector */}
              <div className={styles.tabSelector}>
                <button
                  type="button"
                  className={clsx(styles.tabBtn, activeContactMode === 'ui' && styles.activeTabBtn)}
                  onClick={() => setActiveContactMode('ui')}
                >
                  <Sliders size={14} /> Standard Form
                </button>
                <button
                  type="button"
                  className={clsx(styles.tabBtn, activeContactMode === 'api' && styles.activeTabBtn)}
                  onClick={() => setActiveContactMode('api')}
                >
                  <Terminal size={14} /> API Request Client
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeContactMode === 'ui' ? (
                  <motion.div
                    key="ui-contact-mode"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={styles.modeContainer}
                  >
                    <div className={styles.inputGroup}>
                      <label htmlFor="name">Full Name</label>
                      <input type="text" name="from_name" placeholder="John Doe" required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="email">Email Address</label>
                      <input type="email" name="from_email" placeholder="john@example.com" required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="message">Your Message</label>
                      <textarea name="message" placeholder="Your message..." required></textarea>
                    </div>

                    <motion.button
                      type="submit"
                      className={styles.submitBtn}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send Message <Send size={20} />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="api-contact-mode"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={styles.modeContainer}
                  >
                    <div className={styles.apiEndpointRow}>
                      <span className={styles.apiMethod}>POST</span>
                      <span className={styles.apiUrl}>https://api.shanmathi.dev/v1/messages</span>
                    </div>

                    <div className={styles.apiHeadersBox}>
                      <span className={styles.apiSubLabel}>Request Headers:</span>
                      <div className={styles.apiHeaderItem}>
                        <span className={styles.apiHeaderKey}>Content-Type:</span>
                        <span className={styles.apiHeaderVal}>application/json</span>
                      </div>
                      <div className={styles.apiHeaderItem}>
                        <span className={styles.apiHeaderKey}>Authorization:</span>
                        <span className={styles.apiHeaderVal}>Bearer token_shanmathi_prod_7719</span>
                      </div>
                    </div>

                    <span className={styles.apiSubLabel}>Request Body (JSON):</span>
                    <div className={styles.apiJsonFields}>
                      <div className={styles.jsonFieldRow}>
                        <span className={styles.jsonKey}>"from_name":</span>
                        <input 
                          type="text" 
                          name="from_name" 
                          placeholder="John Doe" 
                          value={apiName}
                          onChange={(e) => setApiName(e.target.value)}
                          className={styles.apiJsonInput}
                          required 
                        />
                      </div>
                      <div className={styles.jsonFieldRow}>
                        <span className={styles.jsonKey}>"from_email":</span>
                        <input 
                          type="email" 
                          name="from_email" 
                          placeholder="john@example.com" 
                          value={apiEmail}
                          onChange={(e) => setApiEmail(e.target.value)}
                          className={styles.apiJsonInput}
                          required 
                        />
                      </div>
                      <div className={styles.jsonFieldRow}>
                        <span className={styles.jsonKey}>"message":</span>
                        <textarea 
                          name="message" 
                          placeholder="Type message here..." 
                          value={apiMessage}
                          onChange={(e) => setApiMessage(e.target.value)}
                          className={styles.apiJsonTextarea}
                          required 
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      className={styles.apiSubmitBtn}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={apiStatus === 'loading'}
                    >
                      {apiStatus === 'loading' ? 'Executing API Call...' : 'Send API Payload'} <Send size={16} />
                    </motion.button>

                    <div className={styles.apiResponseWrapper}>
                      <div className={styles.responseBar}>
                        <span>Console Output</span>
                        {apiStatus === 'success' && <span className={styles.responseStatusBadge}>201 Created</span>}
                        {apiStatus === 'error' && <span className={clsx(styles.responseStatusBadge, styles.badgeErr)}>500 Error</span>}
                      </div>
                      <pre className={styles.apiConsoleLogs}>
                        <code>{apiResponse}</code>
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>

      <div className={styles.englishBack}>CONNECT</div>
    </section>
  );
};

export default Contact;
