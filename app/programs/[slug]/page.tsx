'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle2, Heart } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url: string;
  category: string;
}

export default function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = 'then' in Promise.resolve(params) ? use(params as Promise<{ slug: string }>) : (params as { slug: string });
  const slug = resolvedParams.slug;

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgram() {
      if (!slug) return;

      const { data, error } = await supabase
        .from('programs') // Make sure your table is named 'programs' or update accordingly
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) {
        setProgram(data);
      } else {
        console.error('Error fetching program:', error?.message);
      }
      setLoading(false);
    }

    fetchProgram();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center bg-[#F4F1EA]">
        <p className="font-bold text-xl text-[#293241]">Loading program details...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-6">
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 space-y-4">
          <h1 className="text-3xl font-extrabold text-[#293241]">Program Not Found</h1>
          <p className="text-gray-600 font-medium">We couldn't find the program matching slug: <code className="bg-[#FFD23F] px-2 py-1 font-bold">{slug}</code></p>
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-[#FFD23F] text-[#0A0A0A] font-bold px-6 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-12">
      <main className="max-w-4xl mx-auto px-6 space-y-10">
        <div>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2.5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] p-8 md:p-12 space-y-6">
          <div className="flex flex-wrap gap-3">
            <span className="bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-1 border-2 border-[#0A0A0A]">
              {program.category || 'Initiative'}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] leading-tight">
            {program.title}
          </h1>

          <p className="text-[#0A0A0A]/80 text-lg font-medium leading-relaxed">
            {program.description}
          </p>
        </div>

        {/* Featured Image */}
        {program.image_url && (
          <div className="h-[400px] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] bg-gray-100 overflow-hidden">
            <img 
              src={program.image_url} 
              alt={program.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Detailed Body Content */}
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 md:p-12 space-y-6">
          <h2 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] uppercase border-b-2 border-[#0A0A0A] pb-4">
            About This Program
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 font-medium space-y-4 whitespace-pre-line">
            {program.content || program.description}
          </div>
        </div>

        {/* Call to Action Box */}
        <div className="bg-[#00897B] text-white border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold font-['Bricolage_Grotesque'] uppercase">
              Support This Initiative
            </h3>
            <p className="text-white/90 text-sm font-medium max-w-xl">
              Your contribution helps us expand educational workshops and hygienic resources to communities in need.
            </p>
          </div>
          <Link 
            href="/donate" 
            className="bg-[#FFD23F] text-[#0A0A0A] font-bold uppercase px-6 py-3.5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all whitespace-nowrap"
          >
            Donate Now
          </Link>
        </div>
      </main>
    </div>
  );
}