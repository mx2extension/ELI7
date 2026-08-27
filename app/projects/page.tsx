import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowUpRight, FolderKanban, Calendar } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  created_at: string;
}

async function getProjects(): Promise<Project[]> {
  const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  return data || [];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto space-y-12">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
          <FolderKanban className="w-4 h-4" /> Strategic Initiatives
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">Our Projects & Programs</h1>
        <p className="text-lg text-[#0A0A0A]/80 leading-relaxed">Discover our active deployments, digital resource hubs, and private-sector-led promotion initiatives driving growth across various regions.</p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center">
          <p className="text-lg font-bold text-[#293241]">No projects listed at the moment.</p>
          <p className="text-sm text-[#0A0A0A]/70 mt-2">Check back soon for updates from our administrative portal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="h-56 border-b-2 border-[#0A0A0A] overflow-hidden bg-[#00897B]">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40 text-xs font-bold uppercase tracking-wider">[Project Visual]</div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug">{project.title}</h3>
                  <p className="text-sm text-[#0A0A0A]/80 line-clamp-3 leading-relaxed">{project.description}</p>
                </div>
                <div className="pt-4 border-t-2 border-[#0A0A0A]/10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A]/60">
                    <Calendar className="w-3.5 h-3.5 text-[#C62828]" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                  <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-1 bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] transition-colors">
                    View Project <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}