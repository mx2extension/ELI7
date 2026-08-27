'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  status: string;
  summary: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Ongoing');
  const [summary, setSummary] = useState('');

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*');
    if (data) setProjects(data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('projects').insert([{ title, status, summary }]);
    if (!error) { setTitle(''); setSummary(''); fetchProjects(); }
  };

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8 bg-[#F4F1EA]">
      <div className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A]">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#00897B] hover:underline mb-1"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</Link>
        <h1 className="text-3xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">Projects Overview</h1>
      </div>

      <form onSubmit={addProject} className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} className="p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium" required />
          <select value={status} onChange={e => setStatus(e.target.value)} className="p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-bold">
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>
        <textarea placeholder="Project Summary" value={summary} onChange={e => setSummary(e.target.value)} className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium h-20" required />
        <button type="submit" className="bg-[#00897B] text-white font-bold px-6 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] uppercase text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Project</button>
      </form>

      <div className="space-y-4">
        {projects.map(proj => (
          <div key={proj.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase bg-emerald-200 border border-[#0A0A0A] px-2 py-0.5">{proj.status}</span>
              <h3 className="font-bold text-xl font-['Bricolage_Grotesque'] text-[#293241] mt-1">{proj.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{proj.summary}</p>
            </div>
            <button onClick={() => deleteProject(proj.id)} className="bg-red-600 text-white p-2 border border-[#0A0A0A] hover:bg-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}