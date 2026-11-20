
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import {
  Heart,
  Users,
  HeartPulse,
  GraduationCap,
  Lightbulb,
  Scale,
  Building2,
  ArrowUpRight,
  Sparkles,
  Quote,
  ChevronDown,
  Images,
} from 'lucide-react';

interface PreviewItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image_url?: string;
  cover_image_url?: string;
  description?: string;
  gallery_urls?: string[];
  event_date?: string;
  created_at: string;
}

function ImpactCounter({
  target,
  suffix = '+',
  duration = 1900,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const element = counterRef.current;
    if (!element || hasStarted.current) return;

    let frame = 0;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasStarted.current) return;

      hasStarted.current = true;
      observer.disconnect();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setValue(target);
        return;
      }

      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;

        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setValue(Math.round(target * eased));

        if (progress < 1) {
          frame = window.requestAnimationFrame(animate);
        } else {
          setValue(target);
        }
      };

      frame = window.requestAnimationFrame(animate);
    }, { threshold: 0.45 });

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return (
    <span ref={counterRef} aria-label={`${target.toLocaleString()}${suffix}`}>
      {value.toLocaleString()}{suffix}
    </span>
  );
}

// IMPACT PHOTOGRAPHS
const IMPACT_IMAGES = {
  left: 'https://res.cloudinary.com/drnrbfltr/image/upload/v1782108458/WhatsApp_Image_2026-05-27_at_1.57.49_PM_jzvkae.jpg',
  middle: 'https://res.cloudinary.com/drnrbfltr/image/upload/v1787303925/fe62afc0-901d-42c3-b6ee-f77a48c90108.png',
  right: 'https://res.cloudinary.com/drnrbfltr/image/upload/v1787237711/622f2063-805e-4e64-891a-bae90ffb9705.png',
};

// OFFICIAL UN SDG ICONS
// These paths match your exact public folder and filenames.
const SDG_FOLDER = '/E%20SDG%20Icons%20WEB';

const SDG_GOALS = [
  {
    number: '03',
    title: 'Good Health & Well-being',
    image: `${SDG_FOLDER}/E-WEB-Goal-03.png`,
    color: '#4C9F38',
    description: 'Promoting access to healthcare, menstrual health education, well-being and essential support.',
  },
  {
    number: '04',
    title: 'Quality Education',
    image: `${SDG_FOLDER}/E-WEB-Goal-04.png`,
    color: '#C5192D',
    description: 'Expanding learning opportunities, skills development and access to educational resources.',
  },
  {
    number: '09',
    title: 'Industry, Innovation & Infrastructure',
    image: `${SDG_FOLDER}/E-WEB-Goal-09.png`,
    color: '#FD6925',
    description: 'Encouraging innovation, digital inclusion and practical solutions that strengthen communities.',
  },
  {
    number: '10',
    title: 'Reduced Inequalities',
    image: `${SDG_FOLDER}/E-WEB-Goal-10.png`,
    color: '#DD1367',
    description: 'Advancing equal opportunities, dignity and meaningful participation for persons with disabilities and underserved groups.',
  },
  {
    number: '11',
    title: 'Sustainable Cities & Communities',
    image: `${SDG_FOLDER}/E-WEB-Goal-11.png`,
    color: '#FD9D24',
    description: 'Building safer, stronger and more inclusive communities where everyone can thrive.',
  },
];

const SUPPORT_CARDS = [
  {
    title: 'Every Penny Goes Towards Impactful Programs',
    category: 'Donate',
    description: 'Direct financial support fuels our ongoing field distributions, educational drives, and community empowerment initiatives.',
    image: 'https://res.cloudinary.com/drnrbfltr/image/upload/v1787231895/dafb89d5-fa43-4a50-b39f-c969e1f9bffe.png',
    button: 'Support the Cause',
    href: '/donate',
    color: '#00897B',
  },
  {
    title: 'Join Our Hands-On Efforts',
    category: 'Volunteer',
    description: 'Give your time and skills to support field distributions, workshops, and community mentorship programs.',
    image: 'https://res.cloudinary.com/drnrbfltr/image/upload/v1787233915/6e1d1e38-7c35-4b56-bf27-727c54f470b4.png',
    button: 'Become a Volunteer',
    href: '/volunteer',
    color: '#C62828',
  },
  {
    title: 'Mobilize Your Network',
    category: 'Fundraise',
    description: 'Set up peer campaigns or corporate giving channels to support our nationwide projects and expansion goals.',
    image: 'https://res.cloudinary.com/drnrbfltr/image/upload/v1787238632/5fb9af94-f599-4461-9c72-312714242377.png',
    button: 'Support the Cause',
    href: '/donate',
    color: '#00897B',
  },
];

export default function HomePage() {
  const [latestNews, setLatestNews] = useState<PreviewItem[]>([]);
  const [latestStories, setLatestStories] = useState<PreviewItem[]>([]);
  const [latestProjects, setLatestProjects] = useState<PreviewItem[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      const [
        { data: news },
        { data: stories },
        { data: projects },
      ] = await Promise.all([
        supabase
          .from('news')
          .select('id, title, slug, excerpt, image_url, created_at')
          .order('created_at', { ascending: false })
          .limit(4),

        supabase
          .from('stories')
          .select('id, title, slug, excerpt, image_url, created_at')
          .order('created_at', { ascending: false })
          .limit(4),

        supabase
          .from('projects')
          .select('id, title, slug, description, image_url, gallery_urls, event_date, created_at')
          .order('event_date', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .limit(3),
      ]);

      if (!active) return;

      setLatestNews(news || []);
      setLatestStories(stories || []);
      setLatestProjects(projects || []);
    }

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const faqs = [
    {
      question: 'How are financial donations utilized?',
      answer: '100% of donations are channeled into program delivery, fund scholarships, assistive devices for persons with disabilities, vocational training, micro‑grants, healthcare enrolment, emergency relief and everything else that supports our mission in building more inclusive communities. ELI7 prioritises transparency and regularly reports on impact.',
    },
    {
      question: 'Can I volunteer or support remotely?',
      answer: 'Yes! Beyond hands-on field volunteering, we welcome digital advocates, campaign mobilizers, and technical contributors who want to help expand our reach.',
    },
    {
      question: 'How do I make a direct bank transfer?',
      answer: 'You can support our mission via direct bank transfers to our official institutional accounts on the donate page. Visit our donate page for details.',
    },
  ];

  return (
    <main className="flex flex-col gap-20 pb-20">

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl w-full mx-auto px-6 pt-12 md:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <ScrollReveal>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3.5 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
              <Sparkles className="w-4 h-4" />
              Women-Led Nationwide Impact & Support
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight leading-tight">
              Extending Love, Empowering Communities, and Building Futures Across Nigeria
            </h1>

            <p className="text-lg text-[#0A0A0A]/80 leading-relaxed font-medium">
              We are a dedicated women-led organization building a framework where vulnerable populations, persons with disabilities, and underserved communities thrive as equal participants in society—especially women and girls—through education, health, economic empowerment and protection. Through your support, we break barriers and build sustainable futures across Nigeria.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/donate" className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-sm uppercase px-6 py-3.5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#293241] transition-all">
                Donate Now <Heart className="w-5 h-5 fill-current" />
              </Link>

              <Link href="/projects" className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold text-sm uppercase px-6 py-3.5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#00897B] hover:text-white transition-all">
                Our Projects <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="bg-[#00897B] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-4 md:p-6 text-white space-y-4">
            <div className="h-72 border-2 border-[#0A0A0A] overflow-hidden bg-white">
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

      {/* 2. MISSION, GOALS & WHAT DRIVES US */}
      <section className="w-full max-w-7xl mx-auto px-6">
        <ScrollReveal className="w-full">
          <div className="relative isolate bg-[#F4F1EA] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] overflow-hidden">

            {/* YOUR MISSION AND GOALS BACKGROUND IMAGE */}
            <div
              className="absolute inset-0 -z-20 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://res.cloudinary.com/drnrbfltr/image/upload/v1795055662/52e81b98-7f5d-450a-a521-c5ce18a06aa1.png')",
              }}
            />

            {/* Readability overlay */}
            <div className="absolute inset-0 -z-10 bg-[#F4F1EA]/85" />

            <div className="relative p-6 md:p-12 lg:p-14 space-y-8 md:space-y-10">

              <div className="max-w-3xl space-y-5">
                <div className="inline-flex items-center gap-2 bg-[#C62828] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-[#0A0A0A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Our Purpose & Direction
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight leading-tight">
                  The Mission & Goals Of Our Organization
                </h2>

                <p className="text-base md:text-lg text-[#0A0A0A]/80 leading-relaxed max-w-2xl">
                  At ELI7, our mission is to catalyze inclusive transformation by advancing the rights and opportunities of persons with disabilities, underserved communities, especially women and girls. We break barriers through education, healthcare, economic empowerment, and protection initiatives, ensuring full participation in Nigerian society.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <div className="h-1 w-14 bg-[#C62828]" />
                  <div className="h-1 w-7 bg-[#00897B]" />
                  <div className="h-1 w-3 bg-[#FFD23F]" />
                </div>
              </div>

              {/* WHAT DRIVES US */}
              <div className="border-t-2 border-[#0A0A0A]/15 pt-7 md:pt-9 space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00897B]">
                      What Drives Us
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] mt-1">
                      Our Areas of Focus
                    </h3>
                  </div>

                  <p className="text-sm text-[#0A0A0A]/75 max-w-sm leading-relaxed">
                    Our work is guided by five Sustainable Development Goals that help us build healthier, more equitable and inclusive communities.
                  </p>
                </div>

                {/* OFFICIAL UN SDG CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {SDG_GOALS.map((goal) => (
                    <div
                      key={goal.number}
                      className="bg-white/95 border-2 border-[#0A0A0A]/15 flex flex-col overflow-hidden shadow-[4px_4px_0px_rgba(10,10,10,0.10)] hover:-translate-y-1 transition-transform duration-300"
                    >
                      {/* Original UN SDG image */}
                      <div
                        className="w-full aspect-square p-3 flex items-center justify-center"
                        style={{ backgroundColor: goal.color }}
                      >
                        <img
                          src={goal.image}
                          alt={`United Nations Sustainable Development Goal ${goal.number}: ${goal.title}`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-5 flex flex-col flex-grow gap-3">
                        <span
                          className="text-[10px] font-extrabold uppercase tracking-widest"
                          style={{ color: goal.color }}
                        >
                          SDG {goal.number}
                        </span>

                        <h4 className="text-base font-extrabold text-[#293241] leading-snug">
                          {goal.title}
                        </h4>

                        <p className="text-sm text-[#0A0A0A]/70 leading-relaxed">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMMITMENT STATEMENT */}
              <div className="flex items-center gap-4 bg-[#293241] p-5 md:p-6">
                <div className="w-11 h-11 bg-[#FFD23F] text-[#293241] flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 fill-current" />
                </div>

                <p className="text-white text-sm md:text-base font-medium leading-relaxed">
                  Every focus area represents our commitment to building stronger, healthier and more inclusive communities across Nigeria.
                </p>
              </div>

              <div className="flex justify-start">
                <Link
                  href="/impact"
                  className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-5 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#00897B] transition-colors whitespace-nowrap"
                >
                  Explore Our Work <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. IMPACT SNAPSHOT */}
      <section
        aria-label="ELI7 Foundation impact statistics"
        className="relative z-0 w-full max-w-[1440px] mx-auto px-5 sm:px-6 clear-both"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[0.98fr_0.98fr_2fr] gap-4 lg:gap-5 lg:h-[clamp(420px,34vw,500px)] lg:min-h-[420px] items-stretch">

          {/* LEFT PHOTOGRAPH */}
          <ScrollReveal
            variant="slide-left"
            className="h-full min-h-0"
          >
            <div className="h-[340px] sm:h-[420px] lg:h-full min-h-0 overflow-hidden rounded-[20px] bg-[#293241] group">
              <img
                src={IMPACT_IMAGES.left}
                alt="A child taking part in a community outreach activity"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center grayscale transition-transform duration-[1200ms] ease-out group-hover:scale-[1.045]"
              />
            </div>
          </ScrollReveal>

          {/* MIDDLE STATISTICS */}
          <div className="grid grid-cols-1 grid-rows-2 gap-4 lg:gap-5 lg:h-full min-h-0">

            <ScrollReveal
              variant="drop-down"
              delay={120}
              className="h-full min-h-0"
            >
              <div className="relative h-[230px] sm:h-[260px] lg:h-full min-h-0 overflow-hidden rounded-[20px] bg-[#F7F3A5] group">
                <img
                  src={IMPACT_IMAGES.middle}
                  alt="A young person featured in an ELI7 community empowerment image"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-right transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#F7F3A5] via-[#F7F3A5]/95 to-[#F7F3A5]/5" />

                <div className="relative z-10 h-full flex items-center p-5 lg:p-4 xl:p-5">
                  <p className="max-w-[68%] text-[clamp(1.45rem,2.15vw,2.35rem)] leading-[1.08] font-extrabold uppercase tracking-[-0.035em] text-[#B69A50] font-['Bricolage_Grotesque']">
                    Empowerment<br />
                    for <span className="text-black"><ImpactCounter target={300} /></span>
                    <br />people
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal
              variant="fade-up"
              delay={240}
              className="h-full min-h-0"
            >
              <div className="h-[190px] sm:h-[220px] lg:h-full min-h-0 rounded-[20px] bg-[#DCE5E1] p-5 md:p-6 lg:p-5 xl:p-6 flex flex-col justify-between overflow-hidden">
                <p className="text-[clamp(3.8rem,5.6vw,6rem)] leading-[0.9] font-extrabold tracking-[-0.075em] text-black font-['Bricolage_Grotesque'] tabular-nums">
                  <ImpactCounter target={1500} />
                </p>

                <p className="text-base md:text-lg text-[#52616B] font-medium">
                  People Impacted
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT PHOTOGRAPH */}
          <ScrollReveal
            variant="slide-right"
            delay={160}
            className="h-full min-h-0"
          >
            <div className="h-[340px] sm:h-[420px] lg:h-full min-h-0 overflow-hidden rounded-[20px] bg-[#293241] group">
              <img
                src={IMPACT_IMAGES.right}
                alt="Children together during a community activity"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center grayscale transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
              />
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 4. EXECUTIVE DIRECTOR'S PERSONAL MESSAGE */}
      {/* Separate section: normal document flow, no negative positioning */}
      <section className="relative z-0 w-full max-w-7xl mx-auto px-6 clear-both">
        <ScrollReveal className="w-full">
          <div className="relative isolate overflow-hidden bg-[#FFF7F5] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-6 md:p-14">

            {/* Visible heart-led backdrop: warmth and compassion without reducing text contrast */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(198,40,40,0.12),transparent_34%),radial-gradient(circle_at_12%_90%,rgba(238,108,77,0.10),transparent_30%)]" />
              <Heart className="absolute -right-10 top-8 h-64 w-64 md:h-[27rem] md:w-[27rem] rotate-12 fill-[#C62828]/10 text-[#C62828]/15 stroke-[1.2]" />
              <Heart className="absolute left-[34%] -bottom-16 h-40 w-40 md:h-56 md:w-56 -rotate-12 fill-[#EE6C4D]/[0.06] text-[#EE6C4D]/10 stroke-[1.2]" />
              <div className="absolute -right-20 -bottom-28 h-80 w-80 rounded-full border border-[#C62828]/10" />
              <div className="absolute right-12 top-12 h-32 w-32 rounded-full border border-[#C62828]/10" />
            </div>

            <div className="absolute top-5 left-5 md:top-7 md:left-7 z-20 bg-[#C62828] text-white border-2 border-[#0A0A0A] p-3 md:p-4 shadow-[4px_4px_0px_#0A0A0A]">
              <Quote className="w-8 h-8" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pt-16 md:pt-20">

              <div className="h-80 md:h-96 border-2 border-[#0A0A0A] bg-[#00897B] shadow-[6px_6px_0px_#0A0A0A] overflow-hidden">
                <img
                  src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787737369/d2ab0c13-fa51-4d64-b2a3-765caa32c239.png"
                  alt="Amarachi Sunday"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2 border-b-2 border-[#0A0A0A] pb-4">
                  <span className="inline-block bg-[#C62828] text-white font-bold text-xs uppercase px-2.5 py-1 border border-[#0A0A0A]">
                    Executive Director — A Personal Message
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
                    <p className="font-extrabold text-xl text-[#293241] font-['Bricolage_Grotesque']">
                      Amarachi Sunday
                    </p>
                    <p className="text-sm font-bold text-[#C62828] uppercase">
                      Executive Director, ELI7 Foundation
                    </p>
                  </div>

                  <Link
                    href="/donate"
                    className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-5 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#293241] transition-colors"
                  >
                    Back Our Projects <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. BE THE CHANGE */}
      <section className="w-full max-w-7xl mx-auto px-6 space-y-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#00897B] text-white px-3 py-1 border border-[#0A0A0A]">
              Support Us
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Be the Change You Wish to See
            </h2>

            <p className="text-[#0A0A0A]/80 text-sm">
              Choose how you want to contribute and make an immediate impact on vulnerable lives.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUPPORT_CARDS.map((card) => (
              <div
                key={card.category}
                className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden"
              >
                <div className="h-48 border-b-2 border-[#0A0A0A] bg-[#00897B]">
                  <img
                    src={card.image}
                    alt={card.category}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-6 space-y-4 flex flex-col flex-grow justify-between">
                  <div className="space-y-3">
                    <span
                      className="text-white text-xs font-bold uppercase px-2.5 py-1 border border-[#0A0A0A] inline-block"
                      style={{ backgroundColor: card.color }}
                    >
                      {card.category}
                    </span>

                    <h3 className="text-xl font-bold text-[#293241] font-['Bricolage_Grotesque']">
                      {card.title}
                    </h3>

                    <p className="text-sm text-[#0A0A0A]/80 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase px-4 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#293241] transition-colors"
                    style={{ backgroundColor: card.color }}
                  >
                    {card.button} <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 6. PROJECT EVENT GALLERIES */}
      <section className="w-full max-w-7xl mx-auto px-6 space-y-10">
        <ScrollReveal>
          <div className="space-y-4 border-b-2 border-[#0A0A0A] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#00897B] text-white px-3 py-1 border border-[#0A0A0A]">
                Visual Highlights
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] mt-2">
                Project Event Galleries
              </h2>
            </div>

          </div>
        </ScrollReveal>

        {latestProjects.length === 0 ? (
          <ScrollReveal>
            <div className="bg-white border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center space-y-3">
              <p className="text-lg font-bold text-[#293241]">No projects published yet.</p>
              <p className="text-sm text-[#0A0A0A]/70">Check back soon for project updates and event photographs.</p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  aria-label={`View project: ${project.title}`}
                  className="group w-full min-w-0 bg-white border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-4 sm:p-6 md:p-7 flex flex-col sm:flex-row items-stretch gap-5 md:gap-6 overflow-hidden hover:-translate-y-1 hover:shadow-[10px_10px_0px_#0A0A0A] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00897B]"
                >
                  {/* PROJECT IMAGE */}
                  <div className="w-full h-52 sm:h-auto sm:w-[34%] sm:min-w-[140px] md:min-w-[180px] sm:min-h-[220px] border-2 border-[#0A0A0A] bg-[#00897B] flex-shrink-0 overflow-hidden">
                    {(project.image_url || project.gallery_urls?.[0]) ? (
                      <img
                        src={project.image_url || project.gallery_urls?.[0]}
                        alt={project.title}
                        className="w-full h-full min-h-[200px] sm:min-h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[200px] sm:min-h-[220px] flex items-center justify-center text-xs font-bold uppercase text-white/60">
                        Gallery Visual
                      </div>
                    )}
                  </div>

                  {/* PROJECT DETAILS */}
                  <div className="flex flex-col justify-center flex-grow min-w-0 gap-3 py-2 sm:py-1">
                    <h3 className="text-xl md:text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug group-hover:text-[#00897B] transition-colors">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="text-sm text-[#0A0A0A]/80 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[#0A0A0A]/60 pt-2">
                      <span>
                        {new Date(project.event_date || project.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Images className="w-3.5 h-3.5 text-[#C62828]" />
                        {new Set([project.image_url, ...(project.gallery_urls || [])].filter(Boolean)).size} photos
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 font-bold text-xs uppercase text-[#00897B] underline underline-offset-4 w-fit mt-1">
                      View Project <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        )}

        <div className="flex justify-start">
          <Link href="/projects" className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#00897B] hover:text-white transition-colors">
            View All Projects <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. NEWS & ARTICLES */}
      <section className="w-full max-w-7xl mx-auto px-6 space-y-10">
        <ScrollReveal>
          <div className="space-y-4 border-b-2 border-[#0A0A0A] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#C62828] text-white px-3 py-1 border border-[#0A0A0A]">
                Updates
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight mt-2">
                News & Articles
              </h2>
            </div>

          </div>
        </ScrollReveal>

        {latestNews.length === 0 ? (
          <ScrollReveal>
            <div className="bg-white border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center space-y-3">
              <p className="text-lg font-bold text-[#293241]">No news articles published yet.</p>
              <p className="text-sm text-[#0A0A0A]/70">Check back soon for updates from our team.</p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  aria-label={`Read article: ${item.title}`}
                  className="group bg-white border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center justify-between hover:-translate-y-1 hover:shadow-[10px_10px_0px_#0A0A0A] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00897B]"
                >
                  <div className="w-full sm:w-48 h-48 sm:h-52 border-2 border-[#0A0A0A] bg-[#00897B] flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase text-white/60">
                        News Visual
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between flex-grow space-y-3">
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-[#0A0A0A]/60 block">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>

                      <h3 className="text-xl md:text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug group-hover:text-[#00897B] transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <span className="inline-flex items-center gap-1 font-bold text-xs uppercase text-[#00897B] underline underline-offset-4">
                      Read More <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        )}

        <div className="flex justify-start">
          <Link href="/news" className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#C62828] hover:text-white transition-colors">
            View More News <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 8. STORIES OF IMPACT */}
      <section className="w-full max-w-7xl mx-auto px-6 space-y-8">
        <ScrollReveal>
          <div className="space-y-4 border-b-2 border-[#0A0A0A] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#00897B] text-white px-2.5 py-1 border border-[#0A0A0A]">
                Human Voice
              </span>

              <h2 className="text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] mt-2">
                Stories of Impact
              </h2>
            </div>

          </div>
        </ScrollReveal>

        {latestStories.length === 0 ? (
          <ScrollReveal>
            <div className="bg-white border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-12 text-center space-y-3">
              <p className="text-lg font-bold text-[#293241]">No impact stories published yet.</p>
              <p className="text-sm text-[#0A0A0A]/70">Check back soon for field dispatches and updates.</p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.slug}`}
                  aria-label={`Read story: ${story.title}`}
                  className="group w-full min-w-0 bg-white border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-4 sm:p-6 md:p-7 flex flex-col sm:flex-row items-stretch gap-5 md:gap-6 overflow-hidden hover:-translate-y-1 hover:shadow-[10px_10px_0px_#0A0A0A] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00897B]"
                >
                  {/* STORY IMAGE */}
                  <div className="w-full h-52 sm:h-auto sm:w-[34%] sm:min-w-[140px] md:min-w-[180px] sm:min-h-[220px] border-2 border-[#0A0A0A] bg-[#00897B] flex-shrink-0 overflow-hidden">
                    {story.image_url ? (
                      <img
                        src={story.image_url}
                        alt={story.title}
                        className="w-full h-full min-h-[200px] sm:min-h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[200px] sm:min-h-[220px] flex items-center justify-center text-xs font-bold uppercase text-white/60">
                        Story Visual
                      </div>
                    )}
                  </div>

                  {/* STORY DETAILS */}
                  <div className="flex flex-col justify-center flex-grow min-w-0 gap-3 py-2 sm:py-1">
                    <span className="text-xs font-medium text-[#0A0A0A]/60 block">
                      {new Date(story.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>

                    <h3 className="text-xl md:text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] leading-snug group-hover:text-[#00897B] transition-colors">
                      {story.title}
                    </h3>

                    {story.excerpt && (
                      <p className="text-sm text-[#0A0A0A]/80 line-clamp-3 leading-relaxed">
                        {story.excerpt}
                      </p>
                    )}

                    <span className="inline-flex items-center gap-1 font-bold text-xs uppercase text-[#00897B] underline underline-offset-4 w-fit mt-1">
                      Read Story <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        )}

        <div className="flex justify-start">
          <Link href="/stories" className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#00897B] hover:text-white transition-colors">
            View More Stories <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="w-full max-w-4xl mx-auto px-6 space-y-8 pt-6 border-t-2 border-[#0A0A0A]/10">
        <ScrollReveal>
          <div className="space-y-4 border-b-2 border-[#0A0A0A] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#C62828] text-white px-3 py-1 border border-[#0A0A0A]">
                Got Questions?
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] mt-2">
                Frequently Asked Questions
              </h2>
            </div>

          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={index} className="bg-white border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 font-extrabold text-[#293241] font-['Bricolage_Grotesque'] text-lg hover:bg-[#F4F1EA] transition-colors"
                  >
                    <span>{faq.question}</span>

                    <div className={`p-1 border border-[#0A0A0A] bg-[#C62828] text-white transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-4 border-t-2 border-[#0A0A0A]/10 text-sm text-[#0A0A0A]/80 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <div className="flex justify-start">
          <Link href="/faq" className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] w-fit hover:bg-[#C62828] hover:text-white transition-colors">
            View More FAQs <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </main>
  );
}
