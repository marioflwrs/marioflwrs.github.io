import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const mainLine = "Hi, I'm Mario Ballesteros";
const subLine = "Creative Web Developer";

const HeroSection: React.FC = () => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(mainLine.slice(0, i + 1));
      i++;
      if (i === mainLine.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 700);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section id="hero" className={isMobile ? 'hero mobile' : 'hero'}>
      <motion.img
        id="hero-avatar"
        src="/avatar.png"
        alt="Mario Ballesteros"
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={isMobile
          ? { opacity: 1, scale: 1, y: 0, x: 0 }
          : {
              scale: [0.4, 2.2, 0.6, 1.8, 0.5, 2.5, 0.4],
              opacity: 1,
              y: [0, -18, 0, 18, 0],
              x: [0, 12, 0, -12, 0],
            }
        }
        transition={isMobile
          ? { duration: 0.8, ease: 'easeOut' }
          : {
              scale: { duration: 10, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
              opacity: { duration: 0.8, ease: 'easeOut' },
              y: { duration: 8, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
              x: { duration: 10, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
            }
        }
        className={isMobile ? 'hero-avatar mobile' : 'hero-avatar'}
      />
      <div id="hero-text" className="hero-text">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className={isMobile ? 'hero-title mobile' : 'hero-title'}
        >
          {displayed}
          <span className="typewriter-cursor">|</span>
        </motion.h1>
        {done && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={isMobile ? 'hero-sub mobile' : 'hero-sub'}
          >
            {subLine}
          </motion.h2>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
