'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Story {
  id: string;
  beneficiary_name: string;
  story_text: string;
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const fetchStories = async () => {
    const { data } = await supabase.from('success_stories').select('*');
    if (data) setStories(data);
  };

  useEffect(() => { fetchStories(); }, []);

  const addStory = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('success_stories').insert([{ beneficiary_name: name, story_text: text }]);
    if (!error) { setName(''); setText(''); fetchStories(); }
  };

  const deleteStory = async (id: string) => {
    await supabase.from('success_stories').delete().eq('id', id);
    setStories(stories.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8 bg-[#F4F1EA]">
      <div className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A]">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#00897B] hover:underline mb-1"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</Link>
        <h1 className="text-3xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">Success Stories</h1>
      </div>

      <form onSubmit={addStory} className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] space-y-4">
        <input type="text" placeholder="Beneficiary / Subject Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium" required />
        <textarea placeholder="Success Story Narrative" value={text} onChange={e => setText(e.target.value)} className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium h-24" required />
        <button type="submit" className="bg-[#00897B] text-white font-bold px-6 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] uppercase text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Story</button>
      </form>

      <div className="space-y-4">
        {stories.map(s => (
          <div key={s.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg font-['Bricolage_Grotesque'] text-[#293241]">{s.beneficiary_name}</h3>
              <p className="text-xs text-gray-700 mt-2 font-medium">{s.story_text}</p>
            </div>
            <button onClick={() => deleteStory(s.id)} className="bg-red-600 text-white p-2 border border-[#0A0A0A] hover:bg-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}