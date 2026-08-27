'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { BookOpen, Calendar, ArrowUpRight } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url?: string;
  created_at: string;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      const { data } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });
      
      setStories(data || []);
      setLoading(false);
    }
    fetchStories();
  }, []);

  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
          <BookOpen className="w-4 h-4" /> Field Notes & Impact
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">
          Stories & Dispatches
        </h1>
        <p className="text-lg text-[#0A0A0A]/80 leading-relaxed">
          Read firsthand accounts, community updates, and success stories from our outreach programs, youth bootcamps, and partner initiatives.
        </p>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center font-bold text-[#293241]">
          Loading stories...
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center">
          <p className="text-lg font-bold text-[#293241]">No stories published yet.</p>
          <p className="text-sm text-[#0A0A0A]/70 mt-2">Check back soon for field dispatches and updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <div className="h-56 border-b-2 border-[#0A0A0A] overflow-hidden bg-[#F4F1EA]">
                {story.image_url ? (
                  <img
                    src={story.image_url}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#293241]/40 text-xs font-bold uppercase tracking-wider">
                    [Story Visual]
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-sm text-[#0A0A0A]/80 line-clamp-3 leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-[#0A0A0A]/10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A]/60">
                    <Calendar className="w-3.5 h-3.5 text-[#EE6C4D]" />
                    {new Date(story.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/stories/${story.slug}`}
                    className="inline-flex items-center gap-1 bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#EE6C4D] hover:text-[#FFFFFE] transition-colors"
                  >
                    Read Story <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}