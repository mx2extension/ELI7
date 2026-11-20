
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
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

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

      {/* PAGE HEADER */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
          <Newspaper className="w-4 h-4" />
          Press & Updates
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">
          News & Announcements
        </h1>

        <p className="text-lg text-[#0A0A0A]/80 leading-relaxed">
          Stay up to date with our latest milestones, press releases, program announcements, and community partnerships.
        </p>
      </div>

      {/* DATABASE ERROR */}
      {errorMsg && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 font-bold text-sm">
          Database Error: {errorMsg} (Make sure your 'news' table exists in Supabase!)
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center font-bold text-[#293241]">
          Loading news...
        </div>

      ) : newsList.length === 0 && !errorMsg ? (

        /* EMPTY STATE */
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center space-y-4">
          <p className="text-lg font-bold text-[#293241]">
            No news articles published yet.
          </p>

          <p className="text-sm text-[#0A0A0A]/70">
            Run the seed SQL script in your Supabase editor to populate sample announcements.
          </p>
        </div>

      ) : (

        /* RESPONSIVE NEWS GRID */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {newsList.map((item) => (

            /* ENTIRE CARD IS CLICKABLE */
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              aria-label={`Read article: ${item.title}`}
              className="w-full min-w-0 bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col sm:flex-row items-stretch gap-0 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-7 overflow-hidden group hover:-translate-y-1 hover:shadow-[10px_10px_0px_#0A0A0A] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00897B]"
            >

              {/* ARTICLE IMAGE */}
              <div className="w-full h-52 sm:h-auto sm:w-[34%] sm:min-w-[140px] md:min-w-[180px] flex-shrink-0 border-2 border-[#0A0A0A] overflow-hidden bg-[#F4F1EA]">

                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full min-h-[200px] sm:min-h-[220px] md:min-h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full min-h-[200px] sm:min-h-[220px] flex items-center justify-center text-[#293241]/40 text-xs font-bold uppercase tracking-wider">
                    News Visual
                  </div>
                )}

              </div>

              {/* ARTICLE TEXT */}
              <div className="flex flex-col justify-center flex-grow min-w-0 gap-3 py-5 sm:py-1">

                {/* DATE */}
                <span className="flex items-center gap-1.5 text-xs md:text-sm text-[#0A0A0A]/60 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#C62828] flex-shrink-0" />

                  {new Date(item.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>

                {/* HEADLINE */}
                <h2 className="text-xl md:text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug group-hover:text-[#00897B] transition-colors">
                  {item.title}
                </h2>

                {/* EXCERPT */}
                <p className="text-sm text-[#0A0A0A]/75 line-clamp-3 leading-relaxed">
                  {item.excerpt}
                </p>

                {/* READ MORE INDICATOR */}
                <span className="inline-flex items-center gap-1.5 text-[#00897B] font-extrabold text-xs uppercase underline underline-offset-4 w-fit mt-1">
                  Read More
                  <ArrowUpRight className="w-4 h-4" />
                </span>

              </div>

            </Link>

          ))}

        </div>
      )}

    </div>
  );
}
