'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  FolderPlus, Upload, Trash2, Edit3, X, Images, CheckCircle2,
  ExternalLink, Loader2, Link as LinkIcon, Plus, School,
  ChevronDown, ChevronUp, MapPin, Calendar, FolderOpen,
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

interface SchoolPhoto {
  id: string;
  school_id: string;
  image_url: string;
  caption?: string | null;
  display_order: number;
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

const inputClass =
  'w-full px-4 py-3 bg-[#F4F1EA] border-2 border-[#0A0A0A] text-sm font-medium focus:outline-none focus:bg-[#FFFFFE]';
const buttonClass =
  'inline-flex items-center justify-center gap-2 font-bold text-xs uppercase px-3 py-2 border-2 border-[#0A0A0A] transition-colors cursor-pointer';

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function validUrls(value: string): string[] {
  return Array.from(new Set(value.split(/[\n,]+/).map((url) => url.trim()).filter((url) => /^https?:\/\//i.test(url))));
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Existing project form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrlInput, setCoverUrlInput] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [savedGalleryUrls, setSavedGalleryUrls] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [bulkExternalLinksInput, setBulkExternalLinksInput] = useState('');

  // Multi-school manager
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [schools, setSchools] = useState<ProjectSchool[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schoolSubmitting, setSchoolSubmitting] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [schoolSlug, setSchoolSlug] = useState('');
  const [schoolDescription, setSchoolDescription] = useState('');
  const [schoolLocation, setSchoolLocation] = useState('');
  const [schoolDate, setSchoolDate] = useState('');
  const [schoolPhotos, setSchoolPhotos] = useState<Record<string, SchoolPhoto[]>>({});
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoLinks, setPhotoLinks] = useState('');
  const [photoSubmittingFor, setPhotoSubmittingFor] = useState<string | null>(null);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) setStatusMessage({ type: 'error', text: `Could not load projects: ${error.message}` });
    setProjects(data || []);
    setLoading(false);
  }

  useEffect(() => {
    void fetchProjects();
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingId) setSlug(slugify(value));
  };

  function resetForm() {
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
  }

  function startEditing(project: Project) {
    setEditingId(project.id);
    setTitle(project.title);
    setSlug(project.slug);
    const tag = project.category || '';
    if (PRESET_LABELS.includes(tag)) {
      setSelectedPreset(tag);
      setCustomLabel('');
    } else {
      setSelectedPreset('');
      setCustomLabel(tag);
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
  }

  async function uploadFileToBucket(file: File, folder: string): Promise<string> {
    const extension = file.name.split('.').pop() || 'jpg';
    const safeFolder = slugify(folder) || 'project';
    const fileName = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    const { error } = await supabase.storage.from('projects').upload(fileName, file, { upsert: false });
    if (error) throw new Error(`Upload failed for ${file.name}: ${error.message}`);
    return supabase.storage.from('projects').getPublicUrl(fileName).data.publicUrl;
  }

  function handleAddProjectLinks() {
    const urls = validUrls(bulkExternalLinksInput);
    if (!urls.length) {
      setStatusMessage({ type: 'error', text: 'Paste valid image URLs beginning with http:// or https://.' });
      return;
    }
    setSavedGalleryUrls((previous) => Array.from(new Set([...previous, ...urls])));
    setBulkExternalLinksInput('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const finalSlug = slug.trim() || slugify(title);
      const finalCategory = customLabel.trim() || selectedPreset.trim() || null;
      let finalCover = coverUrlInput.trim();
      if (coverFile) finalCover = await uploadFileToBucket(coverFile, finalSlug);

      const uploadedGallery: string[] = [];
      for (const file of galleryFiles) uploadedGallery.push(await uploadFileToBucket(file, finalSlug));
      const allGallery = Array.from(new Set([...savedGalleryUrls, ...validUrls(bulkExternalLinksInput), ...uploadedGallery]));
      if (!finalCover && allGallery.length) finalCover = allGallery[0];

      const payload = {
        title: title.trim(),
        slug: finalSlug,
        category: finalCategory,
        location: location.trim() || null,
        event_date: eventDate || null,
        description: description.trim(),
        image_url: finalCover || null,
        gallery_urls: allGallery,
      };

      if (editingId) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editingId);
        if (error) throw error;
        setStatusMessage({ type: 'success', text: `Updated "${title}" and saved ${allGallery.length} project photos.` });
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
        setStatusMessage({ type: 'success', text: `Published "${title}" with ${allGallery.length} project photos.` });
      }
      resetForm();
      await fetchProjects();
    } catch (error) {
      setStatusMessage({ type: 'error', text: error instanceof Error ? error.message : 'An unexpected error occurred.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteProject(project: Project) {
    if (!window.confirm(`Delete "${project.title}" and its project archive? Any school records linked to it will also be deleted by the database cascade.`)) return;
    const { error } = await supabase.from('projects').delete().eq('id', project.id);
    if (error) {
      setStatusMessage({ type: 'error', text: `Could not delete project: ${error.message}` });
      return;
    }
    setStatusMessage({ type: 'success', text: `Deleted "${project.title}".` });
    if (editingId === project.id) resetForm();
    if (expandedProjectId === project.id) setExpandedProjectId(null);
    await fetchProjects();
  }

  async function loadSchools(projectId: string) {
    setSchoolsLoading(true);
    const { data, error } = await supabase.from('project_schools').select('*').eq('project_id', projectId).order('created_at', { ascending: true });
    if (error) {
      setStatusMessage({ type: 'error', text: `Could not load schools. Confirm the multi-school SQL migration has been run: ${error.message}` });
      setSchools([]);
      setSchoolsLoading(false);
      return;
    }
    const loadedSchools = (data || []) as ProjectSchool[];
    setSchools(loadedSchools);

    if (loadedSchools.length) {
      const photoResults = await Promise.all(
        loadedSchools.map((school) =>
          supabase.from('school_gallery_photos').select('*').eq('school_id', school.id).order('display_order', { ascending: true }).order('created_at', { ascending: true })
        )
      );
      const nextPhotos: Record<string, SchoolPhoto[]> = {};
      photoResults.forEach((result, index) => {
        nextPhotos[loadedSchools[index].id] = (result.data || []) as SchoolPhoto[];
        if (result.error) setStatusMessage({ type: 'error', text: `Could not load a school gallery: ${result.error.message}` });
      });
      setSchoolPhotos(nextPhotos);
    } else {
      setSchoolPhotos({});
    }
    setSchoolsLoading(false);
  }

  async function toggleSchoolManager(project: Project) {
    if (expandedProjectId === project.id) {
      setExpandedProjectId(null);
      return;
    }
    setExpandedProjectId(project.id);
    setSchoolName('');
    setSchoolSlug('');
    setSchoolDescription('');
    setSchoolLocation('');
    setSchoolDate('');
    setPhotoFiles([]);
    setPhotoLinks('');
    await loadSchools(project.id);
  }

  async function addSchool(event: React.FormEvent<HTMLFormElement>, projectId: string) {
    event.preventDefault();
    if (!schoolName.trim()) return;
    setSchoolSubmitting(true);
    setStatusMessage(null);
    const finalSchoolSlug = schoolSlug.trim() || slugify(schoolName);
    const { error } = await supabase.from('project_schools').insert([{
      project_id: projectId,
      school_name: schoolName.trim(),
      slug: finalSchoolSlug,
      description: schoolDescription.trim() || null,
      location: schoolLocation.trim() || null,
      event_date: schoolDate || null,
    }]);
    if (error) {
      setStatusMessage({ type: 'error', text: `Could not add school: ${error.message}` });
    } else {
      setStatusMessage({ type: 'success', text: `Added "${schoolName}" to this project.` });
      setSchoolName('');
      setSchoolSlug('');
      setSchoolDescription('');
      setSchoolLocation('');
      setSchoolDate('');
      await loadSchools(projectId);
    }
    setSchoolSubmitting(false);
  }

  async function addSchoolPhotos(school: ProjectSchool) {
    const links = validUrls(photoLinks);
    if (!photoFiles.length && !links.length) {
      setStatusMessage({ type: 'error', text: 'Choose image files or paste image URLs before uploading.' });
      return;
    }
    setPhotoSubmittingFor(school.id);
    setStatusMessage(null);
    try {
      const uploaded: string[] = [];
      for (const file of photoFiles) uploaded.push(await uploadFileToBucket(file, `schools/${school.slug}`));
      const urls = Array.from(new Set([...links, ...uploaded]));
      const currentCount = schoolPhotos[school.id]?.length || 0;
      const rows = urls.map((url, index) => ({
        school_id: school.id,
        image_url: url,
        display_order: currentCount + index,
      }));
      const { error } = await supabase.from('school_gallery_photos').insert(rows);
      if (error) throw error;
      setStatusMessage({ type: 'success', text: `Added ${rows.length} photo(s) to ${school.school_name}.` });
      setPhotoFiles([]);
      setPhotoLinks('');
      await loadSchools(school.project_id);
    } catch (error) {
      setStatusMessage({ type: 'error', text: error instanceof Error ? error.message : 'Could not upload school photos.' });
    } finally {
      setPhotoSubmittingFor(null);
    }
  }

  async function deleteSchool(school: ProjectSchool) {
    if (!window.confirm(`Delete "${school.school_name}" and all its photo records?`)) return;
    const { error } = await supabase.from('project_schools').delete().eq('id', school.id);
    if (error) {
      setStatusMessage({ type: 'error', text: `Could not delete school: ${error.message}` });
      return;
    }
    setStatusMessage({ type: 'success', text: `Deleted "${school.school_name}".` });
    await loadSchools(school.project_id);
  }

  async function deleteSchoolPhoto(photo: SchoolPhoto, projectId: string) {
    if (!window.confirm('Remove this photograph from the school gallery?')) return;
    const { error } = await supabase.from('school_gallery_photos').delete().eq('id', photo.id);
    if (error) {
      setStatusMessage({ type: 'error', text: `Could not remove photo: ${error.message}` });
      return;
    }
    await loadSchools(projectId);
  }

  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
            <FolderPlus className="w-4 h-4" /> Admin Portal
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">
            Manage Projects & Photo Albums
          </h1>
          <p className="text-sm md:text-base text-[#0A0A0A]/80 max-w-2xl">
            Manage your existing project archives or create a multi-school project with a separate photo gallery for every school.
          </p>
        </div>
        <Link href="/projects" target="_blank" className={`${buttonClass} bg-[#FFFFFE] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#FFD23F] self-start px-4 py-3`}>
          View Live Projects Page <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {statusMessage && (
        <div className={`p-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] flex items-center justify-between font-bold text-sm ${statusMessage.type === 'success' ? 'bg-[#FFD23F] text-[#0A0A0A]' : 'bg-[#EE6C4D] text-[#FFFFFE]'}`}>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" />{statusMessage.text}</span>
          <button type="button" onClick={() => setStatusMessage(null)} className="p-1 cursor-pointer" aria-label="Dismiss message"><X className="w-4 h-4" /></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-6 md:p-10 space-y-8">
        <div className="flex items-center justify-between border-b-2 border-[#0A0A0A]/10 pb-4">
          <h2 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">{editingId ? `Editing: ${title}` : 'Document New Project'}</h2>
          {editingId && <button type="button" onClick={resetForm} className={`${buttonClass} bg-[#F4F1EA] hover:bg-[#EE6C4D] hover:text-white`}>Cancel Edit</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-[#293241]">Project Title *</label>
            <input required value={title} onChange={(event) => handleTitleChange(event.target.value)} placeholder="e.g., Menstrual Health Education Across 30 Schools" className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-[#293241]">URL Slug</label>
            <input required value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="menstrual-health-education-30-schools" className={`${inputClass} font-mono`} />
          </div>
        </div>

        <div className="p-5 bg-[#F4F1EA] border-2 border-[#0A0A0A] space-y-4">
          <div>
            <h3 className="text-xs font-extrabold uppercase text-[#293241]">Project Focus Label / Subtitle Tag (Optional)</h3>
            <p className="text-xs text-[#0A0A0A]/70 mt-1">Choose a preset or enter your own focus area.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-[#0A0A0A]/70">Preset Focus Area</label>
              <select value={selectedPreset} onChange={(event) => { setSelectedPreset(event.target.value); if (event.target.value) setCustomLabel(''); }} className={`${inputClass} bg-[#FFFFFE]`}>
                <option value="">-- No preset / use custom below --</option>
                {PRESET_LABELS.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-[#0A0A0A]/70">Custom Label</label>
              <input value={customLabel} onChange={(event) => { setCustomLabel(event.target.value); if (event.target.value) setSelectedPreset(''); }} placeholder="e.g., Menstrual Health Education" className={`${inputClass} bg-[#FFFFFE]`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-[#293241]">Location (Optional)</label>
            <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g., Bauchi State, Nigeria" className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-[#293241]">Project Date</label>
            <input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase text-[#293241]">Project Brief *</label>
          <textarea required rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Write a concise summary of this project..." className={inputClass} />
        </div>

        <div className="p-6 bg-[#F4F1EA] border-2 border-[#0A0A0A] space-y-4">
          <h3 className="text-sm font-extrabold uppercase text-[#293241]">1. Main Cover Photo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-[#0A0A0A]/80">Upload from Device</label>
              <input type="file" accept="image/*" onChange={(event) => setCoverFile(event.target.files?.[0] || null)} className="block w-full text-xs font-bold file:mr-3 file:py-2 file:px-3 file:border-2 file:border-[#0A0A0A] file:bg-[#FFD23F] file:text-[#0A0A0A] cursor-pointer" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-[#0A0A0A]/80">Or paste an image URL</label>
              <input type="url" value={coverUrlInput} onChange={(event) => { setCoverUrlInput(event.target.value); setCoverFile(null); }} placeholder="https://..." className={`${inputClass} bg-[#FFFFFE] font-mono`} />
            </div>
          </div>
          {(coverFile || coverUrlInput) && <div className="relative w-full max-w-sm h-44 border-2 border-[#0A0A0A] overflow-hidden bg-white"><img src={coverFile ? URL.createObjectURL(coverFile) : coverUrlInput} alt="Cover preview" className="w-full h-full object-cover" /></div>}
        </div>

        <div className="p-6 bg-[#F4F1EA] border-2 border-[#0A0A0A] space-y-6">
          <div>
            <h3 className="text-sm font-extrabold uppercase text-[#293241]">2. Existing Single-Project Photo Album</h3>
            <p className="text-xs text-[#0A0A0A]/70 mt-1">Use this for a regular one-time outreach. For a multi-school initiative, add the project first, then use “Manage Schools” below to keep each school's photos separate.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FFFFFE] p-4 border-2 border-[#0A0A0A] space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#293241]"><Upload className="w-4 h-4 text-[#EE6C4D]" /> Upload album photos</div>
              <input type="file" accept="image/*" multiple onChange={(event) => { if (event.target.files) setGalleryFiles((previous) => [...previous, ...Array.from(event.target.files || [])]); }} className="block w-full text-xs font-bold file:mr-3 file:py-2 file:px-3 file:border-2 file:border-[#0A0A0A] file:bg-[#293241] file:text-white cursor-pointer" />
              <p className="text-[11px] text-[#0A0A0A]/70">These photos remain in the existing project gallery.</p>
            </div>
            <div className="bg-[#FFFFFE] p-4 border-2 border-[#0A0A0A] space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#293241]"><LinkIcon className="w-4 h-4 text-[#EE6C4D]" /> Paste external photo URLs</div>
              <textarea rows={3} value={bulkExternalLinksInput} onChange={(event) => setBulkExternalLinksInput(event.target.value)} placeholder={'Paste one URL per line or comma-separated:\nhttps://.../photo1.jpg'} className={`${inputClass} font-mono text-xs`} />
              <button type="button" onClick={handleAddProjectLinks} className={`${buttonClass} bg-[#FFD23F] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#293241] hover:text-white`}><Plus className="w-3.5 h-3.5" /> Add Links to Album</button>
            </div>
          </div>
          {(savedGalleryUrls.length > 0 || galleryFiles.length > 0) && (
            <div className="space-y-3 pt-2 border-t-2 border-[#0A0A0A]/10">
              <h4 className="text-xs font-bold uppercase text-[#293241]">Album Preview ({savedGalleryUrls.length + galleryFiles.length} photos ready)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {savedGalleryUrls.map((url, index) => <div key={`${url}-${index}`} className="relative aspect-square border-2 border-[#0A0A0A] overflow-hidden bg-white"><img src={url} alt={`Album URL ${index + 1}`} className="w-full h-full object-cover" /><button type="button" onClick={() => setSavedGalleryUrls((previous) => previous.filter((item) => item !== url))} className="absolute top-1 right-1 bg-[#EE6C4D] text-white p-1" aria-label="Remove image"><X className="w-3.5 h-3.5" /></button></div>)}
                {galleryFiles.map((file, index) => <div key={`${file.name}-${index}`} className="relative aspect-square border-2 border-dashed border-[#0A0A0A] overflow-hidden bg-white"><img src={URL.createObjectURL(file)} alt={`Queued photo ${index + 1}`} className="w-full h-full object-cover" /><button type="button" onClick={() => setGalleryFiles((previous) => previous.filter((_, itemIndex) => itemIndex !== index))} className="absolute top-1 right-1 bg-[#0A0A0A] text-white p-1" aria-label="Remove queued image"><X className="w-3.5 h-3.5" /></button></div>)}
              </div>
            </div>
          )}
        </div>

        <div className="pt-2">
          <button type="submit" disabled={submitting} className={`${buttonClass} bg-[#FFD23F] text-sm font-extrabold px-6 py-4 shadow-[5px_5px_0px_#0A0A0A] hover:bg-[#EE6C4D] hover:text-white disabled:opacity-50`}>
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving project...</> : <><Upload className="w-4 h-4" /> {editingId ? 'Save Project Changes' : 'Publish Project Archive'}</>}
          </button>
        </div>
      </form>

      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">Published Project Archives ({projects.length})</h2>
        {loading ? (
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-8 font-bold text-[#293241]">Loading existing projects...</div>
        ) : projects.length === 0 ? (
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-8 text-sm text-[#0A0A0A]/70">No projects created yet. Use the form above to publish your first project.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const photoCount = new Set([project.image_url, ...(project.gallery_urls || [])].filter(Boolean)).size;
              const isExpanded = expandedProjectId === project.id;
              return (
                <article key={project.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-5 justify-between">
                    <div className="flex gap-4 min-w-0">
                      <div className="w-24 h-24 shrink-0 border-2 border-[#0A0A0A] bg-[#F4F1EA] overflow-hidden">
                        {project.image_url ? <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#293241]/40">NO COVER</div>}
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        {project.category && <span className="inline-block bg-[#F4F1EA] text-[#0A0A0A] text-[10px] font-bold uppercase px-2 py-0.5 border border-[#0A0A0A]">{project.category}</span>}
                        <h3 className="font-bold text-lg text-[#293241] leading-snug">{project.title}</h3>
                        <p className="text-xs text-[#0A0A0A]/70 line-clamp-2">{project.description}</p>
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-[#293241] pt-1"><Images className="w-3.5 h-3.5 text-[#EE6C4D]" />{photoCount} project photo(s)</div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                      <Link href={`/projects/${project.slug}`} target="_blank" className={`${buttonClass} bg-[#F4F1EA] hover:bg-[#FFD23F]`}>View <ExternalLink className="w-3.5 h-3.5" /></Link>
                      <button type="button" onClick={() => startEditing(project)} className={`${buttonClass} bg-[#FFD23F] hover:bg-[#293241] hover:text-white`}>Edit Project <Edit3 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => void handleDeleteProject(project)} className={`${buttonClass} bg-[#EE6C4D] text-white hover:bg-[#0A0A0A]`}>Delete <Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <button type="button" onClick={() => void toggleSchoolManager(project)} className={`w-full ${buttonClass} justify-between px-4 py-3 ${isExpanded ? 'bg-[#293241] text-white' : 'bg-[#FFD23F] text-[#0A0A0A]'} shadow-[3px_3px_0px_#0A0A0A]`}>
                    <span className="inline-flex items-center gap-2"><School className="w-4 h-4" /> Manage Schools / Locations</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="border-t-2 border-[#0A0A0A]/15 pt-5 space-y-6">
                      <div>
                        <h4 className="font-extrabold text-[#293241] font-['Bricolage_Grotesque'] text-lg">School Archives for {project.title}</h4>
                        <p className="text-xs text-[#0A0A0A]/70 mt-1">Add each school separately. Every school's photographs are saved to its own gallery and will not mix with other schools or the existing project album.</p>
                      </div>

                      <form onSubmit={(event) => void addSchool(event, project.id)} className="p-4 bg-[#F4F1EA] border-2 border-[#0A0A0A] space-y-4">
                        <h5 className="text-xs font-extrabold uppercase text-[#293241]">Add a School / Outreach Location</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1"><label className="text-[11px] font-bold uppercase">School name *</label><input required value={schoolName} onChange={(event) => { setSchoolName(event.target.value); setSchoolSlug(slugify(event.target.value)); }} placeholder="e.g. Government Secondary School" className={inputClass} /></div>
                          <div className="space-y-1"><label className="text-[11px] font-bold uppercase">URL slug</label><input value={schoolSlug} onChange={(event) => setSchoolSlug(slugify(event.target.value))} placeholder="government-secondary-school" className={`${inputClass} font-mono`} /></div>
                          <div className="space-y-1"><label className="text-[11px] font-bold uppercase">Location</label><input value={schoolLocation} onChange={(event) => setSchoolLocation(event.target.value)} placeholder="Town, LGA, State" className={inputClass} /></div>
                          <div className="space-y-1"><label className="text-[11px] font-bold uppercase">Outreach date</label><input type="date" value={schoolDate} onChange={(event) => setSchoolDate(event.target.value)} className={inputClass} /></div>
                        </div>
                        <div className="space-y-1"><label className="text-[11px] font-bold uppercase">School outreach brief (optional)</label><textarea rows={2} value={schoolDescription} onChange={(event) => setSchoolDescription(event.target.value)} placeholder="Describe the activities carried out at this school..." className={inputClass} /></div>
                        <button type="submit" disabled={schoolSubmitting} className={`${buttonClass} bg-[#FFD23F] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] hover:text-white disabled:opacity-50`}>
                          {schoolSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add School
                        </button>
                      </form>

                      {schoolsLoading ? <div className="py-6 text-center text-sm font-bold text-[#293241]"><Loader2 className="inline w-4 h-4 animate-spin mr-2" />Loading school records...</div> : schools.length === 0 ? (
                        <div className="border-2 border-dashed border-[#0A0A0A]/30 p-6 text-center"><School className="w-8 h-8 mx-auto text-[#293241]/40 mb-2" /><p className="font-bold text-sm text-[#293241]">No schools added yet.</p><p className="text-xs text-[#0A0A0A]/65 mt-1">Add the first school using the form above.</p></div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between"><h5 className="font-extrabold text-sm text-[#293241] uppercase">Schools ({schools.length})</h5><span className="text-xs font-bold text-[#0A0A0A]/60">Each gallery is separate</span></div>
                          {schools.map((school, index) => {
                            const photos = schoolPhotos[school.id] || [];
                            return (
                              <div key={school.id} className="border-2 border-[#0A0A0A] p-4 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                  <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-2"><span className="bg-[#293241] text-white text-[10px] font-bold px-2 py-1">SCHOOL {String(index + 1).padStart(2, '0')}</span><h6 className="font-bold text-[#293241]">{school.school_name}</h6></div>
                                    {school.location && <p className="text-xs text-[#0A0A0A]/65 flex items-center gap-1"><MapPin className="w-3 h-3" />{school.location}</p>}
                                    {school.event_date && <p className="text-xs text-[#0A0A0A]/65 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(`${school.event_date}T00:00:00`).toLocaleDateString()}</p>}
                                    {school.description && <p className="text-xs text-[#0A0A0A]/75 mt-2">{school.description}</p>}
                                    <p className="text-xs font-bold text-[#EE6C4D] flex items-center gap-1"><Images className="w-3.5 h-3.5" />{photos.length} gallery photo(s)</p>
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    <Link href={`/projects/${project.slug}/schools/${school.slug}`} target="_blank" className={`${buttonClass} bg-[#F4F1EA] hover:bg-[#FFD23F]`}>Preview <ExternalLink className="w-3 h-3" /></Link>
                                    <button type="button" onClick={() => void deleteSchool(school)} className={`${buttonClass} bg-[#EE6C4D] text-white hover:bg-[#0A0A0A]`} aria-label={`Delete ${school.school_name}`}><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                </div>

                                <div className="bg-[#F4F1EA] border border-[#0A0A0A]/20 p-3 space-y-3">
                                  <h6 className="text-[11px] font-extrabold uppercase text-[#293241]">Add photos to {school.school_name} only</h6>
                                  <input type="file" accept="image/*" multiple onChange={(event) => setPhotoFiles(Array.from(event.target.files || []))} className="block w-full text-xs file:mr-3 file:py-2 file:px-3 file:border-2 file:border-[#0A0A0A] file:bg-[#FFD23F] file:font-bold" />
                                  <textarea rows={2} value={photoLinks} onChange={(event) => setPhotoLinks(event.target.value)} placeholder="Or paste image URLs, one per line..." className={`${inputClass} bg-white font-mono text-xs`} />
                                  <button type="button" disabled={photoSubmittingFor === school.id} onClick={() => void addSchoolPhotos(school)} className={`${buttonClass} bg-[#293241] text-white hover:bg-[#EE6C4D] disabled:opacity-50`}>
                                    {photoSubmittingFor === school.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload / Add School Photos
                                  </button>
                                </div>

                                {photos.length > 0 && <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">{photos.map((photo) => <div key={photo.id} className="relative aspect-square border-2 border-[#0A0A0A] overflow-hidden group"><img src={photo.image_url} alt={photo.caption || `${school.school_name} outreach`} className="w-full h-full object-cover" /><button type="button" onClick={() => void deleteSchoolPhoto(photo, project.id)} className="absolute top-1 right-1 bg-[#EE6C4D] text-white p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100" aria-label="Remove school photo"><X className="w-3.5 h-3.5" /></button></div>)}</div>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
