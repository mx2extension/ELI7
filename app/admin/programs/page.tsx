'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Program {
  id: string;
  title: string;
  description: string;
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const fetchPrograms = async () => {
    const { data } = await supabase.from('programs').select('*');
    if (data) setPrograms(data);
  };

  useEffect(() => { fetchPrograms(); }, []);

  const addProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('programs').insert([{ title, description: desc }]);
    if (!error) { setTitle(''); setDesc(''); fetchPrograms(); }
  };

  const deleteProgram = async (id: string) => {
    await supabase.from('programs').delete().eq('id', id);
    setPrograms(programs.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8 bg-[#F4F1EA]">
      <div className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A]">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#00897B] hover:underline mb-1"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</Link>
        <h1 className="text-3xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">Foundation Programs</h1>
      </div>

      <form onSubmit={addProgram} className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] space-y-4">
        <input type="text" placeholder="Program Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium" required />
        <textarea placeholder="Program Description" value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium h-20" required />
        <button type="submit" className="bg-[#00897B] text-white font-bold px-6 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] uppercase text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Program</button>
      </form>

      <div className="space-y-4">
        {programs.map(p => (
          <div key={p.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl font-['Bricolage_Grotesque'] text-[#293241]">{p.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{p.description}</p>
            </div>
            <button onClick={() => deleteProgram(p.id)} className="bg-red-600 text-white p-2 border border-[#0A0A0A] hover:bg-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}