export interface Project {
  title: string;
  blurb: string;
  tags: string[];
  href?: string;
}

// Placeholder projects — swap in real work later. Order matches the project islets in
// the 3D archipelago (Islands.buildArchipelago), so a click on islet i focuses
// projects[i].
export const PROJECTS: Project[] = [
  {
    title: 'Project One',
    blurb: 'A short placeholder description of a thing I built. Replace with the real story, the problem it solved, and what made it interesting.',
    tags: ['TypeScript', 'WebGL', 'UX'],
    href: '#',
  },
  {
    title: 'Project Two',
    blurb: 'Another placeholder. Drop in a sentence or two about the stack, your role, and the outcome or impact.',
    tags: ['React', 'Node', 'API'],
    href: '#',
  },
  {
    title: 'Project Three',
    blurb: 'One more placeholder card. Keep these concise and let the visuals do the talking.',
    tags: ['Three.js', 'Design', 'Performance'],
    href: '#',
  },
];
