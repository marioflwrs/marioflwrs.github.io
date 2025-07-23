import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const projects = [
  {
    title: 'Portfolio',
    desc: 'Personal site built with React + Vite.',
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

const ProjectsSection: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [dotSpin, setDotSpin] = useState<'spin-right' | 'spin-left' | ''>('');

  const goTo = (idx: number) => {
    const direction = idx > active ? 'spin-right' : 'spin-left';
    setDotSpin(direction);
    setActive((idx + projects.length) % projects.length);
    setTimeout(() => setDotSpin(''), 300); // Remove spin class after animation
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 700);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Swipe handling for mobile
  useEffect(() => {
    if (!isMobile || !ref.current) return;
    let startX: number | null = null;
    // Use the global TouchEvent type (no import needed)
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
          <h3>{projects[active].title}</h3>
          <p>{projects[active].desc}</p>
          <a href={projects[active].link} target="_blank" rel="noopener noreferrer" className="project-link">
            View Project
          </a>
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
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
