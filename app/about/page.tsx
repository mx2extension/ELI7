'use client';
import React from 'react';
import Link from 'next/link';
import { Target, ShieldCheck, Users, Compass, Eye, CheckCircle2, Gift, CreditCard, Package, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface BoardMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export default function AboutPage() {
  const boardMembers: BoardMember[] = [
    {
      name: "Amarachi Sunday",
      role: "Executive Director",
      bio: "Founder and President of Style by Ammie and Director of Operations at the Eli7 Foundation, specializing in strategic program management and operational execution. Acts as the primary anchor for organizational workflows, leveraging extensive management expertise to scale grassroots impact and drive foundation initiatives forward.",
      image: "https://res.cloudinary.com/drnrbfltr/image/upload/v1787737369/d2ab0c13-fa51-4d64-b2a3-765caa32c239.png"
    },

    {
      name: "Deborah Birdling Bubwa",
      role: "Chairperson",
      bio: "Founder of the Debbie Kauna Foundation with extensive experience in community leadership and philanthropic development. Brings a deep commitment to grassroots empowerment and institutional growth, helping guide the strategic vision and outreach efforts of the ELI7 Foundation.",
      image: "https://res.cloudinary.com/drnrbfltr/image/upload/v1787384464/67b681d8-8c2b-4457-848e-25f523ac1df9.png"
    },
    
    {
      name: "Mr. John Asowata",
      role: "Vice Chairperson",
      bio: "Experienced business owner and esteemed pastor in Christ Embassy, combining entrepreneurial acumen with values-driven leadership. Offers seasoned governance oversight, ethical guidance, and strategic counsel to help shape the core direction of the ELI7 Foundation.",
      image: "https://res.cloudinary.com/drnrbfltr/image/upload/v1787385239/8c41a6b5-cf22-4c08-9eb2-8603853b9789.png"
    },
    {
      name: "Ngozichukwu (Mary) Okorie",
      role: "Treasurer",
      bio: "CEO of Ions Tech Limited with extensive leadership experience in operational efficiency and strategic management. Ensures transparency, accountability, and organizational oversight to support ELI7 Foundation programs.",
      image: "https://res.cloudinary.com/drnrbfltr/image/upload/v1787385116/46790015-a9ed-4716-9833-4f91614ce243.png"
    }

  ];

  return (
    <div className="space-y-20 pb-20 max-w-7xl mx-auto px-6 pt-12 md:pt-16">
      
      {/* 1. ABOUT US HERO SECTION WITH SIDE-BY-SIDE STACKED IMAGES */}
      <section className="space-y-8">
        <ScrollReveal variant="drop-down">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#C62828] text-white px-3.5 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                About ELI7 Foundation
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#00897B] text-white px-3.5 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                Systemic Change & Nationwide Impact
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight leading-tight">
              Extending Love, Dismantling Poverty, and Building Independent Futures
            </h1>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fade-up">
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-6 text-[#0A0A0A]/80 text-lg leading-relaxed font-medium">
              <p>
                The <strong className="text-[#293241]">Extend Love Initiative Foundation (ELI7 Foundation)</strong> is a dynamic, <strong className="text-[#293241]">women-led organization</strong> operating nationwide across Nigeria, with deep foundational roots across Bauchi State and Northern Nigeria. We exist because temporary relief is never enough; true transformation requires building sustainable, self-reliant structures that permanently eradicate poverty and alter the heavy circumstances life has forced upon vulnerable populations.
              </p>
              <p>
                While we maintain a fierce, deliberate dedication to <strong className="text-[#293241]">empowering young girls and women</strong> who carry the heartbeat of our homes, our scope and mandate are broad and inclusive. We build independent community systems, functional support networks, and structural frameworks that operate beyond traditional limitations—ensuring that every vulnerable individual, family, and person living with a disability is equipped to stand independently and thrive on their own terms.
              </p>
            </div>

            {/* Side Stacked Images Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4 items-center">
              <div className="space-y-4">
                <div className="h-40 border-2 border-[#0A0A0A] bg-[#00897B] shadow-[4px_4px_0px_#0A0A0A] overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
                  <img 
                    src="https://res.cloudinary.com/drnrbfltr/image/upload/v1782108458/WhatsApp_Image_2026-05-27_at_1.57.49_PM_jzvkae.jpg" 
                    alt="Community Outreach" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-32 border-2 border-[#0A0A0A] bg-[#C62828] shadow-[4px_4px_0px_#0A0A0A] overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
                  <img 
                    src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787303925/fe62afc0-901d-42c3-b6ee-f77a48c90108.png" 
                    alt="Empowering Young Girls" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="pt-6">
                <div className="h-56 border-2 border-[#0A0A0A] bg-[#293241] shadow-[4px_4px_0px_#0A0A0A] overflow-hidden transform rotate-2 hover:rotate-0 transition-transform">
                  <img 
                    src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787237711/622f2063-805e-4e64-891a-bae90ffb9705.png" 
                    alt="Sustainable Structures" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Highlights */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t-2 border-[#0A0A0A]/10">
              <div className="bg-[#F4F1EA] p-5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] space-y-2">
                <Users className="w-6 h-6 text-[#C62828]" />
                <h3 className="font-extrabold text-[#293241] font-['Bricolage_Grotesque']">Nationwide Reach</h3>
                <p className="text-sm">Reaching out with structured support to underserved families and communities across Nigeria.</p>
              </div>
              <div className="bg-[#F4F1EA] p-5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] space-y-2">
                <Target className="w-6 h-6 text-[#00897B]" />
                <h3 className="font-extrabold text-[#293241] font-['Bricolage_Grotesque']">Systemic & Independent</h3>
                <p className="text-sm">Building reliable frameworks and autonomous community systems that permanently outlast poverty.</p>
              </div>
              <div className="bg-[#F4F1EA] p-5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] space-y-2">
                <ShieldCheck className="w-6 h-6 text-[#C62828]" />
                <h3 className="font-extrabold text-[#293241] font-['Bricolage_Grotesque']">Total Inclusion</h3>
                <p className="text-sm">Championing women, young girls, and persons with disabilities as foundational pillars of society.</p>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* 2. MISSION & VISION SECTION */}
      <section className="space-y-8">
        <ScrollReveal variant="fade-up">
          <div className="border-b-2 border-[#0A0A0A] pb-4">
            <span className="bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-1 border-2 border-[#0A0A0A] inline-block mb-2">
              Our Core Blueprint
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Mission & Vision
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <ScrollReveal variant="slide-left">
            <div className="bg-[#F9F6F0] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#00897B] text-white flex items-center justify-center border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                    Our Mission
                  </h3>
                </div>
                
                <p className="text-[#0A0A0A]/80 text-base md:text-lg leading-relaxed font-medium">
                  To establish robust, independent systems that permanently tackle poverty and vulnerability, executing a well-structured roadmap of empowerment across Nigeria through:
                </p>

                <ul className="space-y-3.5 text-[#0A0A0A]/80 font-medium text-base">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00897B] shrink-0 mt-0.5" />
                    <span><strong>Permanent Poverty Eradication:</strong> Building long-term economic structures rather than temporary stopgaps.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00897B] shrink-0 mt-0.5" />
                    <span><strong>Targeted Advancement:</strong> Prioritizing young girls and women to secure generational progress.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00897B] shrink-0 mt-0.5" />
                    <span><strong>Universal Inclusion:</strong> Empowering persons with disabilities and marginalized groups to lead self-reliant lives.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t-2 border-[#0A0A0A]/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00897B] bg-[#00897B]/10 px-3 py-1 border border-[#0A0A0A]">
                  Action-Driven Purpose
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Vision Card */}
          <ScrollReveal variant="slide-right">
            <div className="bg-[#FFF8F6] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#C62828] text-white flex items-center justify-center border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                    Our Vision
                  </h3>
                </div>

                <p className="text-[#0A0A0A]/80 text-base md:text-lg leading-relaxed font-medium">
                  To pioneer a self-sustaining, equitable Nigerian society built upon robust community systems where:
                </p>

                <ul className="space-y-3.5 text-[#0A0A0A]/80 font-medium text-base">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C62828] shrink-0 mt-0.5" />
                    <span><strong>Structural Independence:</strong> Communities possess autonomous frameworks that function seamlessly regardless of external limitations.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C62828] shrink-0 mt-0.5" />
                    <span><strong>Equal Opportunity:</strong> Every vulnerable individual, woman, and child has unhindered access to dignity, growth, and security.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C62828] shrink-0 mt-0.5" />
                    <span><strong>Circumstance Transcended:</strong> The harsh barriers of life's hardships are permanently dismantled through structured empowerment.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t-2 border-[#0A0A0A]/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C62828] bg-[#C62828]/10 px-3 py-1 border border-[#0A0A0A]">
                  The Future We Build
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. DIRECTOR OF OPERATIONS NOTE */}
      <section className="space-y-6">
        <ScrollReveal variant="fade-up">
          <div className="border-b-2 border-[#0A0A0A] pb-4">
            <span className="bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-1 border-2 border-[#0A0A0A] inline-block mb-2">
              Executive Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Director of Operations' Note
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="slide-left">
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="h-80 lg:h-full min-h-[300px] border-2 border-[#0A0A0A] bg-[#00897B] shadow-[6px_6px_0px_#0A0A0A] overflow-hidden">
              <img 
                src="https://res.cloudinary.com/drnrbfltr/image/upload/v1783866796/3e58da7f-1e04-49a9-9518-7910b7743888.png" 
                alt="Amarachi Sunday" 
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="lg:col-span-2 space-y-5">
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                Lifting Communities Beyond Tomorrow
              </h3>
              
              <div className="space-y-4 text-[#0A0A0A]/80 text-base md:text-lg leading-relaxed font-medium">
                <p>
                  &ldquo;Walking the ground across Bauchi State and communities throughout Northern Nigeria teaches you something profound: our people possess immense resilience, spirit, and dignity. While immediate comfort and relief bring warmth to a home in moments of hardship, true, lasting change requires us to look far beyond today. We are actively engineering self-sustaining structures that permanently take apart poverty and break the cycles of circumstance.
                </p>
                <p>
                  Though we place an intentional focus on uplifting young girls and women who anchor our homes, our mission spans every vulnerable soul—building reliable systems that operate independently to permanently elevate families toward self-reliance. To our cherished partners: thank you for believing in this vision. Together, we are not just meeting needs; we are building a structural future where every individual thrives on their own terms.&rdquo;
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-block bg-[#293241] text-white font-bold text-xs uppercase px-3.5 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                  — Amarachi Sunday, Director of Operations
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. BOARD OF TRUSTEES */}
      <section className="space-y-10 pt-6">
        <ScrollReveal variant="fade-up">
          <div className="border-b-2 border-[#0A0A0A] pb-4">
            <span className="bg-[#00897B] text-white font-bold text-xs uppercase px-3 py-1 border-2 border-[#0A0A0A] inline-block mb-2">
              Governance & Oversight
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Board of Directors
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boardMembers.map((member, index) => (
            <ScrollReveal key={index} variant="fade-up" delay={index * 100}>
              <div 
                className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col justify-between overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all h-full"
              >
                <div className="aspect-[4/5] border-b-2 border-[#0A0A0A] bg-[#00897B] overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="p-6 space-y-4 flex flex-col flex-grow justify-between">
                  <div className="space-y-2">
                    <span className="inline-block bg-[#293241] text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 border border-[#0A0A0A]">
                      {member.role}
                    </span>
                    <h3 className="text-xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] leading-tight">
                      {member.name}
                    </h3>
                    <div className="w-8 h-1 bg-[#C62828] border border-[#0A0A0A]"></div>
                    <p className="text-sm text-[#0A0A0A]/80 leading-relaxed font-medium pt-1">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 5. HOW ELI7 FOUNDATION CAME TO LIFE */}
      <section className="space-y-10 pt-6">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bg-[#C62828] text-white font-bold text-xs uppercase px-3.5 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] inline-block">
              Our Origin Story
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              How ELI7 Foundation Came to Life
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Milestone 1: Children's Day Launch */}
          <ScrollReveal variant="slide-left">
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] overflow-hidden flex flex-col h-full">
              <div className="h-64 border-b-2 border-[#0A0A0A] bg-[#00897B] relative overflow-hidden">
                <img 
                  src="https://res.cloudinary.com/drnrbfltr/image/upload/v1782108619/WhatsApp_Image_2026-05-27_at_1.57.51_PM_as7i9h.jpg" 
                  alt="Children's Day Outreach" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#293241] text-white font-extrabold text-lg px-3 py-1 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                  2026 START
                </span>
              </div>
              <div className="p-8 space-y-4 flex flex-col flex-grow justify-between">
                <div className="space-y-3">
                  <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                    A Simple Act of Care
                  </h3>
                  <p className="text-[#0A0A0A]/80 text-base leading-relaxed font-medium">
                    ELI7 Foundation sparked into life around Children’s Day this year. What began as a simple, heartfelt desire to share clothes with children quickly evolved. Through connecting with friends and compassionate peers, we mobilized community resources, raising funds from our own pockets to surpass our initial goal—delivering food, drinks, and clothing directly to children and families who needed them most.
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-[#0A0A0A]/10">
                  <span className="inline-block bg-[#00897B]/10 text-[#00897B] border border-[#0A0A0A] text-xs font-bold uppercase px-3 py-1">
                    Food, Clothing & Community Relief
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Milestone 2: Menstrual Hygiene Campaign & App */}
          <ScrollReveal variant="slide-right">
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] overflow-hidden flex flex-col h-full">
              <div className="h-64 border-b-2 border-[#0A0A0A] bg-[#C62828] relative overflow-hidden">
                <img 
                  src="https://res.cloudinary.com/drnrbfltr/image/upload/v1785749341/d91e64b3-cdd2-42a1-86fe-3b6aec7c090f.png" 
                  alt="Menstrual Health Campaign" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#C62828] text-white font-extrabold text-lg px-3 py-1 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                  CURRENT CAMPAIGN
                </span>
              </div>
              <div className="p-8 space-y-4 flex flex-col flex-grow justify-between">
                <div className="space-y-3">
                  <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                    Menstrual Hygiene & Digital Education
                  </h3>
                  <p className="text-[#0A0A0A]/80 text-base leading-relaxed font-medium">
                    Building on our momentum, we are actively fundraising for our upcoming menstrual hygiene campaign. We aim to educate young girls in underserved areas on proper self-care during menstruation, supplying them with sanitary pads and essential hygiene kits. Additionally, we are developing an educational web application equipped with foundational knowledge and English/Hausa/Arabic translations to ensure wide accessibility.
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-[#0A0A0A]/10">
                  <span className="inline-block bg-[#C62828]/10 text-[#C62828] border border-[#0A0A0A] text-xs font-bold uppercase px-3 py-1">
                    Pads, Kits & English/Hausa/Arabic App
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. TRANSFORMING LIVES THROUGH ACTION (WITH YOUTUBE VIDEO SLOT) */}
      <section className="space-y-8 pt-6">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="bg-[#00897B] text-white font-bold text-xs uppercase px-3.5 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] inline-block">
              Impact in Motion
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight">
              Transforming Lives Through Action
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fade-up">
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-4 md:p-8">
            <div className="w-full aspect-video border-2 border-[#0A0A0A] bg-[#293241] shadow-[6px_6px_0px_#0A0A0A] overflow-hidden relative flex items-center justify-center">
              <iframe 
                className="w-full h-full absolute inset-0"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="ELI7 Foundation Impact Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. WAYS TO GIVE SECTION */}
      <section className="space-y-10 pt-6">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bg-[#C62828] text-white font-bold text-xs uppercase px-3.5 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] inline-block">
              Support Our Mission
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Ways to Give
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Online Donation */}
          <ScrollReveal variant="fade-up" delay={100}>
            <div className="bg-[#E0F2F1] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#00897B] text-white flex items-center justify-center border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                  <CreditCard className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  Online Donation
                </h3>
                <p className="text-[#0A0A0A]/80 text-base leading-relaxed font-medium">
                  Use our secure online payment systems to make a one-time or recurring gift that instantly fuels our community campaigns and structural projects.
                </p>
              </div>
              <div className="pt-4 border-t-2 border-[#0A0A0A]/10">
                <Link 
                  href="/donate" 
                  className="inline-flex items-center gap-2 font-bold text-[#293241] hover:text-[#00897B] transition-colors uppercase text-sm tracking-wider"
                >
                  <span>Donate Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Bank Transfer (Goes to Donate page) */}
          <ScrollReveal variant="fade-up" delay={200}>
            <div className="bg-[#FFFDE7] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#FBC02D] text-[#0A0A0A] flex items-center justify-center border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                  <Gift className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  Bank Transfer
                </h3>
                <p className="text-[#0A0A0A]/80 text-base leading-relaxed font-medium">
                  Directly support our accounts. Send funds safely via Zenith Bank (Dollar Account) or First Bank (Naira Account) to sustain our ongoing outreach.
                </p>
              </div>
              <div className="pt-4 border-t-2 border-[#0A0A0A]/10">
                <Link 
                  href="/donate" 
                  className="inline-flex items-center gap-2 font-bold text-[#293241] hover:text-[#F57F17] transition-colors uppercase text-sm tracking-wider"
                >
                  <span>View Accounts</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Volunteer / In-Kind Gifts (Goes to Volunteer page) */}
          <ScrollReveal variant="fade-up" delay={300}>
            <div className="bg-[#FFF8F6] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#C62828] text-white flex items-center justify-center border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  Volunteer & In-Kind
                </h3>
                <p className="text-[#0A0A0A]/80 text-base leading-relaxed font-medium">
                  Partner with us by offering your time, skills, or contributing physical items such as sanitary kits, learning materials, and food supplies.
                </p>
              </div>
              <div className="pt-4 border-t-2 border-[#0A0A0A]/10">
                <Link 
                  href="/volunteer" 
                  className="inline-flex items-center gap-2 font-bold text-[#293241] hover:text-[#C62828] transition-colors uppercase text-sm tracking-wider"
                >
                  <span>Join as Volunteer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}