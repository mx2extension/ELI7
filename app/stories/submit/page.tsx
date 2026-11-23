
'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase/client';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  User,
  MapPin,
  BookOpen,
  Heart,
  Sparkles,
  X,
  RefreshCw,
} from 'lucide-react';

type AvatarCategory = 'men' | 'women' | 'hijab' | 'headcover';

interface AvatarOption {
  id: string;
  category: AvatarCategory;
  label: string;
}

const skinTones = [
  'ffdbb4', 'edb98a', 'd08b5b', 'ae5d29', '614335', 'f8d25c',
];

const hairColors = [
  '2c1b18', '724133', 'a55728', 'b58143', 'd6b370',
];

const headCoveringColors = [
  '77311b', 'c62828', '293241', 'e8b4b8', 'f1c27d', '5b8065',
];

const clothingColors = [
  'c62828', '293241', 'e8b4b8', '5b8065', 'f1c27d', 'ffffff',
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

const avatarOptions: AvatarOption[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `eli7-men-${String(i + 1).padStart(2, '0')}`,
    category: 'men' as const,
    label: `Man ${i + 1}`,
  })),
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `eli7-women-${String(i + 1).padStart(2, '0')}`,
    category: 'women' as const,
    label: `Woman ${i + 1}`,
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `eli7-hijab-${String(i + 1).padStart(2, '0')}`,
    category: 'hijab' as const,
    label: `Hijab ${i + 1}`,
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `eli7-headcover-${String(i + 1).padStart(2, '0')}`,
    category: 'headcover' as const,
    label: `Head Covering ${i + 1}`,
  })),
];

const getAvatarImage = (avatarId: string) => {
  const match = avatarId.match(
    /^eli7-(men|women|hijab|headcover)-(\d+)$/
  );

  if (!match) return null;

  const [, category, number] = match;
  const index = Number(number) - 1;

  const topStyles = {
    men: menStyles[index % menStyles.length],
    women: womenStyles[index % womenStyles.length],
    hijab: 'hijab',
    headcover: 'turban',
  } as const;

  const top = topStyles[category as keyof typeof topStyles];

  const skinColor = skinTones[index % skinTones.length];
  const hairColor = hairColors[index % hairColors.length];
  const hatColor = headCoveringColors[index % headCoveringColors.length];

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

const titleSuggestions = [
  'How ELI7 Foundation Made a Difference in My Life',
  'The Support That Changed My Story',
  'How ELI7 Helped Me Find Hope Again',
  'A Helping Hand When I Needed It Most',
  'The Difference Your Support Made',
  'My Experience with Extend Love Initiative Foundation',
  'How ELI7 Inspired a New Beginning for Me',
  'A Story of Hope, Support and Impact',
  'What ELI7’s Support Means to Me',
  'Because Someone Cared, My Story Changed',
  'How ELI7 Brought Hope to My Community',
  'The Impact of ELI7 in My Life',
];

const steps = [
  'Choose Your Picture',
  'Give Your Story a Title',
  'Tell Your Story',
  'Photo & Review',
];

const makeSlug = (title: string) => {
  const baseSlug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'impact-story';

  const uniqueCode = Math.random().toString(36).slice(2, 10);

  return `${baseSlug}-${uniqueCode}`;
};

export default function SubmitStoryPage() {
  const [step, setStep] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState('eli7-men-01');
  const [avatarCategory, setAvatarCategory] = useState('all');
  const [visibleAvatars, setVisibleAvatars] = useState(24);

  const [title, setTitle] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [location, setLocation] = useState('');
  const [storyText, setStoryText] = useState('');

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [consent, setConsent] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((current) =>
        (current + 1) % titleSuggestions.length
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview('');
      return;
    }

    const previewUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [photoFile]);

  const filteredAvatars =
    avatarCategory === 'all'
      ? avatarOptions
      : avatarOptions.filter(
          (avatar) => avatar.category === avatarCategory
        );

  const displayedAvatars = filteredAvatars.slice(0, visibleAvatars);
  const selectedAvatarImage = getAvatarImage(selectedAvatar);

  const selectCategory = (category: string) => {
    setAvatarCategory(category);
    setVisibleAvatars(24);
  };

  const goToStep = (nextStep: number) => {
    setError('');
    setStep(nextStep);
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError('');

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, WEBP or GIF picture.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Your photo must be 5MB or smaller.');
      event.target.value = '';
      return;
    }

    setPhotoFile(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const handleContinue = () => {
    setError('');

    if (step === 0 && !photoFile && !selectedAvatar) {
      setError('Please upload a picture or select an avatar.');
      return;
    }

    if (step === 1 && !title.trim()) {
      setError('Please enter a title for your story.');
      return;
    }

    if (step === 2) {
      if (!beneficiaryName.trim()) {
        setError('Please enter your name. This field is required.');
        return;
      }

      if (!storyText.trim()) {
        setError('Please tell us your experience with ELI7 Foundation.');
        return;
      }

      if (storyText.trim().length < 30) {
        setError('Please share a little more about your experience.');
        return;
      }
    }

    goToStep(step + 1);
  };

  const handleSubmit = async () => {
    setError('');

    if (!beneficiaryName.trim()) {
      setError('Your name is required.');
      goToStep(2);
      return;
    }

    if (!title.trim() || !storyText.trim()) {
      setError('Please complete your story before submitting.');
      return;
    }

    if (!consent) {
      setError('Please confirm that you have permission to share this story.');
      return;
    }

    if (!photoFile && !selectedAvatar) {
      setError('Please select an avatar or upload your picture.');
      goToStep(0);
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;

      if (photoFile) {
        const fileExtension =
          photoFile.name.split('.').pop()?.toLowerCase() || 'jpg';

        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}.${fileExtension}`;

        const filePath = `submissions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('impact-story-photos')
          .upload(filePath, photoFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: photoFile.type,
          });

        if (uploadError) {
          throw new Error(`Photo upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('impact-story-photos')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('impact_stories')
        .insert({
          title: title.trim(),
          slug: makeSlug(title.trim()),
          story_text: storyText.trim(),
          beneficiary_name: beneficiaryName.trim(),
          location: location.trim() || null,
          image_url: imageUrl,
          avatar: imageUrl ? null : selectedAvatar,
          status: 'pending',
          consent: true,
        });

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen px-6 py-20 flex items-center justify-center">
        <div className="max-w-xl w-full bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] p-8 md:p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#FFD23F] border-2 border-[#0A0A0A] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-11 h-11 text-[#293241]" />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#C62828]">
              Extend Love Initiative Foundation
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Thank You for Sharing!
            </h1>
            <p className="text-[#0A0A0A]/75 leading-relaxed">
              Your story has been received successfully. Our team will
              review it before it appears in our Stories of Impact section.
            </p>
          </div>

          <div className="bg-[#F4F1EA] border-2 border-[#0A0A0A] p-5 text-sm text-[#293241]">
            Thank you for helping us share the impact of extending love
            and support to others.
          </div>

          <a
            href="/stories"
            className="inline-flex items-center justify-center gap-2 bg-[#C62828] text-white font-extrabold text-xs uppercase px-6 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            View Stories of Impact
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-16 px-5 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-extrabold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
            <Heart className="w-4 h-4" />
            Your Voice Matters
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">
            Share Your Story of Impact
          </h1>

          <p className="text-sm md:text-base text-[#0A0A0A]/75 leading-relaxed">
            Has Extend Love Initiative Foundation made a difference in
            your life, your family or your community? We would love to
            hear about your experience.
          </p>
        </div>

        {/* Progress */}
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[5px_5px_0px_#0A0A0A] p-5 md:p-6 space-y-4">
          <div className="flex justify-between items-center gap-3">
            <span className="text-xs font-extrabold uppercase text-[#293241]">
              Step {step + 1} of 4
            </span>
            <span className="text-xs font-bold text-[#C62828]">
              {Math.round(((step + 1) / 4) * 100)}% completed
            </span>
          </div>

          <div className="h-3 bg-[#F4F1EA] border-2 border-[#0A0A0A] overflow-hidden">
            <div
              className="h-full bg-[#C62828] transition-all duration-500"
              style={{ width: `${((step + 1) / 4) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`text-center text-[9px] md:text-[10px] font-extrabold uppercase ${
                  index <= step ? 'text-[#C62828]' : 'text-[#0A0A0A]/35'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 text-sm font-bold flex items-start gap-2">
            <X className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <section
          key={step}
          className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-5 md:p-9 space-y-7 animate-[fadeIn_.35s_ease-out]"
        >
          {/* STEP 1: AVATAR OR PERSONAL PHOTO */}
          {step === 0 && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#C62828]">
                  <User className="w-5 h-5" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    First, choose how you want to be represented
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  Choose Your Picture
                </h2>

                <p className="text-sm text-[#0A0A0A]/70 leading-relaxed">
                  You can upload your own photograph or choose one of
                  our illustrated avatars. You do not need to do both.
                </p>
              </div>

              {/* PERSONAL PHOTO UPLOAD - NOW VISIBLE IN STEP 1 */}
              <div className="border-2 border-[#0A0A0A] bg-[#F4F1EA] p-5 md:p-7 space-y-4">
                <div className="text-center space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-[#C62828]" />
                  <h3 className="font-extrabold text-[#293241]">
                    Upload Your Own Photograph
                  </h3>
                  <p className="text-xs text-[#0A0A0A]/65">
                    Prefer to use your real picture? Upload it here.
                    JPG, PNG, WEBP or GIF. Maximum 5MB.
                  </p>
                </div>

                {photoPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={photoPreview}
                      alt="Your uploaded photograph preview"
                      className="w-40 h-40 rounded-full object-cover border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A]"
                    />

                    <p className="text-xs font-extrabold text-[#00897B]">
                      Your photograph is selected.
                    </p>

                    <button
                      type="button"
                      onClick={removePhoto}
                      className="text-xs font-extrabold uppercase text-[#C62828] underline"
                    >
                      Remove picture and choose an avatar
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 w-full py-7 px-4 bg-white border-2 border-dashed border-[#293241] hover:bg-[#FFD23F]/30 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 text-[#C62828]" />
                    <span className="text-xs font-extrabold uppercase text-[#293241]">
                      Click to Upload Your Picture
                    </span>
                    <span className="text-[10px] text-[#0A0A0A]/55">
                      Select a picture from your device
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px bg-[#0A0A0A]/20 flex-1" />
                <span className="text-xs font-extrabold uppercase text-[#0A0A0A]/50">
                  Or choose an avatar
                </span>
                <div className="h-px bg-[#0A0A0A]/20 flex-1" />
              </div>

              {/* Selected avatar */}
              <div className="bg-[#F4F1EA] border-2 border-[#0A0A0A] p-5 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={selectedAvatarImage || ''}
                  alt="Your selected avatar"
                  className="w-24 h-24 rounded-full bg-white border-2 border-[#0A0A0A]"
                />
                <div className="text-center sm:text-left">
                  <p className="font-extrabold text-[#293241]">
                    Your selected avatar
                  </p>
                  <p className="text-xs text-[#0A0A0A]/65 mt-1">
                    {photoFile
                      ? 'Your uploaded photograph will be used instead.'
                      : 'This avatar will represent you if you do not upload a photograph.'}
                  </p>
                </div>
              </div>

              {/* Avatar categories */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'men', label: 'Men' },
                  { id: 'women', label: 'Women' },
                  { id: 'hijab', label: 'Hijab & Modest' },
                  { id: 'headcover', label: 'Head Coverings' },
                ].map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => selectCategory(category.id)}
                    className={`px-3 py-2 text-[10px] md:text-xs font-extrabold uppercase border-2 border-[#0A0A0A] transition-colors ${
                      avatarCategory === category.id
                        ? 'bg-[#293241] text-white shadow-[2px_2px_0px_#0A0A0A]'
                        : 'bg-[#F4F1EA] text-[#293241] hover:bg-[#FFD23F]'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Avatar grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {displayedAvatars.map((avatar) => {
                  const image = getAvatarImage(avatar.id);
                  const selected = selectedAvatar === avatar.id;

                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(avatar.id);
                        setError('');
                      }}
                      aria-label={`Select ${avatar.label}`}
                      aria-pressed={selected}
                      className={`relative p-2 border-2 transition-all ${
                        selected
                          ? 'border-[#C62828] bg-[#FFD23F] shadow-[3px_3px_0px_#0A0A0A] -translate-y-1'
                          : 'border-[#0A0A0A]/20 bg-[#F4F1EA] hover:border-[#293241] hover:bg-white'
                      }`}
                    >
                      {image && (
                        <img
                          src={image}
                          alt={avatar.label}
                          className="w-full aspect-square object-contain"
                        />
                      )}
                      <span className="block text-[9px] font-bold text-[#293241] mt-1 truncate">
                        {avatar.label}
                      </span>
                      {selected && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#C62828] text-white flex items-center justify-center border-2 border-[#0A0A0A]">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {visibleAvatars < filteredAvatars.length && (
                <button
                  type="button"
                  onClick={() => setVisibleAvatars((current) => current + 24)}
                  className="w-full py-3 bg-[#F4F1EA] border-2 border-[#0A0A0A] text-[#293241] font-extrabold text-xs uppercase hover:bg-[#FFD23F] transition-colors"
                >
                  Show More Avatars
                </button>
              )}
            </>
          )}

          {/* STEP 2: TITLE */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#C62828]">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Give your experience a voice
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  What Should Your Story Be Called?
                </h2>

                <p className="text-sm text-[#0A0A0A]/70 leading-relaxed">
                  Choose a title that describes how ELI7 Foundation made
                  a difference in your life.
                </p>
              </div>

              <div className="bg-[#F4F1EA] border-2 border-[#0A0A0A] p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase text-[#C62828]">
                    Need an idea?
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSuggestionIndex(
                        (current) => (current + 1) % titleSuggestions.length
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#293241] hover:text-[#C62828]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Another suggestion
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setTitle(titleSuggestions[suggestionIndex])}
                  className="w-full text-left bg-white border-2 border-[#0A0A0A] p-4 font-bold text-[#293241] hover:bg-[#FFD23F] transition-colors"
                >
                  “{titleSuggestions[suggestionIndex]}”
                  <span className="block text-[10px] uppercase text-[#C62828] mt-2">
                    Tap to use this title
                  </span>
                </button>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="story-title"
                  className="block text-sm font-extrabold text-[#293241]"
                >
                  Your Story Title *
                </label>
                <input
                  id="story-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter a title for your story"
                  maxLength={120}
                  className="w-full border-2 border-[#0A0A0A] p-4 text-sm font-medium text-[#293241] outline-none focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20"
                />
                <p className="text-[11px] text-[#0A0A0A]/50 text-right">
                  {title.length}/120 characters
                </p>
              </div>
            </>
          )}

          {/* STEP 3: STORY AND REQUIRED NAME */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#C62828]">
                  <Heart className="w-5 h-5" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Your experience matters
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  Tell Us Your Story
                </h2>

                <p className="text-sm text-[#0A0A0A]/70 leading-relaxed">
                  How has Extend Love Initiative Foundation made a
                  difference in your life, your family or your community?
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="beneficiary-name"
                  className="block text-sm font-extrabold text-[#293241]"
                >
                  Your Full Name <span className="text-[#C62828]">*</span>
                  <span className="text-[10px] font-bold text-[#C62828] ml-2">
                    REQUIRED
                  </span>
                </label>
                <input
                  id="beneficiary-name"
                  type="text"
                  required
                  value={beneficiaryName}
                  onChange={(event) => setBeneficiaryName(event.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="w-full border-2 border-[#0A0A0A] p-4 text-sm font-medium text-[#293241] outline-none focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20"
                />
                <p className="text-[11px] text-[#0A0A0A]/55">
                  Your name is required before you can continue.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="story-location"
                  className="flex items-center gap-2 text-sm font-extrabold text-[#293241]"
                >
                  <MapPin className="w-4 h-4 text-[#C62828]" />
                  Your Location
                  <span className="text-[10px] text-[#0A0A0A]/45">
                    (Optional)
                  </span>
                </label>
                <input
                  id="story-location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Enter your city or state"
                  className="w-full border-2 border-[#0A0A0A] p-4 text-sm font-medium text-[#293241] outline-none focus:border-[#C62828]"
                />
              </div>

              <div className="bg-[#F4F1EA] border-2 border-[#0A0A0A] p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C62828]" />
                  <h3 className="text-xs font-extrabold uppercase text-[#293241]">
                    A few questions to guide you
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-[#293241]/80">
                  <li>• What support or opportunity did you receive from ELI7 Foundation?</li>
                  <li>• How did that support help you, your family or your community?</li>
                  <li>• What changed after receiving the support?</li>
                  <li>• What would you like others to know about your experience with ELI7?</li>
                </ul>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="story-text"
                  className="block text-sm font-extrabold text-[#293241]"
                >
                  Your Experience <span className="text-[#C62828]">*</span>
                </label>
                <textarea
                  id="story-text"
                  value={storyText}
                  onChange={(event) => setStoryText(event.target.value)}
                  placeholder="Tell us what happened, how you felt, and the difference ELI7 Foundation made..."
                  rows={9}
                  maxLength={5000}
                  className="w-full border-2 border-[#0A0A0A] p-4 text-sm leading-relaxed text-[#293241] outline-none resize-y focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20"
                />
                <p className="text-[11px] text-[#0A0A0A]/50 text-right">
                  {storyText.length}/5000 characters
                </p>
              </div>
            </>
          )}

          {/* STEP 4: PHOTO AND REVIEW */}
          {step === 3 && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#C62828]">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Final review
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  Review Your Picture & Story
                </h2>

                <p className="text-sm text-[#0A0A0A]/70 leading-relaxed">
                  You can still change your picture here before submitting.
                </p>
              </div>

              {/* CHANGE OR UPLOAD PICTURE */}
              <div className="border-2 border-[#0A0A0A] bg-[#F4F1EA] p-5 md:p-7 space-y-5">
                <div className="text-center space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-[#C62828]" />
                  <h3 className="font-extrabold text-[#293241]">
                    Your Profile Picture
                  </h3>
                </div>

                {photoPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={photoPreview}
                      alt="Your uploaded photograph"
                      className="w-48 h-48 rounded-full object-cover border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A]"
                    />
                    <p className="text-xs font-bold text-[#00897B]">
                      Your uploaded picture will be used.
                    </p>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="text-xs font-extrabold uppercase text-[#C62828] underline"
                    >
                      Remove picture and use my avatar instead
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    {selectedAvatarImage && (
                      <img
                        src={selectedAvatarImage}
                        alt="Selected avatar"
                        className="w-36 h-36 rounded-full bg-white border-2 border-[#0A0A0A]"
                      />
                    )}
                    <p className="text-xs font-bold text-[#293241]">
                      Your selected avatar will be used.
                    </p>
                    <label className="flex flex-col items-center justify-center gap-2 w-full py-7 px-4 bg-white border-2 border-dashed border-[#293241] hover:bg-[#FFD23F]/30 cursor-pointer transition-colors">
                      <Upload className="w-7 h-7 text-[#C62828]" />
                      <span className="text-xs font-extrabold uppercase text-[#293241]">
                        Choose a Picture
                      </span>
                      <span className="text-[10px] text-[#0A0A0A]/55">
                        JPG, PNG, WEBP or GIF · Maximum 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* REVIEW */}
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-[#293241]">
                  Review Your Story
                </h3>

                <div className="bg-white border-2 border-[#0A0A0A] p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Uploaded picture"
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#0A0A0A]"
                      />
                    ) : (
                      <img
                        src={selectedAvatarImage || ''}
                        alt="Selected avatar"
                        className="w-16 h-16 rounded-full object-cover bg-[#F4F1EA] border-2 border-[#0A0A0A]"
                      />
                    )}

                    <div>
                      <p className="font-extrabold text-[#293241]">
                        {beneficiaryName}
                      </p>
                      {location && (
                        <p className="text-xs text-[#0A0A0A]/60">
                          {location}
                        </p>
                      )}
                      <p className="text-[10px] font-bold uppercase text-[#00897B] mt-1">
                        {photoFile ? 'Uploaded picture' : 'Selected avatar'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#0A0A0A]/15 pt-4 space-y-2">
                    <h4 className="font-extrabold text-[#293241]">
                      {title}
                    </h4>
                    <p className="text-sm text-[#0A0A0A]/75 leading-relaxed whitespace-pre-wrap">
                      {storyText}
                    </p>
                  </div>
                </div>
              </div>

              {/* CONSENT */}
              <label className="flex items-start gap-3 bg-[#F4F1EA] border-2 border-[#0A0A0A] p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 w-5 h-5 accent-[#C62828] shrink-0"
                />
                <span className="text-xs leading-relaxed text-[#293241]">
                  I confirm that this is my genuine experience or a story
                  I am authorised to share. I give Extend Love Initiative
                  Foundation permission to review and, subject to approval,
                  publish this story and the photograph or avatar I selected.
                  <strong className="text-[#C62828]"> Required.</strong>
                </span>
              </label>
            </>
          )}
        </section>

        {/* NAVIGATION */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => goToStep(Math.max(0, step - 1))}
            disabled={step === 0 || isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-[#0A0A0A] bg-white text-[#293241] font-extrabold text-xs uppercase shadow-[3px_3px_0px_#0A0A0A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4F1EA] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#C62828] text-white border-2 border-[#0A0A0A] font-extrabold text-xs uppercase shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] transition-colors"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#00897B] text-white border-2 border-[#0A0A0A] font-extrabold text-xs uppercase shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Submit My Story
                </>
              )}
            </button>
          )}
        </div>

        <p className="text-center text-[11px] text-[#0A0A0A]/50">
          Your story will be reviewed by our team before it is published
          on the website.
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
