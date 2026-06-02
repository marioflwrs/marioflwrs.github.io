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
      'A full-stack app that takes security seriously. It\'s built to handle real scale, with rate limiting, strict input validation, and a perimeter that actually holds. This one shows you don\'t have to choose between fast and secure.',
    tags: ['Full-Stack', 'Security', 'AI Agents', 'Systems Design'],
    href: 'https://cypherbreak.com',
  },
  {
    title: 'Skylands',
    blurb:
      'This portfolio — a 3D scroll experience built on modular Three.js, wrapped in React, and deployed to Pages on every push. It\'s engineered in layers: the WebGL scene, the UI overlay, and a clean CI/CD pipeline. A playground for proving architecture matters.',
    tags: ['Three.js', 'React', 'TypeScript', 'WebGL'],
    href: 'https://github.com/marioflwrs/marioflwrs.github.io',
  },
  {
    title: 'Discord Active Agent Trigger',
    blurb:
      'A bridge between Discord and local AI workflows. It watches a channel, captures images and text, packages it up, then exits — using its own shutdown as a signal. Tiny but mighty: one clean pattern for triggering complex downstream logic.',
    tags: ['Node.js', 'Discord API', 'Automation', 'AI Tooling'],
  },
];
