export interface Project {
  id: string;
  title: string;
  category: 'video' | 'script' | 'thumbnail';
  description: string;
  youtubeUrl?: string;    // Only for Video Editing
  docUrl?: string;        // Only for Scripts
  imageUrl?: string;      // Only for Thumbnails
  tags: string[];
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'High-Retention Documentary Script',
    category: 'script',
    description: 'A 15-minute narrative script written for a tech commentary video, focusing on strong hook structures and reader retention.',
    docUrl: 'https://docs.google.com/document/d/e/2PACX-1vExample/pub',
    tags: ['Scriptwriting', 'Storytelling', 'YouTube']
  },
  {
    id: '2',
    title: 'Gaming Channel Intro & Motion Graphics',
    category: 'video',
    description: 'Fast-paced editing with After Effects sound design and motion graphic pop-ups.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['Video Editing', 'Motion Graphics', 'After Effects']
  },
  {
    id: '3',
    title: 'Tech Review Thumbnail',
    category: 'thumbnail',
    description: 'High CTR thumbnail design for a tech review channel using vibrant colors and bold text.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
    tags: ['Thumbnail Design', 'Photoshop']
  }
];

export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  const stored = localStorage.getItem('prince_portfolio_projects');
  return stored ? JSON.parse(stored) : INITIAL_PROJECTS;
};

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem('prince_portfolio_projects', JSON.stringify(projects));
};

export const addProject = (project: Omit<Project, 'id'>) => {
  const projects = getProjects();
  const newProject = { ...project, id: Date.now().toString() };
  saveProjects([...projects, newProject]);
  return newProject;
};

export const updateProject = (id: string, updated: Partial<Project>) => {
  const projects = getProjects();
  const updatedProjects = projects.map(p => p.id === id ? { ...p, ...updated } : p);
  saveProjects(updatedProjects);
};

export const deleteProject = (id: string) => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  saveProjects(filtered);
};
