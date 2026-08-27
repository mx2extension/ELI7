'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  skills: string;
  created_at: string;
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  const fetchVolunteers = async () => {
    const { data } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
    if (data) setVolunteers(data);
  };

  useEffect(() => { fetchVolunteers(); }, []);

  const deleteVolunteer = async (id: string) => {
    if (confirm('Delete this volunteer application?')) {
      await supabase.from('volunteers').delete().eq('id', id);
      setVolunteers(volunteers.filter(v => v.id !== id));
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8 bg-[#F4F1EA]">
      <div className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A]">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#00897B] hover:underline mb-1"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</Link>
        <h1 className="text-3xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">Volunteer Submissions</h1>
      </div>

      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#293241] text-white border-b-2 border-[#0A0A0A] text-xs uppercase">
                <th className="p-4 font-bold">Applicant Name</th>
                <th className="p-4 font-bold">Contact Email</th>
                <th className="p-4 font-bold">Phone</th>
                <th className="p-4 font-bold">Skills / Interest</th>
                <th className="p-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#0A0A0A] font-medium text-sm">
              {volunteers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 font-bold text-gray-500">No volunteer signups yet.</td></tr>
              ) : volunteers.map(v => (
                <tr key={v.id} className="hover:bg-[#F4F1EA]/50">
                  <td className="p-4 font-extrabold text-[#293241]">{v.full_name}</td>
                  <td className="p-4 text-xs text-gray-600">{v.email}</td>
                  <td className="p-4 text-xs text-gray-600">{v.phone || 'N/A'}</td>
                  <td className="p-4 text-xs font-bold text-[#00897B] uppercase">{v.skills}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => deleteVolunteer(v.id)} className="bg-red-600 text-white p-2 border border-[#0A0A0A] hover:bg-red-700"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}