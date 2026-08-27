'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Stat {
  id: string;
  label: string;
  value: string;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');

  const fetchStats = async () => {
    const { data } = await supabase.from('stats').select('*');
    if (data) setStats(data);
  };

  useEffect(() => { fetchStats(); }, []);

  const addStat = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('stats').insert([{ label, value }]);
    if (!error) { setLabel(''); setValue(''); fetchStats(); }
  };

  const deleteStat = async (id: string) => {
    await supabase.from('stats').delete().eq('id', id);
    setStats(stats.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8 bg-[#F4F1EA]">
      <div className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A]">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#00897B] hover:underline mb-1"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</Link>
        <h1 className="text-3xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">Global Stats Counter</h1>
      </div>

      <form onSubmit={addStat} className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Stat Label (e.g. Communities Reached)" value={label} onChange={e => setLabel(e.target.value)} className="p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium" required />
        <input type="text" placeholder="Value (e.g. 24+)" value={value} onChange={e => setValue(e.target.value)} className="p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium" required />
        <button type="submit" className="bg-[#00897B] text-white font-bold p-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] uppercase text-sm flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Stat</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(s => (
          <div key={s.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 flex justify-between items-center">
            <div>
              <div className="text-3xl font-black font-['Bricolage_Grotesque'] text-[#C62828]">{s.value}</div>
              <div className="font-bold text-sm text-[#293241] mt-1">{s.label}</div>
            </div>
            <button onClick={() => deleteStat(s.id)} className="bg-red-600 text-white p-2 border border-[#0A0A0A] hover:bg-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}