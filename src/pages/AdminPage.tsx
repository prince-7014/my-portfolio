import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, X, ExternalLink, Download, Upload, Lock, Send, Key } from 'lucide-react';
import { getProjects, saveProjects, Project } from '../lib/projectsStore';

// GitHub configuration (you can change these)
const REPO_OWNER = 'prince-7014';
const REPO_NAME = 'my-portfolio';
const FILE_PATH = 'src/data/projects.json';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Token management
  const [token, setToken] = useState(localStorage.getItem('github_admin_token') || '');
  const [branch, setBranch] = useState(localStorage.getItem('github_branch') || 'main');

  const [form, setForm] = useState<Omit<Project, 'id'>>({
    title: '',
    category: 'video',
    description: '',
    tags: [],
    youtubeUrl: '',
    docUrl: '',
    imageUrl: '',
  });

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  // Save token & branch to localStorage when changed
  useEffect(() => {
    localStorage.setItem('github_admin_token', token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem('github_branch', branch);
  }, [branch]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'prince2024') {
      setIsLoggedIn(true);
    } else {
      alert('Wrong password!');
    }
  };

  const handleSave = () => {
    if (!form.title) return alert('Title is required');
    
    let updatedProjects;
    if (editingId) {
      updatedProjects = projects.map((p) => (p.id === editingId ? { ...form, id: editingId } : p));
    } else {
      updatedProjects = [...projects, { ...form, id: Date.now().toString() }];
    }
    
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    resetForm();
  };

  const publishToGitHub = async () => {
    if (!token) {
      alert('❌ GitHub Token is missing. Please paste your token in the field above.');
      return;
    }

    if (!projects || projects.length === 0) {
      alert('⚠️ No projects to publish. Add at least one project first.');
      return;
    }

    setIsPublishing(true);
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

    try {
      // 1. Get current file SHA (if exists)
      const getRes = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let sha = '';
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      } else if (getRes.status !== 404) {
        // If error is not "not found", throw it
        const errData = await getRes.json();
        throw new Error(`GitHub API error (${getRes.status}): ${errData.message || 'Unknown error'}`);
      }

      // 2. Prepare content (base64)
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(projects, null, 2))));

      // 3. Commit the file
      const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update portfolio projects via Admin Panel (${new Date().toLocaleString()})`,
          content,
          sha: sha || undefined,
          branch: branch, // <-- uses the branch you set
        })
      });

      if (putRes.ok) {
        alert('✅ Successfully published to GitHub! Your live site will update in ~1 minute.');
      } else {
        const errData = await putRes.json();
        alert(`❌ Failed to publish: ${errData.message || 'Unknown error'}\n\nCheck your token permissions and branch.`);
      }
    } catch (err: any) {
      console.error('Publish error:', err);
      alert(`❌ Error: ${err.message || 'Check console for details'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: '',
      category: 'video',
      description: '',
      tags: [],
      youtubeUrl: '',
      docUrl: '',
      imageUrl: '',
    });
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      category: project.category,
      description: project.description,
      tags: project.tags,
      youtubeUrl: project.youtubeUrl || '',
      docUrl: project.docUrl || '',
      imageUrl: project.imageUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this project?')) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      saveProjects(updated);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'projects_backup.json';
    link.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          setProjects(data);
          saveProjects(data);
          alert('Data imported successfully!');
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center container-custom">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="brutalist-card p-12 max-w-md w-full bg-white"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-retro-purple rounded-full flex items-center justify-center border-[3px] border-black">
              <Lock className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-center mb-8 uppercase">ADMIN ACCESS</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-bold uppercase text-xs mb-2">Portfolio Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_#000]"
                placeholder="Enter password..."
              />
            </div>
            <button type="submit" className="brutalist-btn bg-retro-yellow w-full py-4 uppercase">
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-custom py-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase mb-2">Dashboard</h1>
          <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">Managing Prince's Portfolio</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={publishToGitHub} 
            disabled={isPublishing} 
            className="brutalist-btn bg-retro-purple text-white text-sm py-2 px-4 flex items-center gap-2 font-black"
          >
            <Send className="w-4 h-4" /> {isPublishing ? 'PUBLISHING...' : '🚀 PUBLISH TO LIVE SITE'}
          </button>
          <button onClick={exportData} className="brutalist-btn bg-white text-sm py-2 px-4 flex items-center gap-2">
            <Download className="w-4 h-4" /> EXPORT
          </button>
          <label className="brutalist-btn bg-white text-sm py-2 px-4 flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" /> IMPORT
            <input type="file" className="hidden" onChange={importData} accept=".json" />
          </label>
        </div>
      </div>

      {/* Token & Branch Settings */}
      <div className="brutalist-card p-6 bg-white mb-12 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 w-full">
          <label className="block font-bold uppercase text-xs mb-1 flex items-center gap-2">
            <Key className="w-4 h-4" /> GitHub Token
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-3 py-2 border-[2px] border-black font-mono text-sm focus:outline-none"
            placeholder="github_pat_..."
          />
          <p className="text-xs text-slate-500 mt-1">
            {token ? '✅ Token is set' : '⚠️ Token missing – paste your Fine‑Grained Token here'}
          </p>
        </div>
        <div className="w-full md:w-48">
          <label className="block font-bold uppercase text-xs mb-1">Branch</label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-3 py-2 border-[2px] border-black font-mono text-sm focus:outline-none"
            placeholder="main"
          />
        </div>
        <div className="text-xs text-slate-400 w-full md:w-auto">
          <p>Repo: {REPO_OWNER}/{REPO_NAME}</p>
          <p>File: {FILE_PATH}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="brutalist-card p-8 bg-white sticky top-32">
            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
              {editingId ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              {editingId ? 'Edit Project' : 'Add Project'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold uppercase text-[10px] mb-1">Project Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border-[2px] border-black font-bold focus:outline-none"
                  placeholder="e.g. Documentary Script"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full px-3 py-2 border-[2px] border-black font-bold focus:outline-none"
                >
                  <option value="video">Video Editing</option>
                  <option value="script">Scriptwriting</option>
                  <option value="thumbnail">Thumbnail</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-[10px] mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border-[2px] border-black font-bold focus:outline-none h-24 resize-none"
                  placeholder="Tell the story behind the work..."
                />
              </div>

              {form.category === 'video' && (
                <div>
                  <label className="block font-bold uppercase text-[10px] mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={form.youtubeUrl}
                    onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                    className="w-full px-3 py-2 border-[2px] border-black font-bold focus:outline-none"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              )}

              {form.category === 'script' && (
                <div>
                  <label className="block font-bold uppercase text-[10px] mb-1">Google Doc URL</label>
                  <input
                    type="text"
                    value={form.docUrl}
                    onChange={(e) => setForm({ ...form, docUrl: e.target.value })}
                    className="w-full px-3 py-2 border-[2px] border-black font-bold focus:outline-none"
                    placeholder="https://docs.google.com/document/d/..."
                  />
                </div>
              )}

              {form.category === 'thumbnail' && (
                <div>
                  <label className="block font-bold uppercase text-[10px] mb-1">Image URL</label>
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border-[2px] border-black font-bold focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div>
                <label className="block font-bold uppercase text-[10px] mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={form.tags.join(', ')}
                  onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                  className="w-full px-3 py-2 border-[2px] border-black font-bold focus:outline-none"
                  placeholder="tag1, tag2"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button onClick={handleSave} className="brutalist-btn bg-retro-mint py-3 flex-grow flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {editingId ? 'UPDATE' : 'SAVE'}
                </button>
                {editingId && (
                  <button onClick={resetForm} className="brutalist-btn bg-white py-3 px-4">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-black uppercase mb-8">Existing Projects ({projects.length})</h2>
          {projects.map((project) => (
            <div key={project.id} className="brutalist-card p-6 flex flex-col md:flex-row gap-6 items-start bg-white">
              <div className={`w-16 h-16 shrink-0 border-[3px] border-black flex items-center justify-center font-black text-xs uppercase ${
                project.category === 'script' ? 'bg-purple-300' : project.category === 'video' ? 'bg-pink-300' : 'bg-cyan-300'
              }`}>
                {project.category.slice(0, 3)}
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-black uppercase">{project.title}</h3>
                <p className="text-slate-500 font-bold text-sm mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(t => <span key={t} className="text-[10px] font-bold">#{t}</span>)}
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => handleEdit(project)} className="brutalist-btn bg-white p-2 flex-grow md:flex-none">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(project.id)} className="brutalist-btn bg-retro-orange p-2 flex-grow md:flex-none">
                  <Trash2 className="w-4 h-4" />
                </button>
                {project.youtubeUrl || project.docUrl || project.imageUrl ? (
                  <a href={project.youtubeUrl || project.docUrl || project.imageUrl} target="_blank" rel="noopener noreferrer" className="brutalist-btn bg-white p-2">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : null}
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-20 border-[3px] border-black border-dashed">
              <p className="font-bold text-slate-400">NO PROJECTS YET</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
