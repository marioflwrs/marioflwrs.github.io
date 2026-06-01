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
      'A complex, full-stack application architected using advanced AI-agent developer workflows. Built with an enterprise-grade security perimeter — rate limiting, strict input validation, and a hardened controls layer — to demonstrate that great products are defined not just by what they do, but by how they are restricted.',
    tags: ['Full-Stack', 'Security', 'AI Agents', 'Systems Design'],
    href: 'https://cypherbreak.com',
  },
  {
    title: 'Skylands',
    blurb:
      'This portfolio — a scroll-driven 3D experience built on a modular Three.js engine with a React overlay. Engineered in distinct layers: a real-time WebGL scene (world entities, camera path system, picking), a React UI layer, and a CI/CD pipeline on GitHub Actions that deploys to zero-downtime Pages on every push.',
    tags: ['Three.js', 'React', 'TypeScript', 'WebGL'],
    href: 'https://github.com/marioflwrs/marioflwrs.github.io',
  },
  {
    title: 'Discord Active Agent Trigger',
    blurb:
      'A lightweight automation pipeline that bridges Discord and a local AI workspace. It monitors a private channel, harvests image attachments and text, downloads them locally, packages everything into a structured JSON payload, then exits — using its own shutdown as a signal to wake downstream agents and begin processing the dropped task.',
    tags: ['Node.js', 'Discord API', 'Automation', 'AI Tooling'],
  },
];
