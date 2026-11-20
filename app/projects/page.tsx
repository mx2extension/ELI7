'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { FolderKanban, Calendar, ArrowUpRight, Images, MapPin } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  category?: string;
  location?: string;
  event_date?: string;
  description: string; // Short brief for the project
  image_url?: string;  // Cover photo
  gallery_urls?: string[]; // Additional photos strictly for this project
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('event_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      setProjects(data || []);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  // Extract unique categories if assigned in Supabase
  const categories = [
    'All',
    ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[])),
  ];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
          <FolderKanban className="w-4 h-4" /> Project Archives & Outreaches
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">
          Our Projects & Programs
        </h1>
        <p className="text-lg text-[#0A0A0A]/80 leading-relaxed">
          Explore individual outreaches, inclusion drives, and community programs. Open any project to read its brief and view its dedicated photo archive.
        </p>
      </div>

      {/* Category Filter Bar (Only renders if projects have categories assigned) */}
      {!loading && categories.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs font-bold uppercase border-2 border-[#0A0A0A] transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#293241] text-[#FFFFFE] shadow-[3px_3px_0px_#EE6C4D]'
                    : 'bg-[#FFFFFE] text-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FFD23F]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center font-bold text-[#293241]">
          Loading project archives...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center">
          <p className="text-lg font-bold text-[#293241]">No projects documented yet.</p>
          <p className="text-sm text-[#0A0A0A]/70 mt-2">
            Check back soon for field reports and project photo albums.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            // Deduplicate cover image + gallery_urls for accurate photo count
            const uniquePhotos = Array.from(
              new Set(
                [project.image_url, ...(project.gallery_urls || [])].filter(Boolean)
              )
            );
            const photoCount = uniquePhotos.length;

            return (
              <Link
                href={`/projects/${project.slug}`}
                key={project.id}
                className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_#0A0A0A] transition-all"
              >
                {/* Cover Image & Badges */}
                <div className="relative h-56 border-b-2 border-[#0A0A0A] overflow-hidden bg-[#F4F1EA]">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#293241]/40 text-xs font-bold uppercase tracking-wider">
                      [Project Cover]
                    </div>
                  )}

                  {project.category && (
                    <span className="absolute top-3 left-3 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-[11px] uppercase px-2.5 py-1 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                      {project.category}
                    </span>
                  )}

                  {photoCount > 0 && (
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-[#0A0A0A] text-[#FFFFFE] font-bold text-xs px-2.5 py-1 border border-white/20">
                      <Images className="w-3.5 h-3.5 text-[#FFD23F]" />
                      {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                    </span>
                  )}
                </div>

                {/* Project Brief & Footer */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug group-hover:text-[#EE6C4D] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#0A0A0A]/80 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t-2 border-[#0A0A0A]/10 flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-1 text-xs font-bold text-[#0A0A0A]/60">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#EE6C4D]" />
                        {new Date(project.event_date || project.created_at).toLocaleDateString()}
                      </span>
                      {project.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#EE6C4D]" />
                          {project.location}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] group-hover:bg-[#EE6C4D] group-hover:text-[#FFFFFE] transition-colors shrink-0">
                      Open Project <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}