
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Heart, Calendar, ArrowUpRight, MapPin, UserRound } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

interface Story {
  id: string;
  title: string;
  slug: string | null;
  story_text: string;
  beneficiary_name: string | null;
  location: string | null;
  image_url: string | null;
  avatar: string | null;
  created_at: string;
  published_at: string | null;
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

function getAvatarImage(avatarId: string) {
  const match = avatarId.match(
    /^eli7-(men|women|hijab|headcover)-(\d+)$/
  );

  if (!match) return null;

  const [, category, number] = match;
  const index = Number(number) - 1;

  if (index < 0) return null;

  const top =
    category === 'men'
      ? menStyles[index % menStyles.length]
      : category === 'women'
        ? womenStyles[index % womenStyles.length]
        : category === 'hijab'
          ? 'hijab'
          : 'turban';

  return createAvatar(avataaars, {
    seed: avatarId,
    top: [top],
    topProbability: 100,
    eyes: ['happy'],
    mouth: ['smile'],
    skinColor: [skinTones[index % skinTones.length]],
    hairColor: [hairColors[index % hairColors.length]],
    hatColor: [
      headCoveringColors[index % headCoveringColors.length],
    ],
    clothesColor: [
      clothingColors[index % clothingColors.length],
    ],
    accessoriesProbability: 0,
    facialHairProbability: 0,
  }).toDataUri();
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        const { data, error } = await supabase
          .from('impact_stories')
          .select(
            'id, title, slug, story_text, beneficiary_name, location, image_url, avatar, created_at, published_at'
          )
          .eq('status', 'approved')
          .not('slug', 'is', null)
          .order('published_at', {
            ascending: false,
            nullsFirst: false,
          })
          .order('created_at', { ascending: false });

        if (error) throw error;

        const validStories = ((data || []) as Story[]).filter(
          (story) => Boolean(story.slug?.trim())
        );

        setStories(validStories);
      } catch (err) {
        console.error('Stories fetch error:', err);

        setErrorMsg(
          err instanceof Error
            ? err.message
            : 'Unable to load stories.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto space-y-12">

      {/* PAGE HEADER */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
          <Heart className="w-4 h-4" />
          Stories of Impact
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">
          Stories That Inspire
        </h1>

        <p className="text-lg text-[#0A0A0A]/80 leading-relaxed">
          Real experiences, real people and real change. Read the stories
          of individuals and communities whose lives have been touched
          through the work of Extend Love Initiative Humanitarian Foundation.
        </p>

        <Link
          href="/stories/submit"
          className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-5 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] transition-colors"
        >
          Share Your Story
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* DATABASE ERROR */}
      {errorMsg && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 font-bold text-sm">
          Database Error: {errorMsg}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center font-bold text-[#293241]">
          Loading stories...
        </div>

      ) : stories.length === 0 && !errorMsg ? (

        /* EMPTY STATE */
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center space-y-4">
          <Heart className="w-10 h-10 text-[#C62828] mx-auto" />

          <p className="text-lg font-bold text-[#293241]">
            No stories published yet.
          </p>

          <p className="text-sm text-[#0A0A0A]/70">
            Our Stories of Impact will appear here as submissions are
            reviewed and approved.
          </p>

          <Link
            href="/stories/submit"
            className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-5 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]"
          >
            Share Your Story
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      ) : (

        /* RESPONSIVE STORIES GRID */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {stories.map((story) => {
            const avatarImage = story.avatar
              ? getAvatarImage(story.avatar)
              : null;

            const excerpt =
              story.story_text.length > 180
                ? `${story.story_text.slice(0, 180).trim()}...`
                : story.story_text;

            return (
              /* ENTIRE CARD IS CLICKABLE */
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                aria-label={`Read story: ${story.title}`}
                className="w-full min-w-0 bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col sm:flex-row items-stretch gap-0 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-7 overflow-hidden group hover:-translate-y-1 hover:shadow-[10px_10px_0px_#0A0A0A] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00897B]"
              >

                {/* STORY IMAGE / AVATAR */}
                <div className="w-full h-52 sm:h-auto sm:w-[34%] sm:min-w-[140px] md:min-w-[180px] flex-shrink-0 border-2 border-[#0A0A0A] overflow-hidden bg-[#F4F1EA]">

                  {story.image_url ? (
                    <img
                      src={story.image_url}
                      alt={story.beneficiary_name || 'Story contributor'}
                      className="w-full h-full min-h-[200px] sm:min-h-[220px] md:min-h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : avatarImage ? (
                    <div className="w-full h-full min-h-[200px] sm:min-h-[220px] md:min-h-[260px] flex items-center justify-center">
                      <img
                        src={avatarImage}
                        alt={story.beneficiary_name || 'Story contributor avatar'}
                        className="w-full h-full max-h-[260px] object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full min-h-[200px] sm:min-h-[220px] md:min-h-[260px] flex items-center justify-center">
                      <UserRound className="w-16 h-16 text-[#293241]/40" />
                    </div>
                  )}

                </div>

                {/* STORY TEXT */}
                <div className="flex flex-col justify-center flex-grow min-w-0 gap-3 py-5 sm:py-1">

                  {/* DATE */}
                  <span className="flex items-center gap-1.5 text-xs md:text-sm text-[#0A0A0A]/60 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#C62828] flex-shrink-0" />

                    {new Date(
                      story.published_at || story.created_at
                    ).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  {/* CONTRIBUTOR */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#0A0A0A]/60">
                    {story.beneficiary_name && (
                      <span className="font-bold text-[#293241]">
                        {story.beneficiary_name}
                      </span>
                    )}

                    {story.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C62828]" />
                        {story.location}
                      </span>
                    )}
                  </div>

                  {/* HEADLINE */}
                  <h2 className="text-xl md:text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug group-hover:text-[#00897B] transition-colors">
                    {story.title}
                  </h2>

                  {/* EXCERPT */}
                  <p className="text-sm text-[#0A0A0A]/75 line-clamp-3 leading-relaxed">
                    {excerpt}
                  </p>

                  {/* READ MORE */}
                  <span className="inline-flex items-center gap-1.5 text-[#00897B] font-extrabold text-xs uppercase underline underline-offset-4 w-fit mt-1">
                    Read More
                    <ArrowUpRight className="w-4 h-4" />
                  </span>

                </div>

              </Link>
            );
          })}

        </div>
      )}

    </div>
  );
}
