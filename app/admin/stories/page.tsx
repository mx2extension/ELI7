
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import {
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  X,
  Calendar,
  MapPin,
  User,
  RefreshCw,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react';

interface Story {
  id: string;
  title: string;
  slug: string | null;
  story_text: string;
  beneficiary_name: string | null;
  location: string | null;
  image_url: string | null;
  avatar: string | null;
  status: 'pending' | 'approved' | 'rejected';
  consent: boolean;
  created_at: string;
  published_at: string | null;
}

type Filter = 'all' | 'pending' | 'approved' | 'rejected';

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

function StoryAvatar({
  avatar,
  imageUrl,
  title,
  className = '',
}: {
  avatar: string | null;
  imageUrl: string | null;
  title: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={title}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  if (avatar?.startsWith('http')) {
    return (
      <img
        src={avatar}
        alt="Story contributor avatar"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const generatedAvatar = avatar
    ? getAvatarImage(avatar)
    : null;

  if (generatedAvatar) {
    return (
      <img
        src={generatedAvatar}
        alt="Story contributor avatar"
        className={`h-full w-full object-contain ${className}`}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      {avatar && !avatar.startsWith('eli7-') ? (
        <span className="text-4xl">{avatar}</span>
      ) : (
        <User className="h-8 w-8 text-[#293241]/30" />
      )}
    </div>
  );
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // LOAD STORIES
  const fetchStories = async () => {
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase
      .from('impact_stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setMessage(`Could not load stories: ${error.message}`);
    } else {
      setStories((data || []) as Story[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // APPROVE OR REJECT STORY
  const updateStatus = async (
    story: Story,
    status: 'approved' | 'rejected'
  ) => {
    const updates: Record<string, unknown> = { status };

    if (status === 'approved') {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('impact_stories')
      .update(updates)
      .eq('id', story.id)
      .select('id');

    if (error) {
      setMessage(`Could not update story: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      setMessage(
        'Story was not updated. Check your Supabase UPDATE permissions.'
      );
      return;
    }

    setSelectedStory(null);
    setMessage(`Story ${status} successfully.`);
    await fetchStories();
  };

  // DELETE STORY DIRECTLY FROM SUPABASE
  const deleteStory = async (story: Story) => {
    if (deletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${story.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(story.id);
    setMessage('Deleting story...');

    const { data, error } = await supabase
      .from('impact_stories')
      .delete()
      .eq('id', story.id)
      .select('id');

    if (error) {
      setMessage(`Delete failed: ${error.message}`);
      setDeletingId(null);
      return;
    }

    if (!data || data.length === 0) {
      setMessage(
        'Deletion was blocked by Supabase. Check the DELETE permission and Row Level Security policy for impact_stories.'
      );
      setDeletingId(null);
      return;
    }

    setStories((previous) =>
      previous.filter((item) => item.id !== story.id)
    );

    setSelectedStory(null);
    setEditingStory(null);
    setDeletingId(null);
    setMessage('Story permanently deleted successfully.');
  };

  // EDIT STORY
  const saveEdit = async () => {
    if (!editingStory) return;

    setSaving(true);

    const { data, error } = await supabase
      .from('impact_stories')
      .update({
        title: editingStory.title,
        beneficiary_name: editingStory.beneficiary_name,
        location: editingStory.location,
        story_text: editingStory.story_text,
      })
      .eq('id', editingStory.id)
      .select('id');

    setSaving(false);

    if (error) {
      setMessage(`Could not save changes: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      setMessage(
        'Changes were not saved. Check your Supabase UPDATE permissions.'
      );
      return;
    }

    setEditingStory(null);
    setSelectedStory(null);
    setMessage('Story updated successfully.');
    await fetchStories();
  };

  const filteredStories =
    filter === 'all'
      ? stories
      : stories.filter((story) => story.status === filter);

  const counts = {
    all: stories.length,
    pending: stories.filter((s) => s.status === 'pending').length,
    approved: stories.filter((s) => s.status === 'approved').length,
    rejected: stories.filter((s) => s.status === 'rejected').length,
  };

  const statusStyle = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-800';
    if (status === 'rejected') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}
        <div className="border-2 border-[#0A0A0A] bg-[#FFFFFE] p-6 shadow-[6px_6px_0px_#0A0A0A]">
          <Link
            href="/admin/dashboard"
            className="mb-3 inline-flex items-center gap-1 text-xs font-bold uppercase text-[#00897B] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-['Bricolage_Grotesque'] text-3xl font-extrabold text-[#293241] md:text-4xl">
                Stories Management
              </h1>
              <p className="mt-2 text-sm text-[#0A0A0A]/70">
                Review, approve and manage stories submitted to Extend Love Initiative Foundation.
              </p>
            </div>

            <button
              onClick={fetchStories}
              disabled={loading}
              className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#FFFFFE] px-4 py-2 text-xs font-bold uppercase shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] hover:text-white disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="flex items-center justify-between gap-3 border-2 border-[#0A0A0A] bg-white p-4 text-sm font-semibold">
            <span>{message}</span>
            <button
              onClick={() => setMessage('')}
              aria-label="Close message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'All Stories', count: counts.all },
            { label: 'Pending Review', count: counts.pending },
            { label: 'Approved', count: counts.approved },
            { label: 'Rejected', count: counts.rejected },
          ].map((item) => (
            <div
              key={item.label}
              className="border-2 border-[#0A0A0A] bg-[#FFFFFE] p-5 shadow-[4px_4px_0px_#0A0A0A]"
            >
              <p className="text-xs font-bold uppercase text-[#0A0A0A]/60">
                {item.label}
              </p>
              <p className="mt-2 text-3xl font-extrabold text-[#293241]">
                {item.count}
              </p>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as Filter[]).map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`border-2 border-[#0A0A0A] px-4 py-2 text-xs font-bold uppercase transition ${
                  filter === item
                    ? 'bg-[#293241] text-white shadow-[3px_3px_0px_#0A0A0A]'
                    : 'bg-white text-[#293241] hover:bg-[#F4F1EA]'
                }`}
              >
                {item} ({counts[item]})
              </button>
            )
          )}
        </div>

        {/* STORIES LIST */}
        {loading ? (
          <div className="border-2 border-[#0A0A0A] bg-white p-12 text-center font-bold text-[#293241]">
            Loading submissions...
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="space-y-3 border-2 border-[#0A0A0A] bg-white p-12 text-center shadow-[6px_6px_0px_#0A0A0A]">
            <BookOpen className="mx-auto h-10 w-10 text-[#C62828]" />
            <h2 className="text-xl font-extrabold text-[#293241]">
              No stories found
            </h2>
            <p className="text-sm text-[#0A0A0A]/60">
              There are no stories in this section yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="flex flex-col gap-5 border-2 border-[#0A0A0A] bg-white p-5 shadow-[5px_5px_0px_#0A0A0A] md:flex-row md:items-center"
              >
                {/* IMAGE */}
                <div className="h-24 w-24 shrink-0 overflow-hidden border-2 border-[#0A0A0A] bg-[#F4F1EA]">
                  <StoryAvatar
                    avatar={story.avatar}
                    imageUrl={story.image_url}
                    title={story.title}
                  />
                </div>

                {/* DETAILS */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-1 text-[10px] font-bold uppercase ${statusStyle(story.status)}`}
                    >
                      {story.status}
                    </span>
                    <span className="text-xs text-[#0A0A0A]/50">
                      {new Date(story.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#293241]">
                    {story.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-xs text-[#0A0A0A]/60">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {story.beneficiary_name || 'Anonymous'}
                    </span>

                    {story.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {story.location}
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-2 text-sm leading-relaxed text-[#0A0A0A]/70">
                    {story.story_text}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedStory(story)}
                    className="inline-flex items-center gap-1 border-2 border-[#0A0A0A] bg-white px-3 py-2 text-xs font-bold uppercase hover:bg-[#F4F1EA]"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>

                  {story.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(story, 'approved')}
                        className="inline-flex items-center gap-1 border-2 border-[#0A0A0A] bg-[#00897B] px-3 py-2 text-xs font-bold uppercase text-white hover:bg-[#00695C]"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(story, 'rejected')}
                        className="inline-flex items-center gap-1 border-2 border-[#0A0A0A] bg-[#C62828] px-3 py-2 text-xs font-bold uppercase text-white hover:bg-red-800"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteStory(story)}
                    disabled={deletingId === story.id}
                    className="inline-flex items-center gap-1 border-2 border-[#0A0A0A] bg-red-700 px-3 py-2 text-xs font-bold uppercase text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === story.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIEW STORY MODAL */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <div className="my-8 w-full max-w-3xl border-2 border-[#0A0A0A] bg-[#FFFFFE] shadow-[8px_8px_0px_#C62828]">
            <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] p-5">
              <h2 className="text-xl font-extrabold text-[#293241]">
                Story Submission
              </h2>
              <button
                onClick={() => setSelectedStory(null)}
                className="border-2 border-[#0A0A0A] p-1"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
              <span
                className={`inline-block px-3 py-1 text-xs font-bold uppercase ${statusStyle(selectedStory.status)}`}
              >
                {selectedStory.status}
              </span>

              <h3 className="text-3xl font-extrabold text-[#293241]">
                {selectedStory.title}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-[#0A0A0A]/60">
                <span>
                  <User className="mr-1 inline h-4 w-4" />
                  {selectedStory.beneficiary_name || 'Anonymous'}
                </span>

                {selectedStory.location && (
                  <span>
                    <MapPin className="mr-1 inline h-4 w-4" />
                    {selectedStory.location}
                  </span>
                )}

                <span>
                  <Calendar className="mr-1 inline h-4 w-4" />
                  {new Date(selectedStory.created_at).toLocaleDateString()}
                </span>
              </div>

              {(selectedStory.image_url || selectedStory.avatar) && (
                <div className="flex max-h-80 min-h-32 items-center justify-center overflow-hidden border-2 border-[#0A0A0A] bg-[#F4F1EA]">
                  <StoryAvatar
                    avatar={selectedStory.avatar}
                    imageUrl={selectedStory.image_url}
                    title={selectedStory.title}
                    className="max-h-80"
                  />
                </div>
              )}

              <div className="whitespace-pre-wrap text-base leading-8 text-[#0A0A0A]/80">
                {selectedStory.story_text}
              </div>

              <div className="border-t border-black/10 pt-4 text-xs text-[#0A0A0A]/60">
                Consent to review and possible publication:{' '}
                <strong>{selectedStory.consent ? 'Yes' : 'No'}</strong>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t-2 border-[#0A0A0A] p-5">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setEditingStory({ ...selectedStory });
                    setSelectedStory(null);
                  }}
                  className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-white px-4 py-2 text-xs font-bold uppercase"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>

                <button
                  onClick={() => deleteStory(selectedStory)}
                  disabled={deletingId === selectedStory.id}
                  className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-red-700 px-4 py-2 text-xs font-bold uppercase text-white disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingId === selectedStory.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedStory.status !== 'approved' && (
                  <button
                    onClick={() => updateStatus(selectedStory, 'approved')}
                    className="border-2 border-[#0A0A0A] bg-[#00897B] px-4 py-2 text-xs font-bold uppercase text-white"
                  >
                    Approve
                  </button>
                )}

                {selectedStory.status !== 'rejected' && (
                  <button
                    onClick={() => updateStatus(selectedStory, 'rejected')}
                    className="border-2 border-[#0A0A0A] bg-[#C62828] px-4 py-2 text-xs font-bold uppercase text-white"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STORY MODAL */}
      {editingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <div className="my-8 w-full max-w-2xl border-2 border-[#0A0A0A] bg-white shadow-[8px_8px_0px_#C62828]">
            <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] p-5">
              <h2 className="text-xl font-extrabold text-[#293241]">
                Edit Story
              </h2>

              <button
                onClick={() => setEditingStory(null)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase">
                  Story Title
                </span>
                <input
                  value={editingStory.title}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      title: e.target.value,
                    })
                  }
                  className="w-full border-2 border-[#0A0A0A] p-3 outline-none focus:border-[#C62828]"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase">Name</span>
                <input
                  value={editingStory.beneficiary_name || ''}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      beneficiary_name: e.target.value || null,
                    })
                  }
                  className="w-full border-2 border-[#0A0A0A] p-3 outline-none focus:border-[#C62828]"
                  placeholder="Anonymous"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase">Location</span>
                <input
                  value={editingStory.location || ''}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      location: e.target.value || null,
                    })
                  }
                  className="w-full border-2 border-[#0A0A0A] p-3 outline-none focus:border-[#C62828]"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase">
                  Full Story
                </span>
                <textarea
                  rows={12}
                  value={editingStory.story_text}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      story_text: e.target.value,
                    })
                  }
                  className="w-full border-2 border-[#0A0A0A] p-3 outline-none focus:border-[#C62828]"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t-2 border-[#0A0A0A] p-5">
              <button
                onClick={() => setEditingStory(null)}
                className="border-2 border-[#0A0A0A] px-4 py-2 text-xs font-bold uppercase"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                disabled={
                  saving ||
                  !editingStory.title.trim() ||
                  !editingStory.story_text.trim()
                }
                className="border-2 border-[#0A0A0A] bg-[#293241] px-5 py-2 text-xs font-bold uppercase text-white disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
