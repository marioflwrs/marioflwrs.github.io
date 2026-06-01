import { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../../content/projects';

export default function Projects() {
  const [focused, setFocused] = useState<number | null>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);

  // The 3D layer dispatches `skylands:project` when an islet is clicked. Highlight the
  // matching card and bring it into view.
  useEffect(() => {
    const onProject = (event: Event): void => {
      const index = (event as CustomEvent<number>).detail;
      if (index < 0 || index >= PROJECTS.length) return;
      setFocused(index);
      cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    window.addEventListener('skylands:project', onProject);
    return () => window.removeEventListener('skylands:project', onProject);
  }, []);

  return (
    <section id="projects" className="section section--right" aria-labelledby="projects-title">
      <div className="panel panel--wide">
        <p className="eyebrow">Projects</p>
        <h2 id="projects-title" className="heading">
          An archipelago of work
        </h2>
        <ul className="project-list">
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
      </div>
    </section>
  );
}
