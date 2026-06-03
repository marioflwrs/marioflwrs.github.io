export interface Project {
  title: string;
  blurb: string;
  tags: string[];
  href?: string;
}

// Order matches the project islets in the 3D archipelago (Islands.buildArchipelago),
// so a click on islet i focuses projects[i].
export const PROJECTS: Project[] = [
  {
    title: 'Cypherbreak',
    blurb:
      'A production SaaS event management platform orchestrating real-time bracket state machines and an interactive 3D WebGL dashboard. Built with security-first architecture. Rate limiting using sliding-window counters. Request-level CSP nonces. Input validation to prevent MIME sniff attacks.',
    tags: ['Full-Stack', 'Security', 'AI Agents', 'Systems Design'],
    href: 'https://cypherbreak.com',
  },
  {
    title: 'Skylands',
    blurb:
      'An interactive 3D scroll experience built with Three.js, React 19, and TypeScript. Clean separation between WebGL canvas and semantic HTML overlay. Fully accessible with screen readers. Deployed via GitHub Actions for scalable static hosting.',
    tags: ['Three.js', 'React', 'TypeScript', 'WebGL'],
    href: 'https://github.com/marioflwrs/marioflwrs.github.io',
  },
  {
    title: 'Discord Active Agent Trigger',
    blurb:
      'Event-driven orchestration layer for multi-agent AI workflows. Monitors Discord submissions, validates content, and triggers downstream AI-powered development loops. Coordinates async stages using self-terminating container lifecycles.',
    tags: ['Node.js', 'Discord API', 'Automation', 'AI Tooling'],
  },
];
