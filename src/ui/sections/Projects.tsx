import { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../../content/projects';

export default function Projects() {
  const [focused, setFocused] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState(0);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const listRef = useRef<HTMLUListElement>(null);

  // The 3D layer dispatches `skylands:project` when an islet is clicked. Highlight the
  // matching card and bring it into view.
  useEffect(() => {
    const onProject = (event: Event): void => {
      const index = (event as CustomEvent<number>).detail;
      if (index < 0 || index >= PROJECTS.length) return;
      setFocused(index);
      setActiveCard(index);
      cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    };
    window.addEventListener('skylands:project', onProject);
    return () => window.removeEventListener('skylands:project', onProject);
  }, []);

  // Track horizontal scroll position to update pagination dots.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const onListScroll = (): void => {
      const firstCard = list.firstElementChild as HTMLElement | null;
      const cardWidth = firstCard?.offsetWidth ?? 0;
      if (cardWidth === 0) return;
      const index = Math.round(list.scrollLeft / cardWidth);
      setActiveCard(Math.min(index, PROJECTS.length - 1));
    };

    list.addEventListener('scroll', onListScroll, { passive: true });
    return () => list.removeEventListener('scroll', onListScroll);
  }, []);

  // Navigate to previous or next project
  const handlePrevious = (): void => {
    const newIndex = Math.max(activeCard - 1, 0);
    setActiveCard(newIndex);
    cardRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const handleNext = (): void => {
    const newIndex = Math.min(activeCard + 1, PROJECTS.length - 1);
    setActiveCard(newIndex);
    cardRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  return (
    <section id="projects" className="section section--right" aria-labelledby="projects-title">
      <div className="panel panel--wide">
        <p className="eyebrow">Projects</p>
        <h2 id="projects-title" className="heading">
          An archipelago of work
        </h2>
        <div className="carousel-nav carousel-nav--top" aria-hidden="true">
          <button
            className="carousel-btn carousel-btn--prev"
            onClick={handlePrevious}
            disabled={activeCard === 0}
            aria-label="Previous project"
          >
            ← Previous
          </button>
          <button
            className="carousel-btn carousel-btn--next"
            onClick={handleNext}
            disabled={activeCard === PROJECTS.length - 1}
            aria-label="Next project"
          >
            Next →
          </button>
        </div>
        <ul ref={listRef} className="project-list">
          {PROJECTS.map((project, i) => (
            <li
              key={project.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`project-card${focused === i ? ' is-focused' : ''}`}
            >
              <h3 className="project-title">{project.title}</h3>
              <p className="project-blurb">{project.blurb}</p>
              <ul className="tag-row" aria-label="Technologies">
                {project.tags.map((tag) => (
                  <li key={tag} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>
              {project.href && (
                <a className="project-link" href={project.href}>
                  View project<span aria-hidden="true"> →</span>
                </a>
              )}
            </li>
          ))}
        </ul>
        <div className="carousel-nav carousel-nav--bottom" aria-hidden="true">
          <button
            className="carousel-btn carousel-btn--prev"
            onClick={handlePrevious}
            disabled={activeCard === 0}
            aria-label="Previous project"
          >
            ← Previous
          </button>
          <button
            className="carousel-btn carousel-btn--next"
            onClick={handleNext}
            disabled={activeCard === PROJECTS.length - 1}
            aria-label="Next project"
          >
            Next →
          </button>
        </div>
        <div className="carousel-dots" aria-hidden="true">
          {PROJECTS.map((_, i) => (
            <span key={i} className={`carousel-dot${activeCard === i ? ' is-active' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
