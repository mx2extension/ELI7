'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { 
  Heart, 
  Users, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles, 
  Quote,
  ChevronDown
} from 'lucide-react';

interface PreviewItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image_url?: string;
  cover_image_url?: string;
  description?: string;
  created_at: string;
}

export default function HomePage() {
  const [latestNews, setLatestNews] = useState<PreviewItem[]>([]);
  const [latestStories, setLatestStories] = useState<PreviewItem[]>([]);
  const [latestGalleries, setLatestGalleries] = useState<PreviewItem[]>([]);
  const [corePillars, setCorePillars] = useState<PreviewItem[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch dynamic categories for Core Pillars (limit to 4)
      const { data: categories } = await supabase
        .from('gallery_categories')
        .select('id, title, slug, description, cover_image_url, created_at')
        .order('created_at', { ascending: true })
        .limit(4);
      setCorePillars(categories || []);

      // 2. Fetch Latest News
      const { data: news } = await supabase
        .from('news')
        .select('id, title, slug, excerpt, image_url, created_at')
        .order('created_at', { ascending: false })
        .limit(4);
      setLatestNews(news || []);

      // 3. Fetch Latest Stories
      const { data: stories } = await supabase
        .from('stories')
        .select('id, title, slug, excerpt, image_url, created_at')
        .order('created_at', { ascending: false })
        .limit(4);
      setLatestStories(stories || []);

      // 4. Fetch Latest Galleries from gallery_categories
      const { data: galleries } = await supabase
        .from('gallery_categories')
        .select('id, title, slug, description, cover_image_url, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      setLatestGalleries(galleries || []);
    }
    fetchData();
  }, []);

  const faqs = [
    {
      question: "How are financial donations utilized?",
      answer: "Every contribution goes directly toward our active community programs, including food welfare distributions, educational material supply, and digital literacy workshops for vulnerable populations across Nigeria."
    },
    {
      question: "Can I volunteer or support remotely?",
      answer: "Yes! Beyond hands-on field volunteering, we welcome digital advocates, campaign mobilizers, and technical contributors who want to help expand our reach."
    },
    {
      question: "How do I make a direct bank transfer?",
      answer: "You can support our mission via direct bank transfers to our official institutional accounts on the donate page. Visit our donate page for details."
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <ScrollReveal>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3.5 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
              <Sparkles className="w-4 h-4" /> Women-Led Nationwide Impact & Support
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight leading-tight">
              Extending Love, Empowering Communities, and Building Futures Across Nigeria
            </h1>

            <p className="text-lg text-[#0A0A0A]/80 leading-relaxed font-medium">
              We are a dedicated women-led organization building a framework where vulnerable populations, persons with disabilities, and underserved communities thrive as equal participants in society. Through your support, we break barriers and build sustainable futures across Nigeria.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-sm uppercase px-6 py-3.5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                Support Our Cause <Heart className="w-5 h-5 fill-current" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-sm uppercase px-6 py-3.5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#00897B] hover:text-white hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                Our Projects <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="bg-[#00897B] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-4 md:p-6 text-white space-y-4">
            <div className="h-72 border-2 border-[#0A0A0A] overflow-hidden bg-[#FFFFFE]">
              <img 
                src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787232909/1d6b61c3-2f2a-4ad8-b810-6ba70ea816f8.png" 
                alt="Community Impact" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#FFD23F] font-bold">Nationwide Reach</p>
                <p className="text-2xl font-extrabold font-['Bricolage_Grotesque']">Empowering Lives Daily</p>
              </div>
              <div className="bg-[#C62828] text-white p-3 border-2 border-[#0A0A0A]">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. CORE PILLARS (FETCHED FROM CATEGORIES) */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#C62828] text-white px-3 py-1 border border-[#0A0A0A]">Our Focus</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              The Mission & Goals Of Our Foundation
            </h2>
            <p className="text-[#0A0A0A]/80 leading-relaxed text-base">
              We catalyze inclusive transformation by expanding opportunities through structured education, digital literacy, economic support, and community protection initiatives.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {corePillars.map((category, index) => {
              const IconComponent = index % 2 === 0 ? ShieldCheck : Heart;
              const badgeColor = index % 2 === 0 ? 'bg-[#C62828]' : 'bg-[#00897B]';

              return (
                <div key={category.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] overflow-hidden flex flex-col justify-between group">
                  <div className="h-36 border-b-2 border-[#0A0A0A] overflow-hidden bg-[#00897B]">
                    {category.cover_image_url ? (
                      <img src={category.cover_image_url} alt={category.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase text-white/40">[Pillar Visual]</div>
                    )}
                  </div>
                  <div className="p-6 space-y-3 flex flex-col flex-grow justify-between">
                    <div className="space-y-3">
                      <div className={`w-10 h-10 ${badgeColor} border-2 border-[#0A0A0A] flex items-center justify-center shadow-[2px_2px_0px_#0A0A0A] -mt-10 relative z-10 text-white`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-[#293241] font-['Bricolage_Grotesque']">{category.title}</h3>
                      {category.description && (
                        <p className="text-sm text-[#0A0A0A]/80 leading-relaxed line-clamp-3">{category.description}</p>
                      )}
                    </div>
                    <div className="pt-4">
                      <Link href={`/gallery/${category.slug}`} className="inline-flex items-center gap-1 font-bold text-xs uppercase text-[#00897B] hover:text-[#0A0A0A] transition-colors underline underline-offset-4">
                        Explore Category &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* 3. DIRECTOR OF OPERATIONS NOTE */}
      <section className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-8 md:p-14 relative">
            <div className="absolute -top-6 -left-6 bg-[#C62828] text-white border-2 border-[#0A0A0A] p-4 shadow-[4px_4px_0px_#0A0A0A]">
              <Quote className="w-8 h-8" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pt-4">
              <div className="h-80 border-2 border-[#0A0A0A] bg-[#00897B] shadow-[6px_6px_0px_#0A0A0A] overflow-hidden">
                <img 
                  src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787737369/d2ab0c13-fa51-4d64-b2a3-765caa32c239.png" 
                  alt="Amarachi Sunday" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2 border-b-2 border-[#0A0A0A] pb-4">
                  <span className="inline-block bg-[#C62828] text-white font-bold text-xs uppercase px-2.5 py-1 border border-[#0A0A0A]">
                    Director of Operations — Executive Leadership Note
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                    A Personal Note to Our Supporters and Partners
                  </h2>
                </div>

                <div className="space-y-4 text-[#0A0A0A]/80 text-base md:text-lg leading-relaxed font-medium">
                  <p>
                    &ldquo;Overseeing the entire scope and vision of the ELI7 Foundation, I see firsthand the profound resilience of the Nigerian people, and equally, the immense challenges faced by vulnerable groups and persons with disabilities. 
                  </p>
                  <p>
                    True transformation cannot happen from a distance. It takes all of us—our hearts, our resources, and our unwavering commitment—to dismantle barriers and build a truly inclusive society. Every project we run, from food welfare to digital skills empowerment, relies on the generosity of partners like you.
                  </p>
                  <p className="font-bold text-[#293241]">
                    When you support our work, you aren&apos;t just giving to a foundation; you are restoring dignity and creating real, lasting change for families across Nigeria who need it most. Join hands with us today.&rdquo;
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-extrabold text-xl text-[#293241] font-['Bricolage_Grotesque']">Amarachi Sunday</p>
                    <p className="text-sm font-bold text-[#C62828] uppercase">Director of Operations, ELI7 Foundation</p>
                  </div>
                  <Link
                    href="/donate"
                    className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-5 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] hover:text-white transition-colors"
                  >
                    Back Our Projects <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. BE THE CHANGE */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#00897B] text-white px-3 py-1 border border-[#0A0A0A]">Support Us</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Be the Change You Wish to See
            </h2>
            <p className="text-[#0A0A0A]/80 text-sm">Choose how you want to contribute and make an immediate impact on vulnerable lives.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden">
              <div className="h-48 border-b-2 border-[#0A0A0A] bg-[#00897B]">
                <img src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787231895/dafb89d5-fa43-4a50-b39f-c969e1f9bffe.png" alt="Donate" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-4 flex flex-col flex-grow justify-between">
                <div className="space-y-3">
                  <span className="bg-[#00897B] text-white text-xs font-bold uppercase px-2.5 py-1 border border-[#0A0A0A]">Donate</span>
                  <h3 className="text-xl font-bold text-[#293241] font-['Bricolage_Grotesque']">Every Penny Goes Towards Impactful Programs</h3>
                  <p className="text-sm text-[#0A0A0A]/80 leading-relaxed">Direct financial support fuels our ongoing field distributions, educational drives, and community empowerment initiatives.</p>
                </div>
                <Link href="/donate" className="inline-flex items-center gap-2 bg-[#00897B] text-white font-bold text-xs uppercase px-4 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#293241] transition-colors">
                  Support the Cause <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden">
              <div className="h-48 border-b-2 border-[#0A0A0A] bg-[#00897B]">
                <img src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787233915/6e1d1e38-7c35-4b56-bf27-727c54f470b4.png" alt="Volunteer" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-4 flex flex-col flex-grow justify-between">
                <div className="space-y-3">
                  <span className="bg-[#C62828] text-white text-xs font-bold uppercase px-2.5 py-1 border border-[#0A0A0A]">Volunteer</span>
                  <h3 className="text-xl font-bold text-[#293241] font-['Bricolage_Grotesque']">Join Our Hands-On Efforts</h3>
                  <p className="text-sm text-[#0A0A0A]/80 leading-relaxed">Give your time and skills to support field distributions, workshops, and community mentorship programs.</p>
                </div>
                <Link href="/volunteer" className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-4 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#293241] transition-colors">
                  Become a Volunteer <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden">
              <div className="h-48 border-b-2 border-[#0A0A0A] bg-[#00897B]">
                <img src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787238632/5fb9af94-f599-4461-9c72-312714242377.png" alt="Fundraise" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-4 flex flex-col flex-grow justify-between">
                <div className="space-y-3">
                  <span className="bg-[#00897B] text-white text-xs font-bold uppercase px-2.5 py-1 border border-[#0A0A0A]">Fundraise</span>
                  <h3 className="text-xl font-bold text-[#293241] font-['Bricolage_Grotesque']">Mobilize Your Network</h3>
                  <p className="text-sm text-[#0A0A0A]/80 leading-relaxed">Set up peer campaigns or corporate giving channels to support our nationwide projects and expansion goals.</p>
                </div>
                <Link href="/donate" className="inline-flex items-center gap-2 bg-[#00897B] text-white font-bold text-xs uppercase px-4 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#293241] transition-colors">
                  Support the Cause <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. EVENT GALLERIES (FETCHED FROM gallery_categories) */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <ScrollReveal>
          <div className="space-y-4 border-b-2 border-[#0A0A0A] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#00897B] text-white px-3 py-1 border border-[#0A0A0A]">Visual Highlights</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] mt-2">Event Galleries</h2>
            </div>
            <Link href="/gallery" className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#00897B] hover:text-white transition-colors">
              View More Galleries <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        {latestGalleries.length === 0 ? (
          <ScrollReveal>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center space-y-3">
              <p className="text-lg font-bold text-[#293241]">No galleries published yet.</p>
              <p className="text-sm text-[#0A0A0A]/70">Check back soon for event photos and visual highlights.</p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestGalleries.map((gallery) => (
                <div key={gallery.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden group">
                  <div className="h-64 border-b-2 border-[#0A0A0A] bg-[#00897B] overflow-hidden">
                    {gallery.cover_image_url ? (
                      <img src={gallery.cover_image_url} alt={gallery.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase text-white/40">[Gallery Visual]</div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug">{gallery.title}</h3>
                    {gallery.description && (
                      <p className="text-sm text-[#0A0A0A]/80 line-clamp-2 leading-relaxed">{gallery.description}</p>
                    )}
                    <Link href={`/gallery/${gallery.slug}`} className="inline-flex items-center gap-1 font-bold text-xs uppercase text-[#00897B] hover:text-[#0A0A0A] transition-colors underline underline-offset-4">
                      View More &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* 6. NEWS & ARTICLES */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <ScrollReveal>
          <div className="space-y-4 border-b-2 border-[#0A0A0A] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#C62828] text-white px-3 py-1 border border-[#0A0A0A]">Updates</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight mt-2">News & Articles</h2>
            </div>
            <Link href="/news" className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#C62828] hover:text-white transition-colors">
              View More News <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        {latestNews.length === 0 ? (
          <ScrollReveal>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center space-y-3">
              <p className="text-lg font-bold text-[#293241]">No news articles published yet.</p>
              <p className="text-sm text-[#0A0A0A]/70">Check back soon for updates from our team.</p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestNews.map((item) => (
                <div key={item.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
                  <div className="w-full sm:w-48 h-48 sm:h-52 border-2 border-[#0A0A0A] bg-[#00897B] flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase text-white/40">[News Visual]</div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between flex-grow space-y-3">
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-[#0A0A0A]/60 block">
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug">{item.title}</h3>
                    </div>
                    <div className="pt-2">
                      <Link href={`/news/${item.slug}`} className="inline-flex items-center gap-1 font-bold text-xs uppercase text-[#00897B] hover:text-[#0A0A0A] transition-colors underline underline-offset-4">
                        Read More &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* 7. STORIES OF IMPACT */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <ScrollReveal>
          <div className="space-y-4 border-b-2 border-[#0A0A0A] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#00897B] text-white px-2.5 py-1 border border-[#0A0A0A]">Human Voice</span>
              <h2 className="text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] mt-2">Stories of Impact</h2>
            </div>
            <Link href="/stories" className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#00897B] hover:text-white transition-colors">
              View More Stories <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        {latestStories.length === 0 ? (
          <ScrollReveal>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center space-y-3">
              <p className="text-lg font-bold text-[#293241]">No impact stories published yet.</p>
              <p className="text-sm text-[#0A0A0A]/70">Check back soon for field dispatches and updates.</p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestStories.map((story) => (
                <div key={story.id} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden">
                  <div className="h-40 border-b-2 border-[#0A0A0A] bg-[#00897B]">
                    {story.image_url ? (
                      <img src={story.image_url} alt={story.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase text-white/40">[Story Visual]</div>
                    )}
                  </div>
                  <div className="p-5 space-y-3 flex flex-col flex-grow justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#293241] font-['Bricolage_Grotesque'] line-clamp-2">{story.title}</h3>
                      <p className="text-xs text-[#0A0A0A]/80 line-clamp-2 leading-relaxed">{story.excerpt}</p>
                    </div>
                    <Link
                      href={`/stories/${story.slug}`}
                      className="inline-flex items-center justify-between w-full bg-[#C62828] text-white font-bold text-[11px] uppercase px-3 py-2 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#293241] transition-colors"
                    >
                      <span>Read Story</span> <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* 8. FAQ */}
      <section className="max-w-4xl mx-auto px-6 space-y-8 pt-6 border-t-2 border-[#0A0A0A]/10">
        <ScrollReveal>
          <div className="space-y-4 border-b-2 border-[#0A0A0A] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#C62828] text-white px-3 py-1 border border-[#0A0A0A]">Got Questions?</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] mt-2">Frequently Asked Questions</h2>
            </div>
            <Link href="/faq" className="inline-flex items-center gap-2 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#C62828] hover:text-white transition-colors">
              View More FAQs <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 font-extrabold text-[#293241] font-['Bricolage_Grotesque'] text-lg hover:bg-[#F4F1EA] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <div className={`p-1 border border-[#0A0A0A] bg-[#C62828] text-white transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t-2 border-[#0A0A0A]/10 text-sm text-[#0A0A0A]/80 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}