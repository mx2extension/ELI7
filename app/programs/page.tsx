import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Program } from '@/types/database';
import { ArrowUpRight, PlayCircle } from 'lucide-react';

async function getPrograms(): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }

  return data || [];
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <main className="min-h-screen bg-transparent text-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Introduction */}
        <section className="mb-12">
          <span className="text-[#C62828] font-bold text-xs tracking-widest uppercase">
            Learn. Participate. Make an Impact.
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold font-['Bricolage_Grotesque'] text-[#0A0A0A] mt-3">
            Our Programs
          </h1>

          <p className="text-base md:text-lg text-[#0A0A0A] mt-4 max-w-2xl leading-relaxed">
            Explore the conversations, learning experiences, outreach and
            initiatives through which ELI7 Foundation promotes inclusion,
            expands access to knowledge and creates opportunities for
            communities to participate in development.
          </p>

          <details className="group mt-5 max-w-3xl">
            <summary className="cursor-pointer list-none inline-flex items-center gap-2 font-bold text-[#C62828] hover:underline">
              <span className="group-open:hidden">
                See more about our work
              </span>
              <span className="hidden group-open:inline">
                See less
              </span>
              <span className="text-lg group-open:rotate-180 transition-transform">
                ↓
              </span>
            </summary>

            <div className="pt-5 space-y-4 text-[#0A0A0A] font-medium leading-relaxed">
              <p>
                At ELI7 Foundation, we believe development should include
                everyone. For too long, support for persons with disabilities
                has stopped at occasional relief funds or isolated educational
                aid, leaving too many locked out of the digital skills, digital
                awareness, and everyday learning opportunities available to the
                wider public.
              </p>

              <p>
                True inclusion means participating as equal members of
                society—not on the sidelines—and that includes the digital
                world. We advocate for persons with disabilities, particularly
                women and girls, to have full, equal opportunities to learn,
                build digital literacy, contribute ideas, and shape the
                solutions that affect their lives.
              </p>

              <p>
                Our work bridges knowledge and opportunity gaps across
                education, digital and technology inclusion, women&apos;s
                empowerment, healthcare, agriculture, entrepreneurship, skills
                development, and community outreach. We use online
                conversations, X Spaces, videos, virtual engagements, and
                physical community activities to make learning and
                participation accessible to all.
              </p>

              <p>
                Inclusion is not a separate consideration in our work—it is
                how we approach every initiative. Everyone deserves the
                opportunity to be fully included, both offline and in the
                digital world.
              </p>
            </div>
          </details>
        </section>

        {/* Programmes */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
            <div>
              <span className="text-[#00897B] font-bold text-xs tracking-widest uppercase">
                Explore and Discover
              </span>

              <h2 className="text-2xl md:text-3xl font-bold font-['Bricolage_Grotesque'] text-[#0A0A0A] mt-2">
                Programs and Experiences
              </h2>
            </div>

            <p className="text-sm text-[#0A0A0A] font-medium">
              Discover our activities, conversations and initiatives.
            </p>
          </div>

          {programs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <article key={program.id} className="group flex flex-col">
                  <Link
                    href={`/programs/${program.slug}`}
                    className="block"
                    aria-label={`View ${program.title}`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden border-2 border-[#0A0A0A] bg-[#F4F1EA]">
                      {program.hero_image ? (
                        <img
                          src={program.hero_image}
                          alt={program.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#00897B]/10">
                          <PlayCircle className="w-14 h-14 text-[#00897B]" />
                        </div>
                      )}

                      <div className="absolute top-3 left-3 bg-[#C62828] text-white text-xs font-bold uppercase tracking-wide px-3 py-2 border border-[#0A0A0A]">
                        {program.category}
                      </div>
                    </div>
                  </Link>

                  <div className="pt-5 flex flex-col flex-1">
                    <h3 className="text-xl md:text-2xl font-bold font-['Bricolage_Grotesque'] text-[#0A0A0A] leading-snug mb-3">
                      {program.title}
                    </h3>

                    <p className="text-sm text-[#0A0A0A] leading-relaxed mb-5">
                      {program.short_description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-[#0A0A0A]/20">
                      <Link
                        href={`/programs/${program.slug}`}
                        className="inline-flex items-center gap-2 text-[#C62828] font-bold text-sm hover:underline"
                      >
                        View Program
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-10 text-[#0A0A0A] font-medium">
              Our programs are being updated. Please check back soon.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}