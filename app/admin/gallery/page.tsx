'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Loader2, Trash2, PlusCircle, Image as ImageIcon, Link as LinkIcon, Upload, Edit3, X } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  title: string;
}

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
  category_id: string;
  gallery_categories?: {
    title: string;
  };
  created_at: string;
}

export default function AdminGalleryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categoryId, setCategoryId] = useState('');
  
  // Upload mode: 'file' or 'url'
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  // Note: We don't store file values in controlled inputs to avoid React warnings
  const [file, setFile] = useState<File | null>(null);
  
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingImages, setFetchingImages] = useState(true);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch categories and existing gallery images on load
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: catData } = await supabase
          .from('gallery_categories')
          .select('id, title')
          .order('title', { ascending: true });

        if (catData) setCategories(catData);

        const { data: imgData, error } = await supabase
          .from('gallery_images')
          .select('*, gallery_categories(title)')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching images:', error.message);
        } else if (imgData) {
          // Filter out any corrupted entries without valid IDs
          setImages(imgData.filter((img) => img && img.id));
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setFetchingImages(false);
      }
    }

    fetchData();
  }, []);

  // Populate form fields for editing
  const handleEditClick = (img: GalleryImage) => {
    setEditingId(img.id);
    setCategoryId(img.category_id || '');
    setImageUrl(img.image_url || '');
    setCaption(img.caption || '');
    setUploadMode('url'); // Switch to URL mode by default when editing to keep current URL intact if unchanged
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel edit mode and reset form
  const handleCancelEdit = () => {
    setEditingId(null);
    setCategoryId('');
    setImageUrl('');
    setFile(null);
    setCaption('');
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;

    if (!editingId && uploadMode === 'url' && !imageUrl) {
      alert('Please provide a valid image URL.');
      return;
    }

    if (!editingId && uploadMode === 'file' && !file) {
      alert('Please select an image file to upload.');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = imageUrl;

      // If file upload mode is chosen and a new file is provided, upload to Supabase Storage
      if (uploadMode === 'file' && file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery-bucket')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('gallery-bucket')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      if (editingId) {
        // UPDATE existing record
        const { data, error } = await supabase
          .from('gallery_images')
          .update({
            category_id: categoryId,
            image_url: finalImageUrl,
            caption: caption,
          })
          .eq('id', editingId)
          .select('*, gallery_categories(title)');

        if (error) {
          alert(`Error updating: ${error.message}`);
        } else if (data && data[0]) {
          setImages(images.map((img) => (img.id === editingId ? data[0] : img)));
          handleCancelEdit();
          alert('Image updated successfully!');
        }
      } else {
        // INSERT new record
        const { data, error } = await supabase
          .from('gallery_images')
          .insert([
            {
              category_id: categoryId,
              image_url: finalImageUrl,
              caption: caption,
            },
          ])
          .select('*, gallery_categories(title)');

        if (error) {
          alert(`Error: ${error.message}`);
        } else if (data && data[0]) {
          setImages([data[0], ...images]);
          setImageUrl('');
          setFile(null);
          setCaption('');
          setCategoryId('');
          alert('Image added successfully!');
        }
      }
    } catch (err: unknown) {
      console.error('Unexpected error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an image entry
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this image from the gallery?')) return;

    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      alert(`Error deleting image: ${error.message}`);
    } else {
      setImages(images.filter((img) => img.id !== id));
      if (editingId === id) handleCancelEdit();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 md:p-12 space-y-4">
        <span className="bg-[#FFD23F] text-[#0A0A0A] text-xs font-bold uppercase px-3 py-1 border border-[#0A0A0A]">
          Admin Control Center
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">
          Gallery Manager
        </h1>
        <p className="text-gray-600 text-sm md:text-base font-medium">
          Upload photo files directly, paste direct image links, or modify existing album records.
        </p>
        <div className="pt-2">
          <Link 
            href="/gallery" 
            className="inline-block bg-[#293241] text-white px-4 py-2 text-xs font-bold uppercase border-2 border-[#0A0A0A] hover:bg-[#00897B] transition-colors"
          >
            &larr; View Live Gallery
          </Link>
        </div>
      </div>

      {/* Add / Edit Image Form */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-6 max-w-2xl mx-auto"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] uppercase flex items-center gap-2">
            {editingId ? (
              <>
                <Edit3 className="w-6 h-6 text-[#FFD23F]" /> Edit Gallery Image
              </>
            ) : (
              <>
                <PlusCircle className="w-6 h-6 text-[#00897B]" /> Add New Gallery Image
              </>
            )}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs font-bold uppercase text-gray-500 hover:text-red-500 flex items-center gap-1 border border-gray-300 px-2 py-1"
            >
              <X className="w-4 h-4" /> Cancel Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-[#293241]">
              Select Album Category
            </label>
            <select 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)} 
              className="w-full p-3 border-2 border-[#0A0A0A] bg-[#FFFFFE] font-medium text-sm"
              required
            >
              <option value="">-- Choose Album Sector --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-[#293241]">
              Input Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`py-2.5 px-4 text-xs font-bold uppercase border-2 border-[#0A0A0A] flex items-center justify-center gap-2 transition-all ${
                  uploadMode === 'file' ? 'bg-[#FFD23F] shadow-[2px_2px_0px_#0A0A0A]' : 'bg-[#FFFFFE] hover:bg-gray-50'
                }`}
              >
                <Upload className="w-4 h-4" /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`py-2.5 px-4 text-xs font-bold uppercase border-2 border-[#0A0A0A] flex items-center justify-center gap-2 transition-all ${
                  uploadMode === 'url' ? 'bg-[#FFD23F] shadow-[2px_2px_0px_#0A0A0A]' : 'bg-[#FFFFFE] hover:bg-gray-50'
                }`}
              >
                <LinkIcon className="w-4 h-4" /> Paste Image Link
              </button>
            </div>
          </div>

          {/* Conditional Input based on mode (Uncontrolled file input fixed) */}
          {uploadMode === 'file' ? (
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-[#293241]">
                Choose Image File {editingId && '(Leave empty to keep current image)'}
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                className="w-full p-2.5 border-2 border-[#0A0A0A] bg-[#FFFFFE] font-medium text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-[#293241] file:text-white hover:file:bg-[#00897B]"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-[#293241]">
                Image URL Link
              </label>
              <input 
                type="url" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                placeholder="https://images.unsplash.com/photo-..." 
                className="w-full p-3 border-2 border-[#0A0A0A] bg-[#FFFFFE] font-medium text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-[#293241]">
              Caption / Description (Optional)
            </label>
            <input 
              type="text" 
              value={caption} 
              onChange={(e) => setCaption(e.target.value)} 
              placeholder="E.g., Community outreach session..." 
              className="w-full p-3 border-2 border-[#0A0A0A] bg-[#FFFFFE] font-medium text-sm"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full text-white py-3.5 font-bold uppercase border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] transition-colors flex items-center justify-center gap-2 ${
            editingId ? 'bg-[#FFD23F] text-[#0A0A0A] hover:bg-[#293241] hover:text-white' : 'bg-[#00897B] hover:bg-[#293241]'
          }`}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingId ? 'Update Gallery Item' : 'Save Image to Album'}
        </button>
      </form>

      {/* Existing Gallery Management Feed */}
      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] uppercase">
          Manage Existing Gallery Items ({images.length})
        </h2>

        {fetchingImages ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#00897B]" />
          </div>
        ) : images.length === 0 ? (
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-12 text-center shadow-[8px_8px_0px_#0A0A0A]">
            <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="font-bold text-gray-700">No gallery images found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => {
              if (!img || !img.id) return null; // Safe guard against undefined row structures
              return (
                <div 
                  key={img.id} 
                  className={`bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-4 flex flex-col justify-between ${
                    editingId === img.id ? 'ring-4 ring-[#FFD23F]' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="h-48 border-2 border-[#0A0A0A] bg-gray-100 overflow-hidden relative">
                      <img 
                        src={img.image_url} 
                        alt={img.caption || 'Gallery item'} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute top-2 left-2 bg-[#FFD23F] text-[#0A0A0A] text-[10px] font-bold uppercase px-2 py-0.5 border border-[#0A0A0A]">
                        {img.gallery_categories?.title || 'Uncategorized'}
                      </span>
                    </div>
                    
                    <p className="text-xs font-bold text-[#293241] line-clamp-2">
                      {img.caption || <span className="text-gray-400 italic">No caption provided</span>}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-[10px] text-gray-500 font-mono">
                      {img.created_at ? new Date(img.created_at).toLocaleDateString() : ''}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => handleEditClick(img)}
                        className="bg-[#FFD23F] text-[#0A0A0A] px-3 py-1.5 text-xs font-bold uppercase border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#293241] hover:text-white transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDelete(img.id)}
                        className="bg-[#E63946] text-white px-3 py-1.5 text-xs font-bold uppercase border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#293241] transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
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