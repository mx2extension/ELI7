
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import {
  Loader2,
  Trash2,
  PlusCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Edit3,
  X,
} from 'lucide-react';

interface Category {
  id: string;
  title: string;
}

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  category_id: string;
  created_at: string;
  gallery_categories?: {
    title: string;
  } | null;
}

export default function AdminGalleryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingImages, setFetchingImages] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: catData, error: catError } = await supabase
          .from('gallery_categories')
          .select('id, title')
          .order('title', { ascending: true });

        if (catError) throw catError;

        setCategories(catData || []);

        const { data: imgData, error: imgError } = await supabase
          .from('gallery_images')
          .select('*, gallery_categories(title)')
          .order('created_at', { ascending: false });

        if (imgError) throw imgError;

        setImages((imgData || []) as GalleryImage[]);
      } catch (error) {
        console.error('Gallery loading error:', error);
      } finally {
        setFetchingImages(false);
      }
    }

    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setCategoryId('');
    setImageUrl('');
    setFile(null);
    setCaption('');
    setUploadMode('file');

    // Reset the browser's file input without controlling its value.
    const fileInput = document.getElementById(
      'gallery-file-input'
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleEditClick = (img: GalleryImage) => {
    setEditingId(img.id);
    setCategoryId(img.category_id || '');
    setImageUrl(img.image_url || '');
    setCaption(img.caption || '');
    setFile(null);
    setUploadMode('url');

    const fileInput = document.getElementById(
      'gallery-file-input'
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModeChange = (mode: 'file' | 'url') => {
    setUploadMode(mode);
    setFile(null);

    const fileInput = document.getElementById(
      'gallery-file-input'
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryId) {
      alert('Please select an album category.');
      return;
    }

    if (uploadMode === 'file' && !editingId && !file) {
      alert('Please select an image file.');
      return;
    }

    if (uploadMode === 'url' && !imageUrl.trim()) {
      alert('Please provide an image URL.');
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = imageUrl.trim();

      if (uploadMode === 'file' && file) {
        const extension = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}.${extension}`;

        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery-bucket')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('gallery-bucket')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      if (editingId) {
        const { data, error } = await supabase
          .from('gallery_images')
          .update({
            category_id: categoryId,
            image_url: finalImageUrl,
            caption: caption.trim(),
          })
          .eq('id', editingId)
          .select('*, gallery_categories(title)');

        if (error) throw error;

        if (data?.[0]) {
          setImages((previous) =>
            previous.map((img) =>
              img.id === editingId
                ? (data[0] as GalleryImage)
                : img
            )
          );

          resetForm();
          alert('Image updated successfully!');
        }
      } else {
        const { data, error } = await supabase
          .from('gallery_images')
          .insert({
            category_id: categoryId,
            image_url: finalImageUrl,
            caption: caption.trim(),
          })
          .select('*, gallery_categories(title)');

        if (error) throw error;

        if (data?.[0]) {
          setImages((previous) => [
            data[0] as GalleryImage,
            ...previous,
          ]);

          resetForm();
          alert('Image added successfully!');
        }
      }
    } catch (error: unknown) {
      console.error('Gallery save error:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Unable to save gallery image.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setImages((previous) =>
        previous.filter((img) => img.id !== id)
      );

      if (editingId === id) resetForm();
    } catch (error: unknown) {
      alert(
        error instanceof Error
          ? error.message
          : 'Unable to delete image.'
      );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-10">

      {/* HEADER */}
      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] sm:shadow-[6px_6px_0px_#0A0A0A] p-4 sm:p-7 md:p-10 space-y-3">
        <span className="inline-block bg-[#FFD23F] text-[#0A0A0A] text-[9px] sm:text-xs font-bold uppercase px-2.5 py-1 border border-[#0A0A0A]">
          Admin Control Center
        </span>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#293241]">
          Gallery Manager
        </h1>

        <p className="text-gray-600 text-xs sm:text-sm md:text-base">
          Upload photos, paste image links, or edit existing gallery images.
        </p>

        <Link
          href="/gallery"
          className="inline-block bg-[#293241] text-white px-3 py-2 text-[10px] sm:text-xs font-bold uppercase border-2 border-[#0A0A0A] hover:bg-[#00897B]"
        >
          ← View Live Gallery
        </Link>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] sm:shadow-[6px_6px_0px_#0A0A0A] p-4 sm:p-6 md:p-8 space-y-5 max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-xl font-extrabold text-[#293241] uppercase flex items-center gap-2">
            {editingId ? (
              <>
                <Edit3 className="w-5 h-5 text-[#FFD23F]" />
                Edit Gallery Image
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5 text-[#00897B]" />
                Add New Image
              </>
            )}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-[10px] sm:text-xs font-bold uppercase text-red-500 border border-gray-300 px-2 py-1.5 flex items-center gap-1"
            >
              <X size={13} />
              Cancel
            </button>
          )}
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-[10px] sm:text-xs font-bold uppercase mb-2">
            Select Album Category
          </label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2.5 sm:p-3 border-2 border-[#0A0A0A] bg-white text-xs sm:text-sm"
            required
          >
            <option value="">-- Choose Album Sector --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* INPUT METHOD */}
        <div>
          <label className="block text-[10px] sm:text-xs font-bold uppercase mb-2">
            Input Method
          </label>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => handleModeChange('file')}
              className={`py-2.5 px-2 text-[10px] sm:text-xs font-bold uppercase border-2 border-[#0A0A0A] flex items-center justify-center gap-1.5 ${
                uploadMode === 'file'
                  ? 'bg-[#FFD23F] shadow-[2px_2px_0px_#0A0A0A]'
                  : 'bg-white'
              }`}
            >
              <Upload size={15} />
              Upload File
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('url')}
              className={`py-2.5 px-2 text-[10px] sm:text-xs font-bold uppercase border-2 border-[#0A0A0A] flex items-center justify-center gap-1.5 ${
                uploadMode === 'url'
                  ? 'bg-[#FFD23F] shadow-[2px_2px_0px_#0A0A0A]'
                  : 'bg-white'
              }`}
            >
              <LinkIcon size={15} />
              Image Link
            </button>
          </div>
        </div>

        {/* FILE INPUT: ALWAYS MOUNTED, NEVER CONTROLLED */}
        <div className={uploadMode === 'file' ? 'block' : 'hidden'}>
          <label
            htmlFor="gallery-file-input"
            className="block text-[10px] sm:text-xs font-bold uppercase mb-2"
          >
            Choose Image File
            {editingId && ' (Optional when editing)'}
          </label>

          <input
            id="gallery-file-input"
            name="gallery-image-file"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.currentTarget.files?.item(0) ?? null;
              setFile(selectedFile);
            }}
            className="w-full p-2 border-2 border-[#0A0A0A] bg-white text-xs sm:text-sm file:mr-2 file:py-2 file:px-2 file:border-0 file:text-[10px] file:font-bold file:bg-[#293241] file:text-white"
          />
        </div>

        {/* URL INPUT */}
        <div className={uploadMode === 'url' ? 'block' : 'hidden'}>
          <label
            htmlFor="gallery-image-url"
            className="block text-[10px] sm:text-xs font-bold uppercase mb-2"
          >
            Image URL Link
          </label>

          <input
            id="gallery-image-url"
            name="gallery-image-url"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full p-2.5 sm:p-3 border-2 border-[#0A0A0A] bg-white text-xs sm:text-sm"
          />
        </div>

        {/* CAPTION */}
        <div>
          <label
            htmlFor="gallery-caption"
            className="block text-[10px] sm:text-xs font-bold uppercase mb-2"
          >
            Caption / Description (Optional)
          </label>

          <input
            id="gallery-caption"
            name="gallery-caption"
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="E.g., Community outreach session..."
            className="w-full p-2.5 sm:p-3 border-2 border-[#0A0A0A] bg-white text-xs sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-bold uppercase text-xs sm:text-sm border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center gap-2 disabled:opacity-60 ${
            editingId
              ? 'bg-[#FFD23F] text-[#0A0A0A]'
              : 'bg-[#00897B] text-white'
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Processing...
            </>
          ) : editingId ? (
            'Update Gallery Item'
          ) : (
            'Save Image to Album'
          )}
        </button>
      </form>

      {/* GALLERY ITEMS */}
      <div className="space-y-4 sm:space-y-6 pt-3 sm:pt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg sm:text-2xl font-extrabold text-[#293241] uppercase">
            Gallery Items
          </h2>

          <span className="bg-[#FFD23F] text-[#0A0A0A] text-[10px] sm:text-xs font-bold px-2.5 py-1 border border-[#0A0A0A]">
            {images.length} Images
          </span>
        </div>

        {fetchingImages ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-[#00897B]" />
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white border-2 border-[#0A0A0A] p-8 sm:p-12 text-center shadow-[3px_3px_0px_#0A0A0A]">
            <ImageIcon className="w-9 h-9 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">
              No gallery images found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {images.map((img) => (
              <div
                key={img.id}
                className={`bg-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] sm:shadow-[5px_5px_0px_#0A0A0A] p-3 sm:p-4 ${
                  editingId === img.id ? 'ring-2 ring-[#FFD23F]' : ''
                }`}
              >
                <div className="h-40 sm:h-48 border-2 border-[#0A0A0A] bg-gray-100 overflow-hidden relative">
                  <img
                    src={img.image_url}
                    alt={img.caption || 'Gallery image'}
                    className="w-full h-full object-cover"
                  />

                  <span className="absolute top-2 left-2 bg-[#FFD23F] text-[#0A0A0A] text-[9px] sm:text-[10px] font-bold uppercase px-2 py-1 border border-[#0A0A0A]">
                    {img.gallery_categories?.title || 'Uncategorized'}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#293241] mt-3 line-clamp-2">
                  {img.caption || (
                    <span className="text-gray-400 italic">
                      No caption provided
                    </span>
                  )}
                </p>

                <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center gap-2">
                  <span className="text-[9px] sm:text-[10px] text-gray-500">
                    {img.created_at
                      ? new Date(img.created_at).toLocaleDateString()
                      : ''}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(img)}
                      className="bg-[#FFD23F] text-[#0A0A0A] px-2.5 py-1.5 text-[10px] sm:text-xs font-bold uppercase border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] flex items-center gap-1"
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(img.id)}
                      className="bg-[#E63946] text-white px-2.5 py-1.5 text-[10px] sm:text-xs font-bold uppercase border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
