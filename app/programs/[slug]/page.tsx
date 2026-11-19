'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { Program } from '@/types/database';
import {
  ArrowLeft,
  ArrowUpRight,
  PlayCircle,
  MessageCircle,
  Send,
  Mail,
  Copy,
  Check,
} from 'lucide-react';

type ProgramDetail = Program & {
  content?: string | null;
  external_url?: string | null;
  external_link_label?: string | null;
};

function FacebookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 22v-8.2h2.7l.4-3.2h-3.1V8.6c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7v3.2h2.8V22h3.7Z" />
    </svg>
  );
}

function XIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.94 8.5H3.56V19.5h3.38V8.5ZM5.25 3.5a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94ZM20.44 13.02c0-2.74-1.46-4.02-3.41-4.02-1.57 0-2.28.86-2.67 1.47V8.5h-3.38c.04.96 0 11 0 11h3.38v-6.14c0-.33.02-.66.12-.89.27-.66.88-1.35 1.9-1.35 1.34 0 1.88 1.02 1.88 2.52V19.5h3.38v-6.48Z" />
    </svg>
  );
}

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchProgram() {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!active) return;

      if (error || !data) {
        console.error('Error fetching programme:', error);
        setProgram(null);
        setNotFound(true);
      } else {
        setProgram(data as ProgramDetail);
      }

      setLoading(false);
    }

    fetchProgram();

    return () => {
      active = false;
    };
  }, [slug]);

  async function copyPageLink() {
    if (!pageUrl) return;

    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      console.error('Unable to copy programme link:', error);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#00897B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#293241] font-medium">
            Loading programme...
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !program) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold font-['Bricolage_Grotesque'] mb-4">
            Programme Not Found
          </h1>

          <p className="text-[#0A0A0A]/70 mb-6">
            We could not find the programme you are looking for.
          </p>

          <Link
            href="/programs"
            className="inline-flex items-center gap-2 font-bold text-[#C62828] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programs
          </Link>
        </div>
      </main>
    );
  }

  const externalUrl = program.external_url?.trim();
  const shareTitle = encodeURIComponent(program.title);
  const shareLink = encodeURIComponent(pageUrl);
  const shareText = encodeURIComponent(
    `Take a look at this programme from ELI7 Foundation: ${program.title}`
  );

  return (
    <main className="min-h-screen bg-transparent text-[#293241]">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Back Navigation */}
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#C62828] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All Programs
        </Link>

        {/* Programme Introduction */}
        <section className="mb-8">
          <span className="inline-block bg-[#C62828] text-white text-xs font-bold uppercase tracking-widest px-3 py-2 border border-[#0A0A0A] mb-5">
            {program.category}
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold font-['Bricolage_Grotesque'] leading-tight mb-5">
            {program.title}
          </h1>

          <p className="text-lg md:text-xl text-[#0A0A0A]/75 leading-relaxed max-w-3xl">
            {program.short_description || program.description}
          </p>
        </section>

        {/* Programme Cover Image */}
        <section className="mb-8">
          <div className="relative aspect-video w-full overflow-hidden border-2 border-[#0A0A0A] bg-[#F4F1EA]">
            {program.hero_image ? (
              <img
                src={program.hero_image}
                alt={program.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#00897B]/10">
                <PlayCircle className="w-20 h-20 text-[#00897B]" />
              </div>
            )}
          </div>
        </section>

        {/* External Recording or Resource */}
        {externalUrl && (
          <section className="mb-10">
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-[#C62828] text-white px-7 py-4 font-bold border-2 border-[#0A0A0A] shadow-[5px_5px_0px_#0A0A0A] hover:translate-y-1 hover:shadow-none transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              {program.external_link_label || 'Watch / Explore Programme'}
              <ArrowUpRight className="w-5 h-5" />
            </a>

            <p className="text-xs text-[#0A0A0A]/55 mt-3">
              Opens on an external platform.
            </p>
          </section>
        )}

        {/* Programme Description */}
        <section className="max-w-3xl mb-12">
          <details className="group">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 border-b border-[#0A0A0A]/20 py-5">
              <span className="text-2xl md:text-3xl font-bold font-['Bricolage_Grotesque']">
                About This Programme
              </span>

              <span className="text-[#C62828] font-bold text-sm whitespace-nowrap">
                <span className="group-open:hidden">See more +</span>
                <span className="hidden group-open:inline">See less −</span>
              </span>
            </summary>

            <div className="pt-6 space-y-5 text-[#0A0A0A]/75 leading-relaxed">
              {program.description && (
                <p className="text-base md:text-lg whitespace-pre-line">
                  {program.description}
                </p>
              )}

              {program.content && (
                <div className="whitespace-pre-line">
                  {program.content}
                </div>
              )}
            </div>
          </details>
        </section>

        {/* Inclusion Statement */}
        <section className="border-l-4 border-[#00897B] pl-5 py-2 mb-12 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold font-['Bricolage_Grotesque'] mb-3">
            Inclusion means full access—including the digital world.
          </h2>

          <p className="text-[#0A0A0A]/75 leading-relaxed">
            For too long, support for persons with disabilities has stopped at
            basic relief or isolated aid, leaving too many locked out of the
            digital skills, education, and opportunities shaping everyday life.
            True inclusion means participating as equal members of society—not
            on the sidelines. We advocate for the meaningful inclusion of
            persons with disabilities, particularly women and girls, ensuring
            full access to digital awareness, technology, healthcare, and
            community leadership. Everyone deserves the opportunity to learn,
            contribute, and help shape the future.
          </p>
        </section>

        {/* Social Sharing */}
        <section className="border-t border-b border-[#0A0A0A]/15 py-8 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-['Bricolage_Grotesque']">
                Share this Programme
              </h2>

              <p className="text-sm text-[#0A0A0A]/65 mt-1">
                Help someone discover this initiative.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/?text=${shareText}%20${shareLink}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                title="WhatsApp"
                className="w-11 h-11 flex items-center justify-center border-2 border-[#0A0A0A] bg-[#25D366] text-white hover:-translate-y-1 transition-transform"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                title="Facebook"
                className="w-11 h-11 flex items-center justify-center border-2 border-[#0A0A0A] bg-[#1877F2] text-white hover:-translate-y-1 transition-transform"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareLink}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                title="X"
                className="w-11 h-11 flex items-center justify-center border-2 border-[#0A0A0A] bg-black text-white hover:-translate-y-1 transition-transform"
              >
                <XIcon className="w-5 h-5" />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareLink}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                title="LinkedIn"
                className="w-11 h-11 flex items-center justify-center border-2 border-[#0A0A0A] bg-[#0A66C2] text-white hover:-translate-y-1 transition-transform"
              >
                <LinkedInIcon className="w-5 h-5" />
              </a>

              <a
                href={`https://t.me/share/url?url=${shareLink}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Telegram"
                title="Telegram"
                className="w-11 h-11 flex items-center justify-center border-2 border-[#0A0A0A] bg-[#229ED9] text-white hover:-translate-y-1 transition-transform"
              >
                <Send className="w-5 h-5" />
              </a>

              <a
                href={`mailto:?subject=${shareTitle}&body=${shareText}%20${shareLink}`}
                aria-label="Share by email"
                title="Email"
                className="w-11 h-11 flex items-center justify-center border-2 border-[#0A0A0A] bg-[#00897B] text-white hover:-translate-y-1 transition-transform"
              >
                <Mail className="w-5 h-5" />
              </a>

              <button
                type="button"
                onClick={copyPageLink}
                disabled={!pageUrl}
                aria-label="Copy programme link"
                title="Copy link"
                className="w-11 h-11 flex items-center justify-center border-2 border-[#0A0A0A] bg-[#FFD23F] text-[#293241] hover:-translate-y-1 transition-transform disabled:opacity-50"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {copied && (
            <p className="text-sm text-[#00897B] font-semibold mt-4">
              Programme link copied successfully.
            </p>
          )}
        </section>

        {/* More Programs */}
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 font-bold text-[#C62828] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Explore More Programs
        </Link>
      </div>
    </main>
  );
}