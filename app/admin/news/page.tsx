'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Plus, Trash2, ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  created_at: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (data) setNews(data);
  };

  useEffect(() => { fetchNews(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      // Upload to Supabase bucket 'public' or 'news-images'
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data } = supabase.storage.from('public').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (error) {
      alert('Error uploading image!');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const addNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('news').insert([{ title, excerpt, image_url: imageUrl }]);
    if (!error) { 
      setTitle(''); 
      setExcerpt(''); 
      setImageUrl(''); 
      fetchNews(); 
    }
  };

  const deleteNews = async (id: string) => {
    await supabase.from('news').delete().eq('id', id);
    setNews(news.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8 bg-[#F4F1EA]">
      <div className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A]">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#00897B] hover:underline mb-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">News & Press Updates</h1>
      </div>

      <form onSubmit={addNews} className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="News Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium" 
            required 
          />

          {/* File Upload Component */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-[#293241]">Upload Cover Image</label>
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer bg-[#F4F1EA] border-2 border-[#0A0A0A] p-2.5 text-sm font-medium flex items-center justify-between hover:bg-gray-100 transition-colors">
                <span className="truncate text-gray-600">{imageUrl ? 'Image Uploaded Successfully ✓' : 'Choose file...'}</span>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin text-[#00897B]" /> : <Upload className="w-4 h-4 text-[#0A0A0A]" />}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <textarea 
          placeholder="News Excerpt / Content Summary" 
          value={excerpt} 
          onChange={e => setExcerpt(e.target.value)} 
          className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium h-24" 
          required 
        />

        <button 
          type="submit" 
          disabled={uploading}
          className="bg-[#00897B] text-white font-bold px-6 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] uppercase text-sm flex items-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Publish Article
        </button>
      </form>

      <div className="space-y-4">
        {news.map(item => (
          <div key={item.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover border-2 border-[#0A0A0A]" />
              )}
              <div>
                <h3 className="font-bold text-xl font-['Bricolage_Grotesque'] text-[#293241]">{item.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{item.excerpt}</p>
              </div>
            </div>
            <button onClick={() => deleteNews(item.id)} className="bg-red-600 text-white p-2 border border-[#0A0A0A] hover:bg-red-700">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}