import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Program } from '@/types/database';
import { ArrowUpRight } from 'lucide-react';

async function getPrograms(): Promise<Program[]> {
  const { data } = await supabase.from('programs').select('*').order('created_at', { ascending: false });
  return data || [];
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="text-[#C62828] font-bold text-sm tracking-widest uppercase">What We Do</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] mt-2">
          Our Programs
        </h1>
        <p className="text-lg text-[#0A0A0A]/80 mt-4 max-w-2xl">
          Action-driven initiatives designed to foster education, empowerment, inclusion, and lasting community resilience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program) => (
          <div key={program.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] flex flex-col justify-between p-8">
            <div>
              <div className="inline-block bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-1 mb-4 border border-[#0A0A0A]">
                {program.category}
              </div>
              <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] mb-3">
                {program.title}
              </h3>
              <p className="text-sm text-[#0A0A0A]/80 leading-relaxed mb-6">
                {program.short_description}
              </p>
            </div>
            <Link
              href={`/programs/${program.slug}`}
              className="inline-flex items-center gap-2 font-bold text-sm text-[#C62828] hover:underline pt-4 border-t border-[#0A0A0A]/10"
            >
              Explore Program <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}