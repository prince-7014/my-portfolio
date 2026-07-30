import { useState, useEffect } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { Project, saveProjects } from '../lib/projectsStore';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/prince-7014/my-portfolio/main/src/data/projects.json'
        );
        
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
          setFilteredProjects(data);
          saveProjects(data);
        } else {
          const localData = localStorage.getItem('portfolio_projects');
          if (localData) {
            const data = JSON.parse(localData);
            setProjects(data);
            setFilteredProjects(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        const localData = localStorage.getItem('portfolio_projects');
        if (localData) {
          const data = JSON.parse(localData);
          setProjects(data);
          setFilteredProjects(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Combined filter: category + search
  useEffect(() => {
    let result = projects;
    
    if (activeFilter !== 'all') {
      result = result.filter(p => p.category === activeFilter);
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredProjects(result);
  }, [projects, activeFilter, searchQuery]);

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
  };

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="inline-block border-[3px] border-black px-8 py-4 font-black uppercase bg-white">
          Loading Projects...
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-20">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-6xl font-black uppercase tracking-tight mb-4">All Works</h1>
        
        {/* Filter Buttons + Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 border-t-[3px] border-b-[3px] border-black py-4">
          <div className="flex flex-wrap gap-4 flex-1">
            {/* All Button */}
            <button
              onClick={() => handleFilter('all')}
              className={`font-black uppercase text-sm px-4 py-1 border-[2px] border-black transition-all ${
                activeFilter === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-slate-100'
              }`}
            >
              All
            </button>
            
            {/* Video Edits – always retro-purple */}
            <button
              onClick={() => handleFilter('video')}
              className={`font-black uppercase text-sm px-4 py-1 border-[2px] border-black transition-all bg-retro-purple text-white ${
                activeFilter === 'video' 
                  ? 'border-[4px] shadow-[4px_4px_0px_#000]' 
                  : 'hover:opacity-80'
              }`}
            >
              Video Edits
            </button>
            
            {/* Scripts – always retro-mint */}
            <button
              onClick={() => handleFilter('script')}
              className={`font-black uppercase text-sm px-4 py-1 border-[2px] border-black transition-all bg-retro-mint text-black ${
                activeFilter === 'script' 
                  ? 'border-[4px] shadow-[4px_4px_0px_#000]' 
                  : 'hover:opacity-80'
              }`}
            >
              Scripts
            </button>
            
            {/* Thumbnails – always retro-yellow */}
            <button
              onClick={() => handleFilter('thumbnail')}
              className={`font-black uppercase text-sm px-4 py-1 border-[2px] border-black transition-all bg-retro-yellow text-black ${
                activeFilter === 'thumbnail' 
                  ? 'border-[4px] shadow-[4px_4px_0px_#000]' 
                  : 'hover:opacity-80'
              }`}
            >
              Thumbnails
            </button>
          </div>
          
          {/* Search Bar – with subtle shadow added */}
          <div className="relative flex-1 md:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full px-4 py-2 border-[3px] border-black font-bold focus:outline-none bg-white shadow-[2px_2px_0px_#000] focus:shadow-[4px_4px_0px_#000] transition-shadow"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>
        
        {/* Active filters info */}
        {(activeFilter !== 'all' || searchQuery) && (
          <div className="mt-2 text-xs font-bold text-slate-500 uppercase">
            {activeFilter !== 'all' && `Category: ${activeFilter} `}
            {searchQuery && `| Search: "${searchQuery}" `}
            <span className="text-black">({filteredProjects.length} results)</span>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => {
          let badgeColor = 'bg-pink-300';
          let buttonText = 'VIEW FULL';
          let buttonLink = project.imageUrl || '#';
          let buttonColor = 'bg-retro-yellow';
          
          if (project.category === 'script') {
            badgeColor = 'bg-purple-300';
            buttonText = 'READ SCRIPT';
            buttonLink = project.docUrl || '#';
            buttonColor = 'bg-retro-mint';
          } else if (project.category === 'video') {
            badgeColor = 'bg-pink-300';
            buttonText = 'WATCH VIDEO';
            buttonLink = project.youtubeUrl || '#';
            buttonColor = 'bg-retro-purple text-white';
          } else if (project.category === 'thumbnail') {
            badgeColor = 'bg-cyan-300';
            buttonText = 'VIEW FULL';
            buttonLink = project.imageUrl || '#';
            buttonColor = 'bg-retro-yellow';
          }

          return (
            <div key={project.id} className="brutalist-card p-6 bg-white flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 border-[2px] border-black font-black uppercase text-xs ${badgeColor}`}>
                  {project.category}
                </span>
                {project.tags && project.tags.length > 0 && (
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    #{project.tags[0]}
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black uppercase leading-tight mb-2">
                {project.title}
              </h3>

              <p className="text-slate-600 font-bold text-sm mb-4 flex-grow">
                {project.description}
              </p>

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {buttonLink && buttonLink !== '#' && (
                <a
                  href={buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`brutalist-btn ${buttonColor} w-full py-3 flex items-center justify-center gap-2 text-sm font-black uppercase mt-2`}
                >
                  {buttonText} <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-3 text-center py-20 border-[3px] border-black border-dashed">
            <p className="font-bold text-slate-400 uppercase">No projects found.</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}