
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  ArrowUpRight,
  Heart,
  Users,
  GraduationCap,
  MapPin,
  Clock,
  HandHeart,
  Lightbulb
} from 'lucide-react';

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
    interest: 'Education',
    availability: 'Part-time',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { error } = await supabase
      .from('volunteer_submissions')
      .insert([formData]);

    setLoading(false);

    if (error) {
      setErrorMessage(
        'We could not submit your application. Please try again.'
      );
      return;
    }

    setSuccess(true);

    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      skills: '',
      interest: 'Education',
      availability: 'Part-time',
      message: '',
    });
  };

  const inputStyle =
    "w-full p-4 border-2 border-[#293241]/30 bg-transparent text-[#293241] placeholder:text-[#555555] focus:border-[#00897B] focus:outline-none transition-colors";

  return (
    <main className="min-h-screen bg-transparent text-[#293241]">

      <section className="px-6 py-16 md:py-20 lg:py-24">

        <div className="max-w-7xl mx-auto">

          {/* PAGE INTRODUCTION */}
          <div className="mb-14 md:mb-16">

            <span className="inline-flex items-center gap-2 bg-[#C62828] text-white px-5 py-3 border border-[#0A0A0A] text-sm font-bold tracking-wide uppercase">
              <Heart size={17} />
              Give Your Time & Skills
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-[68px] font-extrabold font-['Bricolage_Grotesque'] leading-[1.08] tracking-tight mt-7 max-w-4xl">
              Volunteer With ELI7.
            </h1>

            <p className="text-lg md:text-xl text-[#414141] mt-6 max-w-4xl leading-relaxed">
              Meaningful change begins with people who are willing to
              make a difference. Join a growing community of individuals
              committed to extending opportunities, empowering communities,
              and building a better future across Nigeria.
            </p>

            <div className="flex gap-4 mt-8">
              <div className="w-20 h-[5px] bg-[#C62828]" />
              <div className="w-10 h-[5px] bg-[#00897B]" />
              <div className="w-5 h-[5px] bg-[#FFD23F]" />
            </div>

          </div>

          {/* MAIN CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">

            {/* LEFT: VOLUNTEER INFORMATION */}
            <div className="space-y-10">

              <div>
                <span className="text-[#C62828] font-bold text-sm tracking-[0.18em] uppercase">
                  Become Part of the Mission
                </span>

                <h2 className="text-3xl md:text-4xl font-extrabold font-['Bricolage_Grotesque'] mt-3 leading-tight">
                  There Is a Place for You Here.
                </h2>

                <p className="text-base md:text-lg text-[#414141] mt-4 leading-relaxed">
                  We are looking for passionate individuals who understand
                  our vision and are ready to stand with us.
                </p>

                <p className="text-base md:text-lg text-[#414141] mt-4 leading-relaxed">
                  Whether you bring existing skills and talents to the
                  table, or you're simply driven by a heart to serve
                  and a willingness to learn, there is a place for you here.
                </p>

                <p className="text-base md:text-lg text-[#414141] mt-4 leading-relaxed">
                  You don't need to have previous experience to get started.
                  We are committed to training, equipping, and mentoring
                  people with the dedication to make an impact.
                </p>

                <p className="text-base md:text-lg font-bold text-[#293241] mt-4">
                  All you need to bring is your commitment.
                </p>
              </div>

              {/* VOLUNTEER OPPORTUNITIES */}
              <div className="space-y-7">

                <div className="flex gap-5 items-start">

                  <div className="bg-[#C62828] text-white p-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] shrink-0">
                    <GraduationCap size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-xl font-['Bricolage_Grotesque']">
                      Education & Mentorship
                    </h3>

                    <p className="text-base text-[#414141] mt-2 leading-relaxed">
                      Help young people access knowledge, guidance,
                      learning opportunities, and personal development.
                    </p>
                  </div>

                </div>

                <div className="flex gap-5 items-start">

                  <div className="bg-[#00897B] text-white p-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] shrink-0">
                    <Users size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-xl font-['Bricolage_Grotesque']">
                      Community Development
                    </h3>

                    <p className="text-base text-[#414141] mt-2 leading-relaxed">
                      Participate in outreach programmes, community
                      engagement, and initiatives that create lasting impact.
                    </p>
                  </div>

                </div>

                <div className="flex gap-5 items-start">

                  <div className="bg-[#FFD23F] text-[#293241] p-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] shrink-0">
                    <HandHeart size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-xl font-['Bricolage_Grotesque']">
                      Inclusion & Empowerment
                    </h3>

                    <p className="text-base text-[#414141] mt-2 leading-relaxed">
                      Support women, girls, persons with disabilities,
                      and underserved communities.
                    </p>
                  </div>

                </div>

                <div className="flex gap-5 items-start">

                  <div className="bg-[#293241] text-white p-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] shrink-0">
                    <Lightbulb size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-xl font-['Bricolage_Grotesque']">
                      Skills & Innovation
                    </h3>

                    <p className="text-base text-[#414141] mt-2 leading-relaxed">
                      Bring your professional expertise, creativity,
                      technical abilities, and fresh ideas to our work.
                    </p>
                  </div>

                </div>

              </div>

              {/* CLOSING MESSAGE */}
              <div className="border-l-[5px] border-[#C62828] pl-6 py-2">

                <h3 className="text-2xl font-bold font-['Bricolage_Grotesque']">
                  Your Contribution Matters.
                </h3>

                <p className="text-base text-[#414141] mt-3 leading-relaxed">
                  Every skill, every helping hand, and every committed
                  individual can contribute to a more inclusive future.
                </p>

              </div>

            </div>

            {/* RIGHT: APPLICATION FORM */}
            <div className="w-full">

              <div className="mb-8">

                <span className="text-[#C62828] text-sm font-bold tracking-[0.18em] uppercase">
                  Volunteer Application
                </span>

                <h2 className="text-3xl md:text-4xl font-extrabold font-['Bricolage_Grotesque'] mt-3">
                  Take the First Step.
                </h2>

                <p className="text-base text-[#414141] mt-3 leading-relaxed">
                  Tell us a little about yourself, your interests,
                  and how you would like to contribute.
                </p>

              </div>

              {success ? (

                <div className="border-2 border-[#0A0A0A] bg-[#00897B] text-white p-8 shadow-[6px_6px_0px_#0A0A0A] text-center space-y-4">

                  <Heart size={40} className="mx-auto" />

                  <h3 className="text-3xl font-bold font-['Bricolage_Grotesque']">
                    Application Received!
                  </h3>

                  <p className="text-white leading-relaxed">
                    Thank you for stepping forward and expressing
                    interest in volunteering with ELI7 Foundation.
                    Our team will review your application and reach out.
                  </p>

                  <button
                    onClick={() => setSuccess(false)}
                    className="underline font-bold"
                  >
                    Submit another application
                  </button>

                </div>

              ) : (

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  {/* NAME AND EMAIL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block font-bold text-sm text-[#293241] mb-3">
                        Full Name *
                      </label>

                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        className={inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-sm text-[#293241] mb-3">
                        Email Address *
                      </label>

                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Your email address"
                        className={inputStyle}
                      />
                    </div>

                  </div>

                  {/* PHONE AND LOCATION */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block font-bold text-sm text-[#293241] mb-3">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Your phone number"
                        className={inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-sm text-[#293241] mb-3">
                        Location / City *
                      </label>

                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="Where are you based?"
                        className={inputStyle}
                      />
                    </div>

                  </div>

                  {/* SKILLS */}
                  <div>
                    <label className="block font-bold text-sm text-[#293241] mb-3">
                      Skills & Expertise *
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.skills}
                      onChange={(e) =>
                        setFormData({ ...formData, skills: e.target.value })
                      }
                      placeholder="e.g. Teaching, Digital Marketing, Community Mobilization"
                      className={inputStyle}
                    />
                  </div>

                  {/* INTEREST AND AVAILABILITY */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block font-bold text-sm text-[#293241] mb-3">
                        Area of Interest *
                      </label>

                      <select
                        required
                        value={formData.interest}
                        onChange={(e) =>
                          setFormData({ ...formData, interest: e.target.value })
                        }
                        className={inputStyle}
                      >
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Women & Girls Empowerment">
                          Women & Girls Empowerment
                        </option>
                        <option value="Disability Inclusion">
                          Disability Inclusion
                        </option>
                        <option value="Community Development">
                          Community Development
                        </option>
                        <option value="Digital & Technology">
                          Digital & Technology
                        </option>
                        <option value="Communications & Media">
                          Communications & Media
                        </option>
                        <option value="Fundraising">Fundraising</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-sm text-[#293241] mb-3">
                        Availability *
                      </label>

                      <select
                        required
                        value={formData.availability}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availability: e.target.value
                          })
                        }
                        className={inputStyle}
                      >
                        <option value="Part-time">Part-time</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Weekends">Weekends</option>
                        <option value="Occasionally">Occasionally</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>

                  </div>

                  {/* MOTIVATION */}
                  <div>
                    <label className="block font-bold text-sm text-[#293241] mb-3">
                      Why Do You Want to Volunteer? *
                    </label>

                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us what motivates you to join ELI7 Foundation..."
                      className={`${inputStyle} resize-y`}
                    />
                  </div>

                  {/* ERROR MESSAGE */}
                  {errorMessage && (
                    <p
                      role="alert"
                      className="text-[#C62828] text-sm font-semibold"
                    >
                      {errorMessage}
                    </p>
                  )}

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C62828] text-white font-bold py-5 px-6 border-2 border-[#0A0A0A] shadow-[5px_5px_0px_#0A0A0A] hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? 'Submitting Application...'
                      : 'Submit Volunteer Application'}

                    {!loading && <ArrowUpRight size={20} />}
                  </button>

                  <p className="text-xs text-center text-[#414141]">
                    Your information will only be used to process your
                    volunteer application.
                  </p>

                </form>

              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
