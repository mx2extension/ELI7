'use client';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Building2, 
  ArrowUpRight, 
  Sparkles, 
  TrendingUp, 
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

export default function WorkWeDoPage() {
  return (
    <div className="space-y-20 pb-20 bg-[#F4F1EA]">
      
      {/* 1. HERO SECTION: THE RESILIENT JOURNEY */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        <ScrollReveal variant="drop-down">
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-8 md:p-14 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3.5 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
              <Sparkles className="w-4 h-4" /> Bootstrapped with Pure Grit & Conviction
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight leading-tight">
              Building Structural Systems for Vulnerable Lives and Lasting Impact
            </h1>

            <p className="text-lg text-[#0A0A0A]/80 leading-relaxed font-medium max-w-3xl">
              From our very first outreach to date, our work has been powered entirely by our own personal commitment. Without waiting for external institutional grants or funding, we have pushed forward through sheer resilience, engaging directly with government structures and communities to lay down frameworks that support vulnerable people and persons with disabilities.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. THE STORY OF RESILIENCE & SYSTEM BUILDING */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <ScrollReveal variant="slide-left">
            <div className="bg-[#00897B] text-white border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-8 md:p-10 space-y-6">
              <div className="w-12 h-12 bg-[#FFD23F] text-[#0A0A0A] border-2 border-[#0A0A0A] flex items-center justify-center font-extrabold shadow-[3px_3px_0px_#0A0A0A]">
                01
              </div>
              <h2 className="text-3xl font-extrabold font-['Bricolage_Grotesque']">
                Pushing Forward Without Stopping
              </h2>
              <p className="text-white/90 leading-relaxed font-medium text-base">
                When you are driven by a deep conviction to see people thrive, obstacles become stepping stones. We didn't let the lack of initial funding stop us. We started on the ground, mobilized our own resources, and built systems that reached the most neglected corners of our society.
              </p>
              <p className="text-white/90 leading-relaxed font-medium text-base">
                We have actively navigated stakeholder conversations and engaged government channels to ensure our initiatives have institutional backing, legal alignment, and real staying power.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-right" delay={150}>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-8 md:p-10 space-y-6">
              <div className="w-12 h-12 bg-[#C62828] text-white border-2 border-[#0A0A0A] flex items-center justify-center font-extrabold shadow-[3px_3px_0px_#0A0A0A]">
                02
              </div>
              <h2 className="text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                A Structured Vision for the Future
              </h2>
              <p className="text-[#0A0A0A]/80 leading-relaxed font-medium text-base">
                Charity alone is not enough for permanent change; sustainability requires structure. Our vision goes beyond periodic outreaches. We are actively engineering self-sustaining business models around our core initiatives.
              </p>
              <p className="text-[#0A0A0A]/80 leading-relaxed font-medium text-base">
                By building social enterprises that generate revenue, we are creating a permanent internal funding engine to support our future outreaches, ensuring we never have to pause our mission.
              </p>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 3. CORE PILLARS OF OUR WORK */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#C62828] text-white px-3 py-1 border border-[#0A0A0A]">Our Execution Focus</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              What We Do on the Ground
            </h2>
            <p className="text-[#0A0A0A]/80 font-medium">
              Every system and program we deploy is targeted at uplifting vulnerable groups and creating true inclusion.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <ScrollReveal variant="slide-left" delay={0}>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#C62828] border-2 border-[#0A0A0A] flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A]">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque']">Vulnerable Support & Welfare</h3>
                <p className="text-sm text-[#0A0A0A]/80 leading-relaxed font-medium">
                  Direct relief distributions, essential supplies, and community care frameworks designed to alleviate immediate hardships for struggling families.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0A0A0A]/10 text-xs font-bold uppercase text-[#C62828]">Active Community Support</div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="zoom-in" delay={150}>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#00897B] border-2 border-[#0A0A0A] flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A]">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque']">Disability Inclusion</h3>
                <p className="text-sm text-[#0A0A0A]/80 leading-relaxed font-medium">
                  Advocating for and integrating persons with disabilities into economic and societal frameworks, ensuring equal opportunity and dignity.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0A0A0A]/10 text-xs font-bold uppercase text-[#00897B]">Equal Participation</div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-right" delay={300}>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#C62828] border-2 border-[#0A0A0A] flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A]">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque']">Government & Institutional Alignment</h3>
                <p className="text-sm text-[#0A0A0A]/80 leading-relaxed font-medium">
                  Engaging key governmental offices and public bodies to build synergistic frameworks that amplify our reach across the state and nation.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0A0A0A]/10 text-xs font-bold uppercase text-[#C62828]">Systemic Integration</div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 4. THE CALL TO JOIN HANDS */}
      <section className="max-w-5xl mx-auto px-6">
        <ScrollReveal variant="skew-up">
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-8 md:p-14 space-y-6 text-center">
            <span className="bg-[#00897B] text-white text-xs font-bold uppercase px-3.5 py-1.5 border border-[#0A0A0A]">
              Partner With Us
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Let's Put Our Hands Together to Achieve More
            </h2>
            <p className="text-base md:text-lg text-[#0A0A0A]/80 font-medium max-w-2xl mx-auto leading-relaxed">
              We have come this far through sheer personal determination and sacrifice. Imagine how much further we can go when conscious partners, donors, and changemakers join hands with us. Together, we can cement a lasting impact across our states and the entire nation of Nigeria.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/partner-with-us"
                className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-sm uppercase px-8 py-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#293241] transition-all"
              >
                Partner With Us <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-[#00897B] text-white font-bold text-sm uppercase px-8 py-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#293241] transition-all"
              >
                Support Our Outreaches <Heart className="w-5 h-5 fill-current" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}