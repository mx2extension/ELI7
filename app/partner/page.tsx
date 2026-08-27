'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import ScrollReveal from '@/components/ScrollReveal';
import { Handshake, Building2, Globe2, Award, ArrowUpRight, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export default function PartnerWithUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Partnership Inquiry',
    message: '',
  });
  
  // Extra specific fields for partnership context mapped into the message payload
  const [extraFields, setExtraFields] = useState({
    organization_name: '',
    partnership_interest: 'Programmatic Co-Funding',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExtraChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setExtraFields({ ...extraFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Format the message neatly to include organization details in your existing messages table
    const formattedMessage = `[PARTNERSHIP INQUIRY]\nOrganization: ${extraFields.organization_name}\nInterest Track: ${extraFields.partnership_interest}\n\nGoals / Message:\n${formData.message}`;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: `Partnership: ${extraFields.organization_name}`,
          message: formattedMessage,
        }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      console.error('Error saving partnership inquiry:', err);
      setErrorMsg('Something went wrong. Please try again or reach out to us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-20 bg-[#F4F1EA]">
      
      {/* 1. HERO BANNER */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        <ScrollReveal variant="drop-down">
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-8 md:p-14 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
              <Handshake className="w-4 h-4" /> Strategic Collaboration
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight leading-tight">
              Partner with ELI7 Foundation to Build Lasting Social Impact Across Nigeria
            </h1>
            <p className="text-lg text-[#0A0A0A]/80 leading-relaxed font-medium max-w-3xl">
              We collaborate with forward-thinking corporations, international donor agencies, foundations, and public sector partners to scale sustainable educational programs, healthcare access, and economic empowerment for vulnerable groups.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. WHY PARTNER WITH US */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#00897B] text-white px-3 py-1 border border-[#0A0A0A]">The Value of Alliance</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Why Align Your Organization With Us?
            </h2>
            <p className="text-[#0A0A0A]/80 font-medium">
              When you join forces with ELI7 Foundation, you tap into verified grassroot networks and transparent execution frameworks.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal variant="slide-left" delay={0}>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#C62828] border-2 border-[#0A0A0A] flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A]">
                  <Globe2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque']">Nationwide Grassroot Access</h3>
                <p className="text-sm text-[#0A0A0A]/80 leading-relaxed font-medium">
                  Direct deployment pathways reaching underserved communities, persons with disabilities, and remote populations across multiple Nigerian states.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0A0A0A]/10 text-xs font-bold uppercase text-[#C62828]">Verified Footprint</div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="zoom-in" delay={150}>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#00897B] border-2 border-[#0A0A0A] flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A]">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque']">Radical Accountability</h3>
                <p className="text-sm text-[#0A0A0A]/80 leading-relaxed font-medium">
                  Rigorous reporting frameworks, digital impact dashboards, and transparent fund utilization metrics that satisfy global corporate governance standards.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0A0A0A]/10 text-xs font-bold uppercase text-[#00897B]">Full Transparency</div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-right" delay={300}>
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#C62828] border-2 border-[#0A0A0A] flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A]">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque']">Shared Social Value (CSV)</h3>
                <p className="text-sm text-[#0A0A0A]/80 leading-relaxed font-medium">
                  Co-create high-visibility CSR campaigns, community empowerment projects, and ESG milestones that strengthen your brand reputation.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0A0A0A]/10 text-xs font-bold uppercase text-[#C62828]">High ESG Alignment</div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. PARTNERSHIP MODELS */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <ScrollReveal variant="fade-up">
          <div className="bg-[#00897B] text-white border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-8 md:p-14 space-y-8">
            <div className="max-w-2xl space-y-3">
              <span className="bg-[#FFD23F] text-[#0A0A0A] text-xs font-bold uppercase px-3 py-1 border-2 border-[#0A0A0A]">Collaboration Tracks</span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-['Bricolage_Grotesque']">
                How We Can Work Together
              </h2>
              <p className="text-white/90 font-medium">
                We design flexible engagement frameworks tailored to your organization's philanthropic goals and strategic capacity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FFFFFE] text-[#0A0A0A] border-2 border-[#0A0A0A] p-6 space-y-3 shadow-[6px_6px_0px_#0A0A0A]">
                <h3 className="text-xl font-extrabold font-['Bricolage_Grotesque'] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C62828]" /> Programmatic Co-Funding
                </h3>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  Direct financial backing for specific ongoing initiatives such as educational scholarships, digital literacy bootcamps, or menstrual hygiene distribution drives.
                </p>
              </div>

              <div className="bg-[#FFFFFE] text-[#0A0A0A] border-2 border-[#0A0A0A] p-6 space-y-3 shadow-[6px_6px_0px_#0A0A0A]">
                <h3 className="text-xl font-extrabold font-['Bricolage_Grotesque'] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00897B]" /> Corporate Social Responsibility (CSR)
                </h3>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  Integrate your brand into national community impact projects, employee volunteer programs, and high-impact welfare distribution campaigns.
                </p>
              </div>

              <div className="bg-[#FFFFFE] text-[#0A0A0A] border-2 border-[#0A0A0A] p-6 space-y-3 shadow-[6px_6px_0px_#0A0A0A]">
                <h3 className="text-xl font-extrabold font-['Bricolage_Grotesque'] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C62828]" /> In-Kind & Technical Support
                </h3>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  Provide essential tools, software resources, medical supplies, educational materials, or professional expertise to scale our operational output.
                </p>
              </div>

              <div className="bg-[#FFFFFE] text-[#0A0A0A] border-2 border-[#0A0A0A] p-6 space-y-3 shadow-[6px_6px_0px_#0A0A0A]">
                <h3 className="text-xl font-extrabold font-['Bricolage_Grotesque'] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00897B]" /> Institutional Grant Partnership
                </h3>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  Grant allocations from international foundations and trusts aimed at systemic advocacy, disability inclusion, and economic upliftment.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. PARTNERSHIP INQUIRY FORM */}
      <section className="max-w-4xl mx-auto px-6">
        <ScrollReveal variant="skew-up">
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] p-8 md:p-12 space-y-6">
            <div className="space-y-2 text-center max-w-xl mx-auto">
              <span className="bg-[#C62828] text-white text-xs font-bold uppercase px-3 py-1 border border-[#0A0A0A]">Get in Touch</span>
              <h2 className="text-3xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">Start a Partnership Conversation</h2>
              <p className="text-sm text-gray-600 font-medium">Fill out the brief form below and our partnerships team will reach out within 24 hours.</p>
            </div>

            {submitted ? (
              <div className="bg-[#00897B] text-white border-2 border-[#0A0A0A] p-8 text-center space-y-3 shadow-[6px_6px_0px_#0A0A0A]">
                <h3 className="text-2xl font-extrabold font-['Bricolage_Grotesque']">Thank You for Reaching Out!</h3>
                <p className="text-sm font-medium">Your inquiry has been successfully recorded in our messages inbox. Our leadership team will review your details and contact you shortly.</p>
                <button 
                  onClick={() => { 
                    setSubmitted(false); 
                    setFormData({ name: '', email: '', subject: 'Partnership Inquiry', message: '' });
                    setExtraFields({ organization_name: '', partnership_interest: 'Programmatic Co-Funding' });
                  }}
                  className="mt-4 bg-[#FFFFFE] text-[#0A0A0A] font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#FFD23F] transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                {errorMsg && (
                  <div className="bg-[#C62828] text-white border-2 border-[#0A0A0A] p-4 text-sm font-bold shadow-[4px_4px_0px_#0A0A0A]">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-[#293241]">Organization / Company Name</label>
                    <input 
                      type="text" 
                      name="organization_name"
                      value={extraFields.organization_name}
                      onChange={handleExtraChange}
                      required 
                      placeholder="e.g. Acme Corporation" 
                      className="w-full bg-[#F4F1EA] border-2 border-[#0A0A0A] p-3 text-sm font-medium focus:outline-none focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-[#293241]">Contact Person & Title</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                      placeholder="e.g. Jane Doe, CSR Lead" 
                      className="w-full bg-[#F4F1EA] border-2 border-[#0A0A0A] p-3 text-sm font-medium focus:outline-none focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-[#293241]">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      placeholder="jane@company.com" 
                      className="w-full bg-[#F4F1EA] border-2 border-[#0A0A0A] p-3 text-sm font-medium focus:outline-none focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-[#293241]">Partnership Interest</label>
                    <select 
                      name="partnership_interest"
                      value={extraFields.partnership_interest}
                      onChange={handleExtraChange}
                      className="w-full bg-[#F4F1EA] border-2 border-[#0A0A0A] p-3 text-sm font-medium focus:outline-none focus:bg-white transition-colors"
                    >
                      <option>Programmatic Co-Funding</option>
                      <option>Corporate Social Responsibility (CSR)</option>
                      <option>In-Kind & Technical Support</option>
                      <option>Institutional Grant</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-[#293241]">Tell Us About Your Goals</label>
                  <textarea 
                    rows={4} 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required 
                    placeholder="Share a brief overview of how you'd like to collaborate..." 
                    className="w-full bg-[#F4F1EA] border-2 border-[#0A0A0A] p-3 text-sm font-medium focus:outline-none focus:bg-white transition-colors"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#C62828] text-white font-bold uppercase px-8 py-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#293241] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>Submitting Inquiry... <Loader2 className="w-5 h-5 animate-spin" /></>
                  ) : (
                    <>Submit Partnership Inquiry <ArrowUpRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}