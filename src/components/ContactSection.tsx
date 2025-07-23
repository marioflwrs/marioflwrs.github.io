import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="contact-section">
      {/* Floating background elements */}
      <motion.div
        className="contact-float contact-float1"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
      />
      <motion.div
        className="contact-float contact-float2"
        animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
      />
      <div className="contact-content">
        <h2 className="contact-title">Contact</h2>
        <motion.a
          href="mailto:maballesteros@protonmail.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="contact-link"
        >
          Say Hello
        </motion.a>
        <div className="contact-icons">
          <a href="mailto:maballesteros@protonmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
            <FaEnvelope />
          </a>
          <a href="https://www.linkedin.com/in/mario-ballesteros/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
