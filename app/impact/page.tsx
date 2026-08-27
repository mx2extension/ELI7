'use client';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { 
  Globe2, 
  Users, 
  Heart, 
  Building2, 
  GraduationCap, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function ImpactPage() {
  return (
    <div className="space-y-20 pb-20 bg-[#F4F1EA]">
      
      {/* 1. HERO BANNER */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        <ScrollReveal variant="drop-down">
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-8 md:p-14 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3.5 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
              <Sparkles className="w-4 h-4" /> Measurable Systems & Real-World Results
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight leading-tight">
              Our Impact Across Communities, Digital Platforms, and Economic Infrastructure
            </h1>

            <p className="text-lg text-[#0A0A0A]/80 leading-relaxed font-medium max-w-3xl">
              At ELI7 Foundation and our extension entities, impact spans from completed grassroots community welfare to active digital economic corridors and upcoming strategic pipelines.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. SECTION: GRASSROOTS & SOCIAL IMPACT */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <ScrollReveal variant="fade-up">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#00897B] text-white px-3 py-1 border border-[#0A0A0A]">Humanitarian Track</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Direct Community Outreaches & Welfare
            </h2>
            <p className="text-[#0A0A0A]/80 font-medium max-w-2xl">
              Rooted in personal conviction and executed through community solidarity, our outreach programs provide immediate relief and long-term dignity.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Children's Day Outreach */}
          <ScrollReveal variant="slide-left" delay={0}>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#C62828] text-white text-xs font-bold px-3 py-1 border border-[#0A0A0A]">
                  <Heart className="w-3.5 h-3.5 fill-current" /> Completed Flagship Outreach
                </div>
                <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  Children's Day Community Outreach (Gwalameji)
                </h3>
                <p className="text-sm text-[#0A0A0A]/80 font-medium leading-relaxed">
                  Executed in Gwalameji, Bauchi State, providing clean clothing via a community Clothes Bank, fresh hygienic homemade Zobo drinks, and wholesome meals to over 100 vulnerable children.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#F4F1EA] p-3 border border-[#0A0A0A]">
                    <span className="block text-2xl font-extrabold text-[#C62828]">100+</span>
                    <span className="text-xs font-bold uppercase text-gray-700">Children Clothed & Fed</span>
                  </div>
                  <div className="bg-[#F4F1EA] p-3 border border-[#0A0A0A]">
                    <span className="block text-2xl font-extrabold text-[#00897B]">100%</span>
                    <span className="text-xs font-bold uppercase text-gray-700">Safe, Homemade Nutrition</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#0A0A0A]/10 text-xs font-bold uppercase text-gray-500">
                Location: Gwalameji, Bauchi State
              </div>
            </div>
          </ScrollReveal>

          {/* Menstrual Health Programme */}
          <ScrollReveal variant="slide-right" delay={150}>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#FFD23F] text-[#0A0A0A] text-xs font-bold px-3 py-1 border border-[#0A0A0A]">
                  <Clock className="w-3.5 h-3.5" /> Currently Planning & Crowdfunding
                </div>
                <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  Menstrual Health Education & Support Programme
                </h3>
                <p className="text-sm text-[#0A0A0A]/80 font-medium leading-relaxed">
                  A structured initiative currently in proposal and planning stages, designed to target 20 to 30 schools to deliver puberty education, sanitary product distribution, physical journals, and the digital Amara Health Companion app.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#F4F1EA] p-3 border border-[#0A0A0A]">
                    <span className="block text-2xl font-extrabold text-[#C62828]">20 - 30</span>
                    <span className="text-xs font-bold uppercase text-gray-700">Target Schools</span>
                  </div>
                  <div className="bg-[#F4F1EA] p-3 border border-[#0A0A0A]">
                    <span className="block text-2xl font-extrabold text-[#00897B]">4k - 6k</span>
                    <span className="text-xs font-bold uppercase text-gray-700">Target Girls Reached</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#0A0A0A]/10 text-xs font-bold uppercase text-gray-500">
                Status: Pipeline / Funding Stage (2026-2027)
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 3. SECTION: PLATFORM & ECONOMIC INFRASTRUCTURE */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <ScrollReveal variant="fade-up">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#C62828] text-white px-3 py-1 border border-[#0A0A0A]">Digital Infrastructure Track</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Platforms Driving Economic Growth & Opportunity
            </h2>
            <p className="text-[#0A0A0A]/80 font-medium max-w-2xl">
              Beyond physical outreaches, we engineer high-performance web platforms to solve structural bottlenecks in regional investment and professional development.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* BDI Platform */}
          <ScrollReveal variant="slide-left" delay={0}>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#00897B] text-white border-2 border-[#0A0A0A] flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A]">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  Bauchi State Development Initiative (mx2bdi)
                </h3>
                <p className="text-sm text-[#0A0A0A]/80 font-medium leading-relaxed">
                  A private-sector-led investment promotion hub built under the MX2 extension entity. It connects local and international capital with strategic regional opportunities through custom investment maps and digital portals.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0A0A0A]/10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#00897B]">mx2bdi.com</span>
                <a 
                  href="https://mx2bdi.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase bg-[#0A0A0A] text-white px-3 py-1.5 hover:bg-[#C62828] transition-colors"
                >
                  Visit Platform <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* FindOneCampus Platform */}
          <ScrollReveal variant="slide-right" delay={150}>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#C62828] text-white border-2 border-[#0A0A0A] flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  FindOneCampus (FOC) Directory
                </h3>
                <p className="text-sm text-[#0A0A0A]/80 font-medium leading-relaxed">
                  A dynamic web application built to give young people and professionals direct access to scholarships, jobs, and internships while enabling clients to connect directly with skilled talent without middlemen.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0A0A0A]/10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#C62828]">findoncampus.com</span>
                <a 
                  href="https://findoncampus.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase bg-[#0A0A0A] text-white px-3 py-1.5 hover:bg-[#00897B] transition-colors"
                >
                  Visit Platform <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-6">
        <ScrollReveal variant="skew-up">
          <div className="bg-[#00897B] text-white border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-8 md:p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold font-['Bricolage_Grotesque']">
              Be Part of Our Next Milestone
            </h2>
            <p className="text-white/90 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Whether you want to support our upcoming menstrual health rollout or partner with our digital infrastructure initiatives, your collaboration helps us scale sustainable impact across Nigeria.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link 
                href="/partner-with-us"
                className="bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-6 py-3.5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-all flex items-center gap-2"
              >
                Partner With Us <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}