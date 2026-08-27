'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { FolderOpen, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url?: string;
}

export default function GalleryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGalleryData() {
      try {
        // Fetch categories and their built-in cover_image_url
        const { data: catData, error: catError } = await supabase
          .from('gallery_categories')
          .select('id, title, slug, description, cover_image_url')
          .order('title', { ascending: true });

        if (catError) {
          console.error('Error fetching categories:', catError.message);
          setLoading(false);
          return;
        }

        setCategories(catData || []);
      } catch (err) {
        console.error('Unexpected error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGalleryData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col justify-between">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 grow w-full">
        {/* Header Hero */}
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 md:p-12 space-y-4">
          <span className="bg-[#FFD23F] text-[#0A0A0A] text-xs font-bold uppercase px-3 py-1 border border-[#0A0A0A]">
            Visual Impact Archive
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">
            Our Gallery & Sectors
          </h1>
          <p className="text-gray-600 max-w-2xl text-base font-medium">
            Explore our community projects, outreach programs, and developmental initiatives across various focus areas. Click into any sector to view full photo collections.
          </p>
        </div>

        {/* Albums Grid */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#00897B]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-12 text-center shadow-[8px_8px_0px_#0A0A0A]">
            <p className="font-bold text-lg text-[#293241]">No gallery categories found. Add some from your admin dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/gallery/${cat.slug}`}
                className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-5 flex flex-col justify-between group hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <div className="h-60 border-2 border-[#0A0A0A] mb-4 bg-gray-100 overflow-hidden relative">
                  <img 
                    src={cat.cover_image_url || 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80'} 
                    alt={cat.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="bg-[#FFD23F] text-[#0A0A0A] text-[10px] font-bold uppercase px-2.5 py-1 border border-[#0A0A0A]">
                      Sector Album
                    </span>
                    <FolderOpen className="w-5 h-5 text-[#00897B]" />
                  </div>

                  <h3 className="font-extrabold text-2xl text-[#293241] font-['Bricolage_Grotesque'] uppercase">
                    {cat.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 font-medium">
                    {cat.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase text-[#00897B] group-hover:underline">
                    Explore Sector Album <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}