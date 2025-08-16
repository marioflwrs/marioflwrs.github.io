
import React, { useRef, useState, useEffect, useContext } from 'react';
import { OverlayContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CryptoDashboard from './CryptoDashboard';

const projects = [
  {
    title: 'digiscope',
    desc: 'A responsive dashboard for tracking real-time crypto asset data and related market news. Built with React, TypeScript, and Framer Motion.',
    link: 'https://github.com/marioflwrs/portfolio',
  },
  {
    title: 'Cool App',
    desc: 'A fun project using Framer Motion.',
    link: 'https://github.com/marioflwrs/cool-app',
  },
  {
    title: 'Open Source',
    desc: 'Contributions to the community.',
    link: 'https://github.com/marioflwrs',
  },
];

// ...existing code...
const ProjectsSection: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [dotSpin, setDotSpin] = useState<'spin-right' | 'spin-left' | ''>('');
  const [showOverlay, setShowOverlay] = useState(false);
  const { setOverlayActive } = useContext(OverlayContext);
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });

  const goTo = (idx: number) => {
    const direction = idx > active ? 'spin-right' : 'spin-left';
    setDotSpin(direction);
    setActive((idx + projects.length) % projects.length);
    setTimeout(() => setDotSpin(''), 300);
  };

  const handleViewProject = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCirclePos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setShowOverlay(true);
    setOverlayActive(true);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 700);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isMobile || !ref.current) return;
    let startX: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (startX === null) return;
      const deltaX = e.changedTouches[0].clientX - startX;
      if (deltaX < -50) goTo(active + 1);
      else if (deltaX > 50) goTo(active - 1);
      startX = null;
    };
    const node = ref.current;
    node.addEventListener('touchstart', handleTouchStart);
    node.addEventListener('touchend', handleTouchEnd);
    return () => {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, active]);

  // When overlay closes, reset overlayActive
  useEffect(() => {
    if (!showOverlay) setOverlayActive(false);
  }, [showOverlay, setOverlayActive]);

  return (
    <section ref={ref} id="projects" className="projects-section">
      <h2 className="projects-title">Projects</h2>
      <div className="projects-carousel">
        {!isMobile && (
          <button className="carousel-arrow left" onClick={() => goTo(active - 1)} aria-label="Previous project">
            <FaChevronLeft />
          </button>
        )}
        <motion.div
          key={active}
          initial={{ x: 80, opacity: 0, scale: 0.95 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -80, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, type: 'spring' }}
          whileHover={{ scale: 1.04 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) goTo(active + 1);
            else if (info.offset.x > 50) goTo(active - 1);
          }}
          className={active === 0 ? 'project-card active' : 'project-card'}
        >
          <>
            <h3 className="project-title">{projects[active].title}</h3>
            <p className="project-desc">{projects[active].desc}</p>
            {projects[active].title === 'digiscope' ? (
              <button
                className="project-link"
                onClick={handleViewProject}
                style={{ position: 'relative', zIndex: 2 }}
              >
                View Project
              </button>
            ) : (
              <a
                href={projects[active].link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                View Project
              </a>
            )}
          </>
        </motion.div>
        {!isMobile && (
          <button className="carousel-arrow right" onClick={() => goTo(active + 1)} aria-label="Next project">
            <FaChevronRight />
          </button>
        )}
      </div>
      <div className="carousel-dots">
        {projects.map((_, i) => (
          <span
            key={i}
            onClick={() => goTo(i)}
            className={
              'carousel-dot' +
              (i === active ? ' active' : '') +
              (i === active && dotSpin ? ` ${dotSpin}` : '')
            }
          ></span>
        ))}
      </div>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="fullscreen-overlay"
            initial={{
              clipPath: `circle(0px at ${circlePos.x}px ${circlePos.y}px)`,
              background: 'rgba(30,30,30,0.95)',
            }}
            animate={{
              clipPath: `circle(150vw at ${circlePos.x}px ${circlePos.y}px)`,
              background: 'rgba(30,30,30,0.98)',
              transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
            }}
            exit={{
              clipPath: `circle(0px at ${circlePos.x}px ${circlePos.y}px)`,
              background: 'rgba(30,30,30,0.95)',
              transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CryptoDashboard />
            <button
              className="close-overlay-btn"
              onClick={() => setShowOverlay(false)}
              aria-label="Close"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;