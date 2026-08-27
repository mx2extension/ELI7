'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Newspaper, Calendar } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image_url?: string;
  created_at: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      const { data } = await supabase.from('news').select('*').eq('slug', slug).single();
      setArticle(data);
      setLoading(false);
    }
    fetchArticle();
  }, [slug]);

  if (loading) return <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto text-center font-bold text-[#293241]">Loading article...</div>;
  if (!article) notFound();

  return (
    <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto space-y-10">
      <div>
        <Link href="/news" className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>

      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] p-8 md:p-12 space-y-6">
        <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
          <Newspaper className="w-4 h-4" /> Press Release
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight leading-tight">{article.title}</h1>
        <p className="text-lg md:text-xl text-[#0A0A0A]/80 font-medium leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A]/60 pt-4 border-t-2 border-[#0A0A0A]/10">
          <Calendar className="w-4 h-4 text-[#C62828]" />
          Published on {new Date(article.created_at).toLocaleDateString()}
        </div>
      </div>

      {article.image_url && !imgError && (
        <div className="bg-[#F4F1EA] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] max-h-[450px] overflow-hidden">
          <img src={article.image_url} alt={article.title} onError={() => setImgError(true)} className="w-full h-full object-cover" />
        </div>
      )}

      {article.content && (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 md:p-12 space-y-6">
          <div className="text-[#0A0A0A]/80 leading-relaxed space-y-4 text-base md:text-lg whitespace-pre-wrap">{article.content}</div>
        </div>
      )}
    </div>
  );
}