
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  MapPin,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  School,
  Share2,
  Link2,
  Check,
  MessageCircle,
  Send,
  Mail,
  Smartphone,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  location?: string | null;
  event_date?: string | null;
  description: string;
  image_url?: string | null;
  gallery_urls?: string[] | null;
  created_at: string;
}

interface ProjectSchool {
  id: string;
  project_id: string;
  school_name: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  event_date?: string | null;
  created_at: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : undefined;

  const [project, setProject] = useState<Project | null>(null);
  const [schools, setSchools] = useState<ProjectSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Sharing states
  const [shareOpen, setShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function fetchProjectAndSchools() {
      setLoading(true);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

      if (cancelled) return;

      if (projectError || !projectData) {
        console.error('Error fetching project:', projectError);
        setProject(null);
        setSchools([]);
        setLoading(false);
        return;
      }

      setProject(projectData as Project);

      // A project may have several schools/locations beneath it.
      // If none exist, the normal project gallery remains in use.
      const { data: schoolData, error: schoolError } = await supabase
        .from('project_schools')
        .select('*')
        .eq('project_id', projectData.id)
        .order('event_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (schoolError) {
        console.error('Error fetching project schools:', schoolError);
        setSchools([]);
      } else {
        setSchools((schoolData || []) as ProjectSchool[]);
      }

      if (!cancelled) setLoading(false);
    }

    fetchProjectAndSchools();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Keep the legacy gallery for ordinary projects only.
  // School photos belong to their individual school pages.
  const projectPhotos: string[] = project && schools.length === 0
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
    setLightboxIndex((current) =>
      current === null ? null : (current + 1) % projectPhotos.length
    );
  }, [lightboxIndex, projectPhotos.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || projectPhotos.length === 0) return;
    setLightboxIndex((current) =>
      current === null
        ? null
        : (current - 1 + projectPhotos.length) % projectPhotos.length
    );
  }, [lightboxIndex, projectPhotos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNext, handlePrev]);

  // Sharing functionality
  const currentUrl =
    shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const formattedMessage = project
    ? `${project.title}\n\n${project.description}\n\nRead more here: ${currentUrl}`
    : '';

  const copyText = async (text: string, onDone: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      onDone();
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) onDone();
    }
  };

  const handleCopyLink = () => {
    if (!currentUrl) return;

    copyText(currentUrl, () => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleCopyMessage = () => {
    if (!currentUrl || !project) return;

    copyText(formattedMessage, () => {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    });
  };

  const handleSystemShare = async () => {
    if (!project) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: currentUrl,
        });
      } catch {
        // User dismissed system share sheet.
      }
    } else {
      handleCopyMessage();
    }
  };

  const platforms = project
    ? [
        {
          name: 'WhatsApp',
          subtitle: 'Send to a contact or group',
          href: `https://wa.me/?text=${encodeURIComponent(formattedMessage)}`,
          icon: MessageCircle,
        },
        {
          name: 'Telegram',
          subtitle: 'Send via chat or channel',
          href: `https://t.me/share/url?url=${encodeURIComponent(
            currentUrl
          )}&text=${encodeURIComponent(project.title)}`,
          icon: Send,
        },
        {
          name: 'Email',
          subtitle: 'Send directly by email',
          href: `mailto:?subject=${encodeURIComponent(
            project.title
          )}&body=${encodeURIComponent(formattedMessage)}`,
          icon: Mail,
        },
        {
          name: 'X (Twitter)',
          subtitle: 'Share as a post or DM',
          href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `${project.title} ${currentUrl}`
          )}`,
          icon: Share2,
        },
        {
          name: 'Facebook',
          subtitle: 'Share to feed or messenger',
          href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            currentUrl
          )}`,
          icon: Share2,
        },
        {
          name: 'LinkedIn',
          subtitle: 'Share with network or message',
          href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            currentUrl
          )}`,
          icon: Share2,
        },
      ]
    : [];

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
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
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

  const hasSchools = schools.length > 0;

  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto space-y-12">

      {/* Top Navigation */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Projects
        </Link>
      </div>

      {/* TOP SHARE SECTION */}
      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-6 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Share This Project
            </h2>
            <p className="text-sm text-[#0A0A0A]/70 mt-1">
              Help us spread the word about this project and its impact.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShareOpen((prev) => !prev)}
            aria-expanded={shareOpen}
            className="inline-flex items-center justify-center gap-2 bg-[#FFD23F] text-[#0A0A0A] font-extrabold text-xs uppercase px-5 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <Share2 className="w-4 h-4" />
            {shareOpen ? 'Close Sharing Options' : 'Share This Project'}
          </button>
        </div>

        {shareOpen && (
          <div className="pt-4 mt-2 border-t-2 border-[#0A0A0A]/10 bg-[#F4F1EA] p-5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] space-y-4">

            <div className="flex items-center justify-between border-b-2 border-[#0A0A0A]/10 pb-3 gap-3">
              <div>
                <h3 className="text-sm font-extrabold uppercase text-[#293241]">
                  Choose Where to Share This Project
                </h3>
                <p className="text-xs text-[#0A0A0A]/70 mt-1">
                  Send this project to someone or copy the message to share anywhere.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShareOpen(false)}
                aria-label="Close share options"
                className="shrink-0 p-1.5 bg-[#FFFFFE] border-2 border-[#0A0A0A] hover:bg-[#C62828] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map((platform) => {
                const Icon = platform.icon;

                return (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target={platform.name === 'Email' ? undefined : '_blank'}
                    rel={
                      platform.name === 'Email'
                        ? undefined
                        : 'noopener noreferrer'
                    }
                    className="flex items-center gap-3 p-3 bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-colors"
                  >
                    <div className="w-9 h-9 bg-[#F4F1EA] border-2 border-[#0A0A0A] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#293241]" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-extrabold uppercase text-[#293241]">
                        {platform.name}
                      </div>
                      <div className="text-[11px] text-[#0A0A0A]/70 truncate">
                        {platform.subtitle}
                      </div>
                    </div>
                  </a>
                );
              })}

              <button
                type="button"
                onClick={handleSystemShare}
                className="flex items-center gap-3 p-3 bg-[#293241] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#00897B] transition-colors text-left cursor-pointer"
              >
                <div className="w-9 h-9 bg-[#FFFFFE] text-[#293241] border-2 border-[#0A0A0A] flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-extrabold uppercase">
                    More Apps
                  </div>
                  <div className="text-[11px] text-white/80 truncate">
                    Device share menu
                  </div>
                </div>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t-2 border-[#0A0A0A]/10">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center gap-1.5 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-3.5 py-2 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-colors cursor-pointer"
              >
                {copiedMessage ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00897B]" />
                    Message Copied
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    Copy Headline + Link
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 bg-[#F4F1EA] text-[#0A0A0A] font-bold text-xs uppercase px-3.5 py-2 border-2 border-[#0A0A0A] hover:bg-[#FFFFFE] transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00897B]" />
                    Link Copied
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    Copy Link Only
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Project Brief */}
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

          {hasSchools ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFFFFE] bg-[#293241] px-3 py-1 border-2 border-[#0A0A0A]">
              <School className="w-3.5 h-3.5 text-[#FFD23F]" />
              {schools.length} {schools.length === 1 ? 'School' : 'Schools'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFFFFE] bg-[#293241] px-3 py-1 border-2 border-[#0A0A0A]">
              <Images className="w-3.5 h-3.5 text-[#FFD23F]" />
              {projectPhotos.length} {projectPhotos.length === 1 ? 'Photo' : 'Photos'}
            </span>
          )}
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

      {/* Parent project: show a directory, not a combined gallery */}
      {hasSchools ? (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#EE6C4D]">
                Project Locations
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                Participating Schools
              </h2>
            </div>
            <p className="text-xs font-bold uppercase text-[#0A0A0A]/60">
              Select a school to view its documentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schools.map((school, index) => (
              <Link
                key={school.id}
                href={`/projects/${project.slug}/schools/${school.slug}`}
                className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 flex items-center justify-between gap-4 group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#0A0A0A] transition-all"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-[#FFD23F] border-2 border-[#0A0A0A] font-extrabold text-[#0A0A0A]">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="min-w-0 space-y-2">
                    <h3 className="text-lg md:text-xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug group-hover:text-[#EE6C4D] transition-colors">
                      {school.school_name}
                    </h3>

                    {school.description && (
                      <p className="text-sm text-[#0A0A0A]/75 leading-relaxed line-clamp-2">
                        {school.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-[#0A0A0A]/60">
                      {school.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#EE6C4D]" />
                          {school.location}
                        </span>
                      )}
                      {school.event_date && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#EE6C4D]" />
                          {new Date(school.event_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="shrink-0 w-9 h-9 flex items-center justify-center bg-[#FFD23F] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] group-hover:bg-[#EE6C4D] transition-colors">
                  <ArrowUpRight className="w-5 h-5 text-[#0A0A0A] group-hover:text-[#FFFFFE]" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        /* Ordinary project: retain the existing isolated photo gallery */
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Project Documentation ({projectPhotos.length})
            </h2>
            <p className="text-xs font-bold uppercase text-[#0A0A0A]/60 text-right">
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
        </section>
      )}

      {/* Lightbox for ordinary project photos */}
      {lightboxIndex !== null && projectPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-[#0A0A0A]/90 flex items-center justify-center p-4 md:p-10"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col items-center space-y-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between text-[#FFFFFE] gap-4">
              <span className="text-sm font-bold bg-[#293241] px-3 py-1.5 border-2 border-[#FFFFFE] truncate">
                {project.title} — {lightboxIndex + 1} / {projectPhotos.length}
              </span>

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="shrink-0 bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-2 border-2 border-[#0A0A0A] hover:bg-[#EE6C4D] hover:text-[#FFFFFE] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                Close <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full bg-[#0A0A0A] border-2 border-[#FFFFFE] flex items-center justify-center overflow-hidden max-h-[75vh]">
              <img
                src={projectPhotos[lightboxIndex]}
                alt={`${project.title} enlarged view ${lightboxIndex + 1}`}
                className="max-h-[75vh] w-auto object-contain"
              />

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
