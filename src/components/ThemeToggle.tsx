import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaSun, FaMoon, FaCloud } from 'react-icons/fa';

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, setDarkMode }) => {
  return (
    <button
      className="theme-toggle"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setDarkMode(!darkMode)}
      style={{
        position: 'absolute',
        top: 18,
        right: 24,
        zIndex: 100,
        background: 'none',
        border: 'none',
        fontSize: 32,
        cursor: 'pointer',
        color: darkMode ? '#FFD600' : '#222',
        transition: 'color 0.2s',
        overflow: 'hidden',
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.span
            key="moon"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', width: '100%' }}
          >
            <span style={{ position: 'relative', display: 'inline-block', width: 44, height: 34 }}>
              {/* Purple sky */}
              <span style={{
                position: 'absolute',
                left: 0, top: 0,
                width: 44, height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6a4cff 60%, #b47cff 100%)',
                zIndex: 1,
              }} />
              {/* Grey clouds with animation */}
              <motion.span
                style={{ position: 'absolute', left: 9, top: 2, zIndex: 4 }}
                animate={{ x: [0, 3, -2, 0], y: [0, -1, 0, 1, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaCloud style={{ fontSize: 18, color: '#bbb', opacity: 1 }} />
              </motion.span>
              <motion.span
                style={{ position: 'absolute', left: 19, top: -12, zIndex: 2 }}
                animate={{ x: [0, -2, 2, 0], y: [0, 1, 0, -1, 0] }}
                transition={{ duration: 3.7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaCloud style={{ fontSize: 14, color: '#888', opacity: 1 }} />
              </motion.span>
              {/* Moon */}
              <FaMoon style={{ position: 'absolute', left: 10, top: 8, fontSize: 24, color: '#FFD600', filter: 'drop-shadow(0 0 4px #FFD60088)', zIndex: 3 }} />
            </span>
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ x: -60, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', width: '100%' }}
          >
            <span style={{ position: 'relative', display: 'inline-block', width: 44, height: 34 }}>
              {/* Blue sky */}
              <span style={{
                position: 'absolute',
                left: 0, top: 0,
                width: 44, height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0422A8 0%, #58CFFB 100%)',
                zIndex: 1,
              }} />
              {/* White clouds with animation */}
              <motion.span
                style={{ position: 'absolute', left: 19, top: 5, zIndex: 3 }}
                animate={{ x: [0, 3, -2, 0], y: [0, -1, 0, 1, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaCloud style={{ fontSize: 18, color: '#fff', opacity: 0.9 }} />
              </motion.span>
              <motion.span
                style={{ position: 'absolute', left: 5, top: 3, zIndex: 3 }}
                animate={{ x: [0, -2, 2, 0], y: [0, 1, 0, -1, 0] }}
                transition={{ duration: 3.7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaCloud style={{ fontSize: 14, color: '#e0e0e0', opacity: 0.7 }} />
              </motion.span>
              {/* Sun */}
              <FaSun style={{ position: 'absolute', left: 10, top: 8, fontSize: 24, color: '#FFD600', filter: 'drop-shadow(0 0 4px #FFD60088)', zIndex: 2 }} />
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
