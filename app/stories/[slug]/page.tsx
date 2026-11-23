
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Share2,
  Link2,
  Check,
  MessageCircle,
  Send,
  Mail,
  X,
  Smartphone,
  User,
  MapPin,
} from 'lucide-react';

interface Story {
  id: string;
  title: string;
  slug: string;
  story_text: string;
  beneficiary_name?: string | null;
  location?: string | null;
  image_url?: string | null;
  avatar?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  published_at?: string | null;
}

const skinTones = [
  'ffdbb4',
  'edb98a',
  'd08b5b',
  'ae5d29',
  '614335',
  'f8d25c',
];

const hairColors = [
  '2c1b18',
  '724133',
  'a55728',
  'b58143',
  'd6b370',
];

const headCoveringColors = [
  '77311b',
  'c62828',
  '293241',
  'e8b4b8',
  'f1c27d',
  '5b8065',
];

const clothingColors = [
  'c62828',
  '293241',
  'e8b4b8',
  '5b8065',
  'f1c27d',
  'ffffff',
];

const getAvatarImage = (avatarId: string) => {
  const match = avatarId.match(
    /^eli7-(men|women|hijab|headcover)-(\d+)$/
  );

  if (!match) return null;

  const [, category, number] = match;
  const index = Number(number) - 1;

  const menStyles = [
    'shortFlat',
    'shortRound',
    'shortWaved',
    'theCaesar',
    'theCaesarAndSidePart',
    'shavedSides',
    'shortCurly',
    'sides',
    'dreads',
    'shaggyMullet',
  ] as const;

  const womenStyles = [
    'bigHair',
    'bob',
    'bun',
    'curly',
    'curvy',
    'frida',
    'fro',
    'froBand',
    'longButNotTooLong',
    'miaWallace',
  ] as const;

  const topStyles = {
    men: menStyles[index % menStyles.length],
    women: womenStyles[index % womenStyles.length],
    hijab: 'hijab',
    headcover: 'turban',
  } as const;

  const top = topStyles[category as keyof typeof topStyles];

  const skinColor = skinTones[index % skinTones.length];
  const hairColor = hairColors[index % hairColors.length];
  const hatColor =
    headCoveringColors[index % headCoveringColors.length];

  const colorIndex =
    category === 'men'
      ? index % clothingColors.length
      : category === 'women'
        ? (index + 2) % clothingColors.length
        : (index + 4) % clothingColors.length;

  return createAvatar(avataaars, {
    seed: avatarId,
    top: [top],
    topProbability: 100,
    eyes: ['happy'],
    mouth: ['smile'],
    skinColor: [skinColor],
    hairColor: [hairColor],
    hatColor: [hatColor],
    clothesColor: [clothingColors[colorIndex]],
    accessoriesProbability: 0,
    facialHairProbability: 0,
  }).toDataUri();
};

export default function StoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [story, setStory] = useState<Story | null>(null);
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

      window.scrollTo({
        top: 0,
        behavior: 'instant' as ScrollBehavior,
      });
    }
  }, [slug]);

  useEffect(() => {
    async function fetchStory() {
      if (!slug) return;

      setLoading(true);
      setStory(null);
      setImgError(false);

      const { data, error } = await supabase
        .from('impact_stories')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'approved')
        .single();

      if (error) {
        setStory(null);
      } else {
        setStory(data as Story);
      }

      setLoading(false);
    }

    fetchStory();
  }, [slug]);

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: 'instant' as ScrollBehavior,
        });
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto text-center font-bold text-[#293241]">
        Loading story...
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto text-center space-y-5">
        <BookOpen className="w-12 h-12 mx-auto text-[#C62828]" />
        <h1 className="text-3xl font-extrabold text-[#293241]">
          Story not found
        </h1>
        <p className="text-[#0A0A0A]/70">
          This story may have been removed or is no longer available.
        </p>
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-4 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Stories
        </Link>
      </div>
    );
  }

  const currentUrl =
    shareUrl ||
    (typeof window !== 'undefined' ? window.location.href : '');

  const storySummary =
    story.story_text.length > 220
      ? `${story.story_text.slice(0, 220).trim()}...`
      : story.story_text;

  const formattedMessage = `${story.title}\n\n${storySummary}\n\nRead the full story here: ${currentUrl}`;

  const avatarImage = story.avatar
    ? getAvatarImage(story.avatar)
    : null;

  const isOldAvatar = Boolean(
    story.avatar &&
    !avatarImage &&
    !story.avatar.startsWith('http')
  );

  const copyText = async (
    text: string,
    onDone: () => void
  ) => {
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
          title: story.title,
          text: `${story.title} — ${storySummary}`,
          url: currentUrl,
        });
      } catch {
        // User dismissed the system share menu.
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
      )}&text=${encodeURIComponent(story.title)}`,
      icon: Send,
    },
    {
      name: 'Email',
      subtitle: 'Send directly by email',
      href: `mailto:?subject=${encodeURIComponent(
        story.title
      )}&body=${encodeURIComponent(formattedMessage)}`,
      icon: Mail,
    },
    {
      name: 'X (Twitter)',
      subtitle: 'Share as a post or DM',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${story.title} ${currentUrl}`
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

      {/* Back Button */}
      <div>
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Stories
        </Link>
      </div>

      {/* Story Heading */}
      <article className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] p-8 md:p-12 space-y-6">

        <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
          <BookOpen className="w-4 h-4" />
          Story of Impact
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight leading-tight">
          {story.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#0A0A0A]/60 pt-4 border-t-2 border-[#0A0A0A]/10">

          {story.beneficiary_name && (
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#C62828]" />
              {story.beneficiary_name}
            </span>
          )}

          {story.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C62828]" />
              {story.location}
            </span>
          )}

          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#C62828]" />
            Published on{' '}
            {new Date(
              story.published_at || story.created_at
            ).toLocaleDateString()}
          </span>
        </div>
      </article>

      {/* Story Photo or Avatar */}
      {(story.image_url || avatarImage || story.avatar) && (
        <div className="flex justify-center">
          <div className="bg-[#F4F1EA] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] p-5">
            {story.image_url && !imgError ? (
              <img
                src={story.image_url}
                alt={story.title}
                onError={() => setImgError(true)}
                className="w-full max-w-md max-h-[500px] object-cover"
              />
            ) : avatarImage ? (
              <img
                src={avatarImage}
                alt="Story contributor avatar"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white"
              />
            ) : story.avatar?.startsWith('http') ? (
              <img
                src={story.avatar}
                alt="Story contributor avatar"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white object-cover"
              />
            ) : (
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white flex items-center justify-center text-[#293241]">
                <User className="w-20 h-20" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Story Content */}
      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 md:p-12">
        <div className="text-[#0A0A0A]/80 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
          {story.story_text}
        </div>
      </div>

      {/* Bottom Share Section */}
      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-6 md:p-8 space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Finished reading? Pass this story along.
            </h2>
            <p className="text-sm text-[#0A0A0A]/70">
              Send this story to someone or choose where you want to share it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShareOpen((prev) => !prev)}
            className="inline-flex items-center justify-center gap-2 bg-[#FFD23F] text-[#0A0A0A] font-extrabold text-xs uppercase px-5 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <Share2 className="w-4 h-4" />
            Send / Share to Someone
          </button>
        </div>

        {shareOpen && (
          <div className="pt-4 mt-2 border-t-2 border-[#0A0A0A]/10 bg-[#F4F1EA] p-5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] space-y-4">

            <div className="flex items-center justify-between border-b-2 border-[#0A0A0A]/10 pb-3">
              <div>
                <h3 className="text-sm font-extrabold uppercase text-[#293241]">
                  Choose Where to Send This Story
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

    </div>
  );
}
