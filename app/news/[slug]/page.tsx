'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Newspaper,
  Calendar,
  Share2,
  Link2,
  Check,
  MessageCircle,
  Send,
  Mail,
  X,
  Smartphone,
} from 'lucide-react';

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

  const [shareOpen, setShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [slug]);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      setLoading(true);
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        .single();
      setArticle(data);
      setLoading(false);
    }
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto text-center font-bold text-[#293241]">
        Loading article...
      </div>
    );
  }

  if (!article) notFound();

  const currentUrl =
    shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const formattedMessage = `${article.title}\n\n${article.excerpt}\n\nRead here: ${currentUrl}`;

  const copyText = async (text: string, onDone: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      onDone();
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      onDone();
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
    if (!currentUrl) return;
    copyText(formattedMessage, () => {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    });
  };

  const handleSystemShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `${article.title} — ${article.excerpt}`,
          url: currentUrl,
        });
      } catch {
        // User dismissed system share sheet
      }
    } else {
      handleCopyMessage();
    }
  };

  const platforms = [
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
      )}&text=${encodeURIComponent(article.title)}`,
      icon: Send,
    },
    {
      name: 'Email',
      subtitle: 'Send directly by email',
      href: `mailto:?subject=${encodeURIComponent(
        article.title
      )}&body=${encodeURIComponent(formattedMessage)}`,
      icon: Mail,
    },
    {
      name: 'X (Twitter)',
      subtitle: 'Share as a post or DM',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${article.title} ${currentUrl}`
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
  ];

  return (
    <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto space-y-10">
      <div>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>

      <article className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] p-8 md:p-12 space-y-6">
        <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
          <Newspaper className="w-4 h-4" /> Press Release
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-lg md:text-xl text-[#0A0A0A]/80 font-medium leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A]/60 pt-4 border-t-2 border-[#0A0A0A]/10">
          <Calendar className="w-4 h-4 text-[#C62828]" />
          Published on {new Date(article.created_at).toLocaleDateString()}
        </div>
      </article>

      {article.image_url && !imgError && (
        <div className="bg-[#F4F1EA] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] max-h-[450px] overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {article.content && (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 md:p-12 space-y-6">
          <div className="text-[#0A0A0A]/80 leading-relaxed space-y-4 text-base md:text-lg whitespace-pre-wrap">
            {article.content}
          </div>
        </div>
      )}

      {/* Bottom Share Section — Shown After Reading */}
      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-6 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Finished reading? Pass this story along.
            </h2>
            <p className="text-sm text-[#0A0A0A]/70">
              Send this update to someone or choose where you want to share it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShareOpen((prev) => !prev)}
            className="inline-flex items-center justify-center gap-2 bg-[#FFD23F] text-[#0A0A0A] font-extrabold text-xs uppercase px-5 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <Share2 className="w-4 h-4" /> Send / Share to Someone
          </button>
        </div>

        {shareOpen && (
          <div className="pt-4 mt-2 border-t-2 border-[#0A0A0A]/10 bg-[#F4F1EA] p-5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#0A0A0A]/10 pb-3">
              <div>
                <h3 className="text-sm font-extrabold uppercase text-[#293241]">
                  Choose Where to Send This Article
                </h3>
                <p className="text-xs text-[#0A0A0A]/70">
                  Pick a platform below to send it to someone, or copy the message to paste anywhere.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                aria-label="Close share options"
                className="p-1.5 bg-[#FFFFFE] border-2 border-[#0A0A0A] hover:bg-[#C62828] hover:text-white transition-colors cursor-pointer"
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
                    <Check className="w-3.5 h-3.5 text-[#00897B]" /> Message
                    Copied
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" /> Copy Headline + Link
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
                    <Check className="w-3.5 h-3.5 text-[#00897B]" /> Link Copied
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" /> Copy Link Only
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}