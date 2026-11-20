'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Upload,
  Loader2,
  Edit3,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string | null;
  image_url?: string | null;
  created_at: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [publishDate, setPublishDate] = useState('');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setFeedback({ type: 'error', message: error.message });
    } else if (data) {
      setNews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingId) {
      setSlug(slugify(value));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setImageUrl('');
    setPublishDate('');
  };

  const startEditing = (item: NewsItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug || slugify(item.title));
    setExcerpt(item.excerpt);
    setContent(item.content || '');
    setImageUrl(item.image_url || '');
    setPublishDate(
      item.created_at ? new Date(item.created_at).toISOString().slice(0, 16) : ''
    );
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setFeedback(null);
      if (!e.target.files || e.target.files.length === 0) return;

      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const folderSlug = slugify(slug || title) || 'general';
      const filePath = `news/${folderSlug}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${fileExt}`;

      // Uses 'projects' bucket (with 'public' fallback if 'projects' isn't used)
      const bucketName = 'projects';
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      setFeedback({
        type: 'success',
        message: 'Cover image uploaded to storage.',
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error uploading image.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;

    setSaving(true);
    setFeedback(null);

    try {
      const finalSlug = slugify(slug || title);

      const payload: {
        title: string;
        slug: string;
        excerpt: string;
        content: string | null;
        image_url: string | null;
        created_at?: string;
      } = {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        content: content.trim() ? content.trim() : null,
        image_url: imageUrl.trim() ? imageUrl.trim() : null,
      };

      if (publishDate) {
        payload.created_at = new Date(publishDate).toISOString();
      }

      if (editingId) {
        const { error } = await supabase
          .from('news')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        setFeedback({ type: 'success', message: 'Article updated successfully.' });
      } else {
        const { error } = await supabase.from('news').insert([payload]);
        if (error) throw error;
        setFeedback({ type: 'success', message: 'Article published successfully.' });
      }

      resetForm();
      await fetchNews();
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Failed to save article.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  const deleteNews = async (id: string, articleTitle: string) => {
    const confirmed = window.confirm(
      `Delete "${articleTitle}"? This cannot be undone.`
    );
    if (!confirmed) return;

    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }

    if (editingId === id) resetForm();
    setNews((prev) => prev.filter((n) => n.id !== id));
    setFeedback({ type: 'success', message: 'Article deleted.' });
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8 bg-[#F4F1EA]">
      {/* Header */}
      <div className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#00897B] hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">
            News & Press Updates
          </h1>
        </div>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-1.5 bg-[#F4F1EA] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] hover:bg-gray-200 cursor-pointer self-start sm:self-auto"
          >
            <X className="w-4 h-4" /> Cancel Edit
          </button>
        )}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] flex items-center justify-between gap-3 text-sm font-bold ${
            feedback.type === 'success'
              ? 'bg-[#E0F2F1] text-[#004D40]'
              : 'bg-red-100 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00897B]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Create / Edit Form */}
      <form
        onSubmit={handleSaveNews}
        className="bg-[#FFFFFE] p-6 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] space-y-5"
      >
        <h2 className="text-xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">
          {editingId ? 'Edit News Article' : 'Publish New Article'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-[#293241]">
              Headline / Title *
            </label>
            <input
              type="text"
              placeholder="News Title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-[#293241]">
              URL Slug *
            </label>
            <input
              type="text"
              placeholder="article-url-slug"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-mono"
              required
            />
          </div>
        </div>

        {/* Dual Image Input: Upload File OR Paste External URL (Cloudinary, etc.) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-[#293241]">
              Option 1: Upload Cover Image
            </label>
            <label className="cursor-pointer bg-[#F4F1EA] border-2 border-[#0A0A0A] p-3 text-sm font-medium flex items-center justify-between hover:bg-gray-100 transition-colors">
              <span className="truncate text-gray-700">
                {uploading ? 'Uploading...' : 'Choose image file...'}
              </span>
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#00897B]" />
              ) : (
                <Upload className="w-4 h-4 text-[#0A0A0A]" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-[#293241] flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-[#00897B]" /> Option 2:
              Cover Image URL (Cloudinary / External)
            </label>
            <input
              type="url"
              placeholder="https://res.cloudinary.com/.../image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-mono"
            />
          </div>
        </div>

        {/* Optional Date Override + Cover Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-[#293241]">
              Event / Publish Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium"
            />
          </div>

          {imageUrl && (
            <div className="flex items-center gap-3 p-2 bg-[#F4F1EA] border-2 border-[#0A0A0A]">
              <img
                src={imageUrl}
                alt="Cover preview"
                className="w-16 h-16 object-cover border border-[#0A0A0A] shrink-0"
              />
              <span className="text-xs font-mono break-all text-gray-700">
                {imageUrl}
              </span>
            </div>
          )}
        </div>

        {/* Short Excerpt */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-[#293241]">
            Short Excerpt (Card Summary) *
          </label>
          <textarea
            placeholder="Brief 1–2 sentence summary shown on news cards..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium h-20"
            required
          />
        </div>

        {/* Full Article Content */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-[#293241]">
            Full Article Content (Detailed Story)
          </label>
          <textarea
            placeholder="Write the full detailed story here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium h-48"
          />
        </div>

        <button
          type="submit"
          disabled={uploading || saving}
          className="bg-[#00897B] text-white font-bold px-6 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] uppercase text-sm flex items-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : editingId ? (
            <>
              <Edit3 className="w-4 h-4" /> Update Article
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Publish Article
            </>
          )}
        </button>
      </form>

      {/* Published Articles List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 text-sm font-bold text-[#293241]">
            Loading articles...
          </div>
        ) : news.length === 0 ? (
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 text-sm text-gray-600">
            No news articles published yet.
          </div>
        ) : (
          news.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-16 h-16 object-cover border-2 border-[#0A0A0A] shrink-0"
                  />
                )}
                <div>
                  <h3 className="font-bold text-xl font-['Bricolage_Grotesque'] text-[#293241]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">{item.excerpt}</p>
                  <p className="text-[11px] font-mono text-gray-400 mt-1">
                    /news/{item.slug} •{' '}
                    {item.content
                      ? `${item.content.length} chars full story`
                      : 'Excerpt only'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => startEditing(item)}
                  className="bg-[#293241] text-white p-2 border border-[#0A0A0A] hover:bg-[#00897B] transition-colors cursor-pointer"
                  title="Edit article"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteNews(item.id, item.title)}
                  className="bg-red-600 text-white p-2 border border-[#0A0A0A] hover:bg-red-700 transition-colors cursor-pointer"
                  title="Delete article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}