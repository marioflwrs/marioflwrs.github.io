import { useEffect, useRef, useState } from 'react';
import { SECTIONS } from '../experience/config/sections';
import type { ScrollController } from '../experience/systems/ScrollController';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import './overlay.css';

interface OverlayProps {
  controller: ScrollController;
}

// The scrollable DOM content above the fixed canvas. It tracks its own active section
// and reveals panels via IntersectionObserver, so it stays readable even without WebGL.
// The shared ScrollController only handles jump-to-section for the nav dots.
export default function Overlay({ controller }: OverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sectionEls = Array.from(root.querySelectorAll<HTMLElement>('.section'));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (entry.intersectionRatio >= 0.5) {
              const index = sectionEls.indexOf(entry.target as HTMLElement);
              if (index !== -1) setActive(index);
            }
          }
        }
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    for (const el of sectionEls) observer.observe(el);

    // Slim progress bar — write scaleX directly to avoid re-rendering on every scroll.
    const onScroll = (): void => {
      const range = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(window.scrollY / range, 1);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Keep the URL hash in sync with the active section for deep-linking/sharing.
  useEffect(() => {
    const id = SECTIONS[active]?.id;
    if (id && window.location.hash !== `#${id}`) {
      window.history.replaceState(null, '', `#${id}`);
    }
  }, [active]);

  return (
    <>
      <div className="progress-track" aria-hidden="true">
        <div ref={progressRef} className="progress-bar" />
      </div>

      <a className="skip-link" href="#about">
        Skip to content
      </a>

      <nav className="dot-nav" aria-label="Sections">
        <ul>
          {SECTIONS.map((section, i) => (
            <li key={section.id}>
              <button
                type="button"
                className={`dot${active === i ? ' is-active' : ''}`}
                aria-current={active === i ? 'true' : undefined}
                aria-label={`Go to ${section.label}`}
                onClick={() => controller.goTo(i)}
              >
                <span className="dot-label" aria-hidden="true">
                  {section.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main ref={rootRef} className="overlay">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
