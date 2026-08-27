'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
}

export default function AlbumDetailPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // Unwrap params safely whether it's a promise or direct object
  const resolvedParams = 'then' in Promise.resolve(params) ? use(params as Promise<{ slug: string }>) : (params as { slug: string });
  const slug = resolvedParams.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbumData() {
      if (!slug) return;

      // 1. Fetch category details by slug
      const { data: catData } = await supabase
        .from('gallery_categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (catData) {
        setCategory(catData);

        // 2. Fetch all images linked to this category_id
        const { data: imgData } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('category_id', catData.id)
          .order('created_at', { ascending: false });

        if (imgData) setImages(imgData);
      }
      setLoading(false);
    }

    fetchAlbumData();
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col justify-between">
      <main className="space-y-12 pb-20 max-w-7xl mx-auto px-6 pt-12 md:pt-16 grow w-full">
        <div>
          <Link 
            href="/gallery"
            className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2.5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Gallery Categories
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-24 font-bold text-xl text-[#293241]">Loading album pictures...</div>
        ) : !category ? (
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center space-y-6">
            <h1 className="text-3xl font-extrabold text-[#293241]">Album Not Found</h1>
            <p className="text-sm text-[#0A0A0A]/70">Slug requested: <code className="bg-[#FFD23F] px-2 py-1 font-bold">{slug}</code></p>
            <Link href="/gallery" className="inline-block bg-[#FFD23F] font-bold px-6 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A]">
              &larr; Back to Gallery
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] p-8 md:p-12 space-y-4">
              <span className="inline-block bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-1 border-2 border-[#0A0A0A]">
                Photo Album ({images.length} Photos)
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                {category.title}
              </h1>
              <p className="text-[#0A0A0A]/80 text-base md:text-lg leading-relaxed font-medium max-w-3xl">
                {category.description}
              </p>
            </div>

            {images.length === 0 ? (
              <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center">
                <p className="font-bold text-lg text-[#293241]">No pictures have been added to this album yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {images.map((img) => (
                  <div 
                    key={img.id} 
                    className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="h-72 border-b-2 border-[#0A0A0A] bg-[#293241] overflow-hidden">
                      <img 
                        src={img.image_url} 
                        alt={img.caption || 'Gallery photo'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {img.caption && (
                      <div className="p-5 bg-[#F4F1EA]">
                        <p className="text-sm font-bold text-[#293241] leading-snug">
                          {img.caption}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}