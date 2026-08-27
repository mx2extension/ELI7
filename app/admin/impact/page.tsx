'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ImpactMetric {
  id: string;
  metric_title: string;
  metric_value: string;
  description: string;
}

export default function AdminImpactPage() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [desc, setDesc] = useState('');

  const fetchMetrics = async () => {
    const { data } = await supabase.from('impact_metrics').select('*');
    if (data) setMetrics(data);
  };

  useEffect(() => { fetchMetrics(); }, []);

  const addMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('impact_metrics').insert([{ metric_title: title, metric_value: value, description: desc }]);
    if (!error) { setTitle(''); setValue(''); setDesc(''); fetchMetrics(); }
  };

  const deleteMetric = async (id: string) => {
    await supabase.from('impact_metrics').delete().eq('id', id);
    setMetrics(metrics.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8 bg-[#F4F1EA]">
      <div className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A]">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#00897B] hover:underline mb-1"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</Link>
        <h1 className="text-3xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">Impact Metrics</h1>
      </div>

      <form onSubmit={addMetric} className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="text" placeholder="Title (e.g. Children Fed)" value={title} onChange={e => setTitle(e.target.value)} className="p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium" required />
        <input type="text" placeholder="Value (e.g. 5,000+)" value={value} onChange={e => setValue(e.target.value)} className="p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium" required />
        <input type="text" placeholder="Short description" value={desc} onChange={e => setDesc(e.target.value)} className="p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium" />
        <button type="submit" className="bg-[#00897B] text-white font-bold p-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] uppercase text-sm flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Metric</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map(m => (
          <div key={m.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 flex justify-between items-start">
            <div>
              <div className="text-3xl font-black font-['Bricolage_Grotesque'] text-[#C62828]">{m.metric_value}</div>
              <h3 className="font-bold text-[#293241] mt-1">{m.metric_title}</h3>
              <p className="text-xs text-gray-600 mt-1">{m.description}</p>
            </div>
            <button onClick={() => deleteMetric(m.id)} className="bg-red-600 text-white p-2 border border-[#0A0A0A] hover:bg-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}