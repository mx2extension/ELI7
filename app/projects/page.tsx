
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  FolderKanban,
  Calendar,
  ArrowUpRight,
  Images,
  MapPin,
} from 'lucide-react';

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('event_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      }

      setProjects(data || []);
      setLoading(false);
    }

    fetchProjects();
  }, []);

  const categories = [
    'All',
    ...Array.from(
      new Set(
        projects.map((p) => p.category).filter(Boolean) as string[]
      )
    ),
  ];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen py-16 px-6 max-w-6xl mx-auto space-y-10">

      {/* Header Section */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
          <FolderKanban className="w-4 h-4" />
          Project Archives & Outreaches
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">
          Our Projects & Programs
        </h1>

        <p className="text-lg text-[#0A0A0A]/80 leading-relaxed">
          Explore individual outreaches, inclusion drives, and community
          programs. Open any project to read its brief and view its dedicated
          photo archive.
        </p>
      </div>

      {/* Category Filter Bar */}
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
          <p className="text-lg font-bold text-[#293241]">
            No projects documented yet.
          </p>
          <p className="text-sm text-[#0A0A0A]/70 mt-2">
            Check back soon for field reports and project photo albums.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">
          {filteredProjects.map((project) => {
            const uniquePhotos = Array.from(
              new Set(
                [project.image_url, ...(project.gallery_urls || [])].filter(
                  Boolean
                )
              )
            );

            const photoCount = uniquePhotos.length;

            return (
              <Link
                href={`/projects/${project.slug}`}
                key={project.id}
                className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] flex flex-col sm:flex-row overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#0A0A0A] transition-all min-h-[320px]"
              >
                {/* Project Image */}
                <div className="relative w-full sm:w-[38%] shrink-0 min-h-[220px] sm:min-h-[320px] border-b-2 sm:border-b-0 sm:border-r-2 border-[#0A0A0A] overflow-hidden bg-[#F4F1EA]">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#293241]/40 text-xs font-bold uppercase tracking-wider">
                      [Project Cover]
                    </div>
                  )}

                  {project.category && (
                    <span className="absolute top-3 left-3 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-[10px] uppercase px-2.5 py-1 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] max-w-[90%] truncate">
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

                {/* Project Information */}
                <div className="p-5 flex flex-col flex-grow justify-between gap-4 min-w-0">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug group-hover:text-[#EE6C4D] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-[#0A0A0A]/80 line-clamp-4 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t-2 border-[#0A0A0A]/10 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-[#0A0A0A]/60">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#EE6C4D] shrink-0" />
                        {new Date(
                          project.event_date || project.created_at
                        ).toLocaleDateString()}
                      </span>

                      {project.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#EE6C4D] shrink-0" />
                          {project.location}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="inline-flex items-center gap-1 bg-[#FFD23F] text-[#0A0A0A] font-bold text-xs uppercase px-3 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] group-hover:bg-[#EE6C4D] group-hover:text-[#FFFFFE] transition-colors">
                        Open Project
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
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
