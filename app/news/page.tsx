'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowUpRight } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url?: string;
  created_at: string;
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setNewsList(data || []);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto space-y-12">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
          <Newspaper className="w-4 h-4" /> Press & Updates
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">News & Announcements</h1>
        <p className="text-lg text-[#0A0A0A]/80 leading-relaxed">Stay up to date with our latest milestones, press releases, program announcements, and community partnerships.</p>
      </div>

      {errorMsg && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 font-bold text-sm">
          Database Error: {errorMsg} (Make sure your 'news' table exists in Supabase!)
        </div>
      )}

      {loading ? (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center font-bold text-[#293241]">Loading news...</div>
      ) : newsList.length === 0 && !errorMsg ? (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center space-y-4">
          <p className="text-lg font-bold text-[#293241]">No news articles published yet.</p>
          <p className="text-sm text-[#0A0A0A]/70">Run the seed SQL script in your Supabase editor to populate sample announcements.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((item) => (
            <div key={item.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="h-56 border-b-2 border-[#0A0A0A] overflow-hidden bg-[#F4F1EA]">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#293241]/40 text-xs font-bold uppercase tracking-wider">[News Visual]</div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug">{item.title}</h3>
                  <p className="text-sm text-[#0A0A0A]/80 line-clamp-3 leading-relaxed">{item.excerpt}</p>
                </div>
                <div className="pt-4 border-t-2 border-[#0A0A0A]/10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A]/60">
                    <Calendar className="w-3.5 h-3.5 text-[#C62828]" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <Link href={`/news/${item.slug}`} className="inline-flex items-center gap-1 bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] transition-colors">
                    Read Article <ArrowUpRight className="w-4 h-4" />
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