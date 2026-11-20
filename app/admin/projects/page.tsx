'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  FolderPlus,
  Upload,
  Trash2,
  Edit3,
  X,
  Images,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Link as LinkIcon,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

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

const PRESET_LABELS = [
  'Disability Inclusion & Accessibility',
  'Digital Skills & Tech Literacy',
  'Community Outreach',
  'Health & Medical Outreach',
  'Education & Youth Mentorship',
  'Women & Girl-Child Empowerment',
  'Assistive Technology & Support',
  'Economic & Vocational Empowerment',
  'Advocacy & Policy Awareness',
  'Humanitarian & Relief Support',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');

  // Cover Image State (Supports both Bucket Upload & External URL)
  const [coverUrlInput, setCoverUrlInput] = useState<string>('');
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Album Gallery State (Supports both Bucket Upload & External URLs)
  const [savedGalleryUrls, setSavedGalleryUrls] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [bulkExternalLinksInput, setBulkExternalLinksInput] = useState<string>('');

  async function fetchProjects() {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    setProjects(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setSelectedPreset('');
    setCustomLabel('');
    setLocation('');
    setEventDate('');
    setDescription('');
    setCoverUrlInput('');
    setCoverFile(null);
    setSavedGalleryUrls([]);
    setGalleryFiles([]);
    setBulkExternalLinksInput('');
  };

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setSlug(project.slug);

    const existingTag = project.category || '';
    if (PRESET_LABELS.includes(existingTag)) {
      setSelectedPreset(existingTag);
      setCustomLabel('');
    } else {
      setSelectedPreset('');
      setCustomLabel(existingTag);
    }

    setLocation(project.location || '');
    setEventDate(project.event_date || '');
    setDescription(project.description);
    setCoverUrlInput(project.image_url || '');
    setCoverFile(null);
    setSavedGalleryUrls(project.gallery_urls || []);
    setGalleryFiles([]);
    setBulkExternalLinksInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse pasted Cloudinary / external URLs (supports newlines or commas)
  const handleAddExternalLinks = () => {
    if (!bulkExternalLinksInput.trim()) return;

    const extractedUrls = bulkExternalLinksInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http://') || u.startsWith('https://'));

    if (extractedUrls.length === 0) {
      setStatusMessage({
        type: 'error',
        text: 'Please paste valid image URLs starting with https:// or http://',
      });
      return;
    }

    setSavedGalleryUrls((prev) => Array.from(new Set([...prev, ...extractedUrls])));
    setBulkExternalLinksInput('');
  };

  // Upload a single file to the Supabase 'projects' storage bucket
  async function uploadFileToBucket(file: File, folderSlug: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const uniqueName = `${folderSlug}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('projects')
      .upload(uniqueName, file, { upsert: false });

    if (error) {
      throw new Error(`Bucket upload failed for ${file.name}: ${error.message}`);
    }

    const { data } = supabase.storage.from('projects').getPublicUrl(uniqueName);
    return data.publicUrl;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const finalSlug = slug.trim() || slugify(title);

      // Custom typed label takes priority over dropdown preset if filled
      const finalProjectLabel = customLabel.trim() || selectedPreset.trim() || null;

      // 1. Resolve Cover Image
      let finalCoverUrl = coverUrlInput.trim();
      if (coverFile) {
        finalCoverUrl = await uploadFileToBucket(coverFile, finalSlug);
      }

      // 2. Upload any queued local files to Supabase 'projects' bucket
      const uploadedBucketUrls: string[] = [];
      for (const file of galleryFiles) {
        const url = await uploadFileToBucket(file, finalSlug);
        uploadedBucketUrls.push(url);
      }

      // 3. Grab any un-added links still sitting in the textarea
      const leftoverLinks = bulkExternalLinksInput
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter((u) => u.startsWith('http://') || u.startsWith('https://'));

      const combinedGalleryUrls = Array.from(
        new Set([...savedGalleryUrls, ...leftoverLinks, ...uploadedBucketUrls])
      );

      // Fallback cover if none set explicitly
      if (!finalCoverUrl && combinedGalleryUrls.length > 0) {
        finalCoverUrl = combinedGalleryUrls[0];
      }

      const payload = {
        title: title.trim(),
        slug: finalSlug,
        category: finalProjectLabel,
        location: location.trim() || null,
        event_date: eventDate || null,
        description: description.trim(),
        image_url: finalCoverUrl || null,
        gallery_urls: combinedGalleryUrls,
      };

      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        setStatusMessage({
          type: 'success',
          text: `Updated "${title}" with ${combinedGalleryUrls.length} album photos.`,
        });
      } else {
        const { error } = await supabase.from('projects').insert([payload]);

        if (error) throw error;
        setStatusMessage({
          type: 'success',
          text: `Published "${title}" with ${combinedGalleryUrls.length} album photos!`,
        });
      }

      resetForm();
      await fetchProjects();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}" and its photo album?`
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id);

    if (!error) {
      setStatusMessage({
        type: 'success',
        text: `Deleted project "${project.title}".`,
      });
      if (editingId === project.id) resetForm();
      await fetchProjects();
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
            <FolderPlus className="w-4 h-4" /> Admin Portal
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">
            Manage Projects & Photo Albums
          </h1>
          <p className="text-sm md:text-base text-[#0A0A0A]/80 max-w-2xl">
            Document individual projects with a short brief and build isolated photo albums using either direct file uploads or Cloudinary/external links.
          </p>
        </div>

        <Link
          href="/projects"
          target="_blank"
          className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-colors self-start"
        >
          View Live Projects Page <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div
          className={`p-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] flex items-center justify-between font-bold text-sm ${
            statusMessage.type === 'success'
              ? 'bg-[#FFD23F] text-[#0A0A0A]'
              : 'bg-[#EE6C4D] text-[#FFFFFE]'
          }`}
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {statusMessage.text}
          </span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Create / Edit Project Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-6 md:p-10 space-y-8"
      >
        <div className="flex items-center justify-between border-b-2 border-[#0A0A0A]/10 pb-4">
          <h2 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
            {editingId ? `Editing: ${title}` : 'Document New Project'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold uppercase bg-[#F4F1EA] px-3 py-1.5 border-2 border-[#0A0A0A] hover:bg-[#EE6C4D] hover:text-white transition-colors cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Row 1: Project Main Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-[#293241]">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Inclusive Digital Skills Bootcamp 2026"
              className="w-full px-4 py-3 bg-[#F4F1EA] border-2 border-[#0A0A0A] text-sm font-medium focus:outline-none focus:bg-[#FFFFFE]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-[#293241]">
              URL Slug (Auto-generated)
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="inclusive-digital-skills-bootcamp-2026"
              className="w-full px-4 py-3 bg-[#F4F1EA] border-2 border-[#0A0A0A] text-sm font-mono focus:outline-none focus:bg-[#FFFFFE]"
            />
          </div>
        </div>

        {/* Row 2: Project Tag / Focus Label (Preset Dropdown OR Custom Manual Input) */}
        <div className="p-5 bg-[#F4F1EA] border-2 border-[#0A0A0A] space-y-4">
          <div>
            <h3 className="text-xs font-extrabold uppercase text-[#293241]">
              Project Focus Label / Subtitle Tag (Optional)
            </h3>
            <p className="text-xs text-[#0A0A0A]/70 mt-0.5">
              Pick a preset focus area from the dropdown OR type your own custom label in the box next to it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-[#0A0A0A]/70">
                Option 1: Select a Preset Focus Area
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => {
                  setSelectedPreset(e.target.value);
                  if (e.target.value) setCustomLabel('');
                }}
                className="w-full px-4 py-3 bg-[#FFFFFE] border-2 border-[#0A0A0A] text-sm font-bold focus:outline-none"
              >
                <option value="">-- No preset / Use custom below --</option>
                {PRESET_LABELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-[#0A0A0A]/70">
                Option 2: Or Type Any Custom Label Manually
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => {
                  setCustomLabel(e.target.value);
                  if (e.target.value) setSelectedPreset('');
                }}
                placeholder="e.g., Sign Language Tech Workshop, Rural Eye Care..."
                className="w-full px-4 py-3 bg-[#FFFFFE] border-2 border-[#0A0A0A] text-sm font-medium focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Location & Event Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-[#293241]">
              Location (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Ikeja, Lagos"
              className="w-full px-4 py-3 bg-[#F4F1EA] border-2 border-[#0A0A0A] text-sm font-medium focus:outline-none focus:bg-[#FFFFFE]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-[#293241]">
              Project Date
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#F4F1EA] border-2 border-[#0A0A0A] text-sm font-medium focus:outline-none focus:bg-[#FFFFFE]"
            />
          </div>
        </div>

        {/* Row 4: Short Brief */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase text-[#293241]">
            Project Brief (Shown at the top of the project page) *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a concise summary of what this specific outreach or project achieved..."
            className="w-full px-4 py-3 bg-[#F4F1EA] border-2 border-[#0A0A0A] text-sm font-medium focus:outline-none focus:bg-[#FFFFFE]"
          />
        </div>

        {/* SECTION A: MAIN COVER IMAGE (Bucket Upload OR External Link) */}
        <div className="p-6 bg-[#F4F1EA] border-2 border-[#0A0A0A] space-y-4">
          <h3 className="text-sm font-extrabold uppercase text-[#293241]">
            1. Main Cover Photo (Choose Option A or Option B)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-[#0A0A0A]/80">
                Option A: Upload from Device (Supabase Bucket)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setCoverFile(e.target.files?.[0] || null);
                }}
                className="block w-full text-xs font-bold file:mr-4 file:py-2.5 file:px-4 file:border-2 file:border-[#0A0A0A] file:bg-[#FFD23F] file:text-[#0A0A0A] file:font-bold file:uppercase hover:file:bg-[#EE6C4D] hover:file:text-white cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-[#0A0A0A]/80">
                Option B: Paste Cloudinary / External Image URL
              </label>
              <input
                type="url"
                value={coverUrlInput}
                onChange={(e) => {
                  setCoverUrlInput(e.target.value);
                  setCoverFile(null);
                }}
                placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
                className="w-full px-3 py-2.5 bg-[#FFFFFE] border-2 border-[#0A0A0A] text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          {(coverFile || coverUrlInput) && (
            <div className="relative w-full max-w-sm h-44 border-2 border-[#0A0A0A] overflow-hidden bg-white">
              <img
                src={coverFile ? URL.createObjectURL(coverFile) : coverUrlInput}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* SECTION B: PROJECT ALBUM PHOTOS (Bulk Bucket Upload AND/OR Cloudinary Links) */}
        <div className="p-6 bg-[#F4F1EA] border-2 border-[#0A0A0A] space-y-6">
          <div>
            <h3 className="text-sm font-extrabold uppercase text-[#293241]">
              2. Project Album Photos (Use Either or Both Methods)
            </h3>
            <p className="text-xs text-[#0A0A0A]/70 mt-1">
              All photos added here are locked strictly to this project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FFFFFE] p-4 border-2 border-[#0A0A0A] space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#293241]">
                <Upload className="w-4 h-4 text-[#EE6C4D]" />
                Method A: Upload Files to Supabase Bucket
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setGalleryFiles((prev) => [
                      ...prev,
                      ...Array.from(e.target.files!),
                    ]);
                  }
                }}
                className="block w-full text-xs font-bold file:mr-3 file:py-2 file:px-3 file:border-2 file:border-[#0A0A0A] file:bg-[#293241] file:text-white file:font-bold file:uppercase hover:file:bg-[#EE6C4D] cursor-pointer"
              />
              <p className="text-[11px] text-[#0A0A0A]/70">
                Select multiple photos at once from your device to upload them directly to the <code className="font-mono font-bold">projects</code> bucket.
              </p>
            </div>

            <div className="bg-[#FFFFFE] p-4 border-2 border-[#0A0A0A] space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#293241]">
                <LinkIcon className="w-4 h-4 text-[#EE6C4D]" />
                Method B: Paste Cloudinary / External URLs
              </div>
              <textarea
                rows={3}
                value={bulkExternalLinksInput}
                onChange={(e) => setBulkExternalLinksInput(e.target.value)}
                placeholder={
                  'Paste one or more links (one per line or comma-separated):\nhttps://res.cloudinary.com/.../photo1.jpg\nhttps://res.cloudinary.com/.../photo2.jpg'
                }
                className="w-full p-2.5 bg-[#F4F1EA] border-2 border-[#0A0A0A] text-xs font-mono focus:outline-none focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddExternalLinks}
                className="inline-flex items-center gap-1.5 bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-2 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#293241] hover:text-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Links to Album
              </button>
            </div>
          </div>

          {/* Combined Album Preview Grid */}
          {(savedGalleryUrls.length > 0 || galleryFiles.length > 0) && (
            <div className="space-y-3 pt-2 border-t-2 border-[#0A0A0A]/10">
              <h4 className="text-xs font-bold uppercase text-[#293241]">
                Album Preview ({savedGalleryUrls.length + galleryFiles.length}{' '}
                Photos Ready)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {savedGalleryUrls.map((url, idx) => (
                  <div
                    key={`url-${idx}`}
                    className="relative aspect-square border-2 border-[#0A0A0A] overflow-hidden bg-white"
                  >
                    <img
                      src={url}
                      alt={`Album URL ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-[#293241] text-white text-[9px] font-bold px-1.5 py-0.5">
                      LINK
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSavedGalleryUrls((prev) =>
                          prev.filter((item) => item !== url)
                        )
                      }
                      title="Remove photo"
                      className="absolute top-1.5 right-1.5 bg-[#EE6C4D] text-white p-1 border border-[#0A0A0A] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {galleryFiles.map((file, idx) => (
                  <div
                    key={`file-${idx}`}
                    className="relative aspect-square border-2 border-dashed border-[#0A0A0A] overflow-hidden bg-white"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Queued file ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-[#FFD23F] text-[#0A0A0A] text-[9px] font-bold px-1.5 py-0.5 border border-[#0A0A0A]">
                      BUCKET
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setGalleryFiles((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      title="Remove from upload queue"
                      className="absolute top-1.5 right-1.5 bg-[#0A0A0A] text-white p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-[#FFD23F] text-[#0A0A0A] font-extrabold text-sm uppercase px-6 py-4 border-2 border-[#0A0A0A] shadow-[5px_5px_0px_#0A0A0A] hover:bg-[#EE6C4D] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Project &
                Photos...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {editingId ? 'Save Project Changes' : 'Publish Project Archive'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Existing Projects List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
          Published Project Archives ({projects.length})
        </h2>

        {loading ? (
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-8 font-bold text-[#293241]">
            Loading existing projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-8 text-sm text-[#0A0A0A]/70">
            No projects created yet. Use the form above to publish your first project.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const photoCount = Array.from(
                new Set(
                  [project.image_url, ...(project.gallery_urls || [])].filter(
                    Boolean
                  )
                )
              ).length;

              return (
                <div
                  key={project.id}
                  className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-5 flex flex-col sm:flex-row gap-5 justify-between"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 shrink-0 border-2 border-[#0A0A0A] bg-[#F4F1EA] overflow-hidden">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#293241]/40">
                          NO COVER
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {project.category && (
                        <span className="inline-block bg-[#F4F1EA] text-[#0A0A0A] text-[10px] font-bold uppercase px-2 py-0.5 border border-[#0A0A0A]">
                          {project.category}
                        </span>
                      )}
                      <h3 className="font-bold text-lg text-[#293241] leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#0A0A0A]/70 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-[#293241] pt-1">
                        <Images className="w-3.5 h-3.5 text-[#EE6C4D]" />
                        {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'} in
                        album
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-1 bg-[#F4F1EA] text-[#0A0A0A] text-xs font-bold uppercase px-3 py-2 border-2 border-[#0A0A0A] hover:bg-[#FFD23F] transition-colors"
                    >
                      View <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => startEditing(project)}
                      className="inline-flex items-center justify-center gap-1 bg-[#FFD23F] text-[#0A0A0A] text-xs font-bold uppercase px-3 py-2 border-2 border-[#0A0A0A] hover:bg-[#293241] hover:text-white transition-colors cursor-pointer"
                    >
                      Edit / Add Photos <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(project)}
                      className="inline-flex items-center justify-center gap-1 bg-[#EE6C4D] text-white text-xs font-bold uppercase px-3 py-2 border-2 border-[#0A0A0A] hover:bg-[#0A0A0A] transition-colors cursor-pointer"
                    >
                      Delete <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}