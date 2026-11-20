'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  category?: string;
  location?: string;
  event_date?: string;
  description: string;
  image_url?: string;
  gallery_urls?: string[];
  created_at: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchProject() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

      setProject(data || null);
      setLoading(false);
    }

    fetchProject();
  }, [slug]);

  // Combine cover image + gallery_urls into one isolated list for this project only
  const projectPhotos: string[] = project
    ? Array.from(
        new Set(
          [project.image_url, ...(project.gallery_urls || [])].filter(
            (url): url is string => Boolean(url)
          )
        )
      )
    : [];

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || projectPhotos.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % projectPhotos.length);
  }, [lightboxIndex, projectPhotos.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || projectPhotos.length === 0) return;
    setLightboxIndex(
      (lightboxIndex - 1 + projectPhotos.length) % projectPhotos.length
    );
  }, [lightboxIndex, projectPhotos.length]);

  // Keyboard navigation (Escape, Left Arrow, Right Arrow) for the lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNext, handlePrev]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center font-bold text-[#293241]">
          Loading project brief and photo archive...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto space-y-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center">
          <p className="text-xl font-bold text-[#293241]">Project not found.</p>
          <p className="text-sm text-[#0A0A0A]/70 mt-2">
            This project archive may have been moved or removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto space-y-12">
      {/* Top Navigation */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Projects
        </Link>
      </div>

      {/* Project Brief Card */}
      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 md:p-10 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {project.category && (
            <span className="bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-1 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
              {project.category}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A]/70 bg-[#F4F1EA] px-3 py-1 border-2 border-[#0A0A0A]">
            <Calendar className="w-3.5 h-3.5 text-[#EE6C4D]" />
            {new Date(project.event_date || project.created_at).toLocaleDateString()}
          </span>
          {project.location && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A]/70 bg-[#F4F1EA] px-3 py-1 border-2 border-[#0A0A0A]">
              <MapPin className="w-3.5 h-3.5 text-[#EE6C4D]" />
              {project.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFFFFE] bg-[#293241] px-3 py-1 border-2 border-[#0A0A0A]">
            <Images className="w-3.5 h-3.5 text-[#FFD23F]" />
            {projectPhotos.length} {projectPhotos.length === 1 ? 'Photo' : 'Photos'}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">
          {project.title}
        </h1>

        <div className="border-t-2 border-[#0A0A0A]/10 pt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#EE6C4D] mb-2">
            Project Brief
          </h2>
          <p className="text-base md:text-lg text-[#0A0A0A]/85 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>
      </div>

      {/* Isolated Project Photo Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
            Project Documentation ({projectPhotos.length})
          </h2>
          <p className="text-xs font-bold uppercase text-[#0A0A0A]/60">
            Click any photo to enlarge
          </p>
        </div>

        {projectPhotos.length === 0 ? (
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center">
            <p className="font-bold text-[#293241]">
              No photos uploaded for this project yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectPhotos.map((photoUrl, index) => (
              <button
                key={`${photoUrl}-${index}`}
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="relative group bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] overflow-hidden aspect-[4/3] cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#0A0A0A] transition-all text-left"
              >
                <img
                  src={photoUrl}
                  alt={`${project.title} - Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/30 transition-colors flex items-end justify-between p-4">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#FFFFFE] text-[#0A0A0A] text-xs font-bold px-2.5 py-1 border-2 border-[#0A0A0A]">
                    Photo {index + 1} of {projectPhotos.length}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#FFD23F] text-[#0A0A0A] p-2 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal (Click to Enlarge) */}
      {lightboxIndex !== null && projectPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-[#0A0A0A]/90 flex items-center justify-center p-4 md:p-10"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col items-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-[#FFFFFE]">
              <span className="text-sm font-bold bg-[#293241] px-3 py-1.5 border-2 border-[#FFFFFE]">
                {project.title} — {lightboxIndex + 1} / {projectPhotos.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-2 border-2 border-[#0A0A0A] hover:bg-[#EE6C4D] hover:text-[#FFFFFE] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                Close <X className="w-4 h-4" />
              </button>
            </div>

            {/* Enlarged Image */}
            <div className="relative w-full bg-[#0A0A0A] border-2 border-[#FFFFFE] flex items-center justify-center overflow-hidden max-h-[75vh]">
              <img
                src={projectPhotos[lightboxIndex]}
                alt={`${project.title} enlarged view ${lightboxIndex + 1}`}
                className="max-h-[75vh] w-auto object-contain"
              />

              {/* Previous / Next Controls */}
              {projectPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous photo"
                    className="absolute left-3 bg-[#FFFFFE] text-[#0A0A0A] p-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next photo"
                    className="absolute right-3 bg-[#FFFFFE] text-[#0A0A0A] p-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}