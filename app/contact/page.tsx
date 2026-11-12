
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Heart,
  X
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  const whatsappMessage = encodeURIComponent(
    "Hello ELI7 Foundation, I would like to make an enquiry. Please assist me."
  );

  const whatsappContacts = [
    {
      label: 'Ammie',
      number: '+234 703 468 4943',
      link: `https://wa.me/2347034684943?text=${whatsappMessage}`
    },
    {
      label: 'King',
      number: '+234 814 919 3063',
      link: `https://wa.me/2348149193063?text=${whatsappMessage}`
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { error } = await supabase
      .from('contact_submissions')
      .insert([formData]);

    setLoading(false);

    if (error) {
      setErrorMessage('Something went wrong. Please try again.');
      return;
    }

    setSuccess(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const inputStyle =
    "w-full p-4 border-2 border-[#293241]/30 bg-transparent text-[#293241] placeholder:text-[#555555] focus:border-[#00897B] focus:outline-none transition-colors";

  return (
    <main className="min-h-screen bg-transparent text-[#293241]">

      {/* CONTACT CONTENT */}
      <section className="px-6 py-16 md:py-20 lg:py-24">

        <div className="max-w-7xl mx-auto">

          {/* PAGE INTRODUCTION */}
          <div className="mb-14 md:mb-16">

            <span className="inline-flex items-center gap-2 bg-[#C62828] text-white px-5 py-3 border border-[#0A0A0A] text-sm font-bold tracking-wide uppercase">
              <MessageCircle size={17} />
              Get In Touch
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-[68px] font-extrabold font-['Bricolage_Grotesque'] leading-[1.08] tracking-tight mt-7 max-w-4xl">
              Let's Start a Conversation.
            </h1>

            <p className="text-lg md:text-xl text-[#414141] mt-6 max-w-3xl leading-relaxed">
              Have questions, partnership inquiries, or want to
              contribute to our mission? We would love to hear from you.
              Let's work together to create meaningful change.
            </p>

            <div className="flex gap-4 mt-8">
              <div className="w-20 h-[5px] bg-[#C62828]" />
              <div className="w-10 h-[5px] bg-[#00897B]" />
              <div className="w-5 h-[5px] bg-[#FFD23F]" />
            </div>

          </div>

          {/* TWO COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">

            {/* LEFT: CONTACT INFORMATION */}
            <div className="space-y-10">

              <div>
                <span className="text-[#C62828] font-bold text-sm tracking-[0.18em] uppercase">
                  Our Information
                </span>

                <h2 className="text-3xl md:text-4xl font-extrabold font-['Bricolage_Grotesque'] mt-3 leading-tight">
                  We're Here to Connect.
                </h2>

                <p className="text-base md:text-lg text-[#414141] mt-4 leading-relaxed">
                  Whether you're interested in our work, seeking
                  collaboration, or looking to support our initiatives,
                  our team is ready to connect with you.
                </p>
              </div>

              {/* LOCATION */}
              <div className="flex gap-5 items-start">

                <div className="bg-[#C62828] text-white p-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] shrink-0">
                  <MapPin size={23} />
                </div>

                <div>
                  <h3 className="font-bold text-xl font-['Bricolage_Grotesque']">
                    Our Location
                  </h3>

                  <p className="text-base md:text-lg text-[#414141] mt-2">
                    Bauchi, Bauchi State, Nigeria
                  </p>
                </div>

              </div>

              {/* PHONE NUMBERS */}
              <div className="flex gap-5 items-start">

                <div className="bg-[#00897B] text-white p-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] shrink-0">
                  <Phone size={23} />
                </div>

                <div>
                  <h3 className="font-bold text-xl font-['Bricolage_Grotesque']">
                    Phone Numbers
                  </h3>

                  <div className="mt-2 space-y-2">
                    <a
                      href="tel:+2347034684943"
                      className="block text-base md:text-lg text-[#414141] hover:text-[#C62828] transition-colors"
                    >
                      +234 703 468 4943
                    </a>

                    <a
                      href="tel:+2348149193063"
                      className="block text-base md:text-lg text-[#414141] hover:text-[#C62828] transition-colors"
                    >
                      +234 814 919 3063
                    </a>
                  </div>
                </div>

              </div>

              {/* EMAIL */}
              <div className="flex gap-5 items-start">

                <div className="bg-[#FFD23F] text-[#293241] p-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] shrink-0">
                  <Mail size={23} />
                </div>

                <div>
                  <h3 className="font-bold text-xl font-['Bricolage_Grotesque']">
                    Email Address
                  </h3>

                  <a
                    href="mailto:eli7foundation@gmail.com"
                    className="block text-base md:text-lg text-[#414141] hover:text-[#C62828] transition-colors mt-2 break-all"
                  >
                    eli7foundation@gmail.com
                  </a>
                </div>

              </div>

              {/* CLOSING MESSAGE */}
              <div className="border-l-[5px] border-[#C62828] pl-6 py-2">

                <h3 className="text-2xl font-bold font-['Bricolage_Grotesque']">
                  Every Connection Matters.
                </h3>

                <p className="text-base text-[#414141] mt-3 leading-relaxed">
                  We believe meaningful change begins when people
                  come together. We look forward to hearing from you.
                </p>

              </div>

            </div>

            {/* RIGHT: CONTACT FORM */}
            <div className="w-full">

              <div className="mb-8">

                <span className="text-[#C62828] text-sm font-bold tracking-[0.18em] uppercase">
                  Send Us a Message
                </span>

                <h2 className="text-3xl md:text-4xl font-extrabold font-['Bricolage_Grotesque'] mt-3">
                  How Can We Help?
                </h2>

                <p className="text-base text-[#414141] mt-3 leading-relaxed">
                  Complete the form below and someone from our team
                  will get back to you.
                </p>

              </div>

              {success ? (

                <div className="border-2 border-[#0A0A0A] bg-[#00897B] text-white p-8 shadow-[6px_6px_0px_#0A0A0A] text-center space-y-4">

                  <Heart size={38} className="mx-auto" />

                  <h3 className="text-3xl font-bold font-['Bricolage_Grotesque']">
                    Message Received!
                  </h3>

                  <p className="text-white">
                    Thank you for reaching out to ELI7 Foundation.
                    A member of our team will respond shortly.
                  </p>

                  <button
                    onClick={() => setSuccess(false)}
                    className="underline font-bold"
                  >
                    Send another message
                  </button>

                </div>

              ) : (

                <form onSubmit={handleSubmit} className="space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block font-bold text-sm text-[#293241] mb-3">
                        Your Name *
                      </label>

                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your name"
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

                  <div>
                    <label className="block font-bold text-sm text-[#293241] mb-3">
                      Subject *
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="What would you like to discuss?"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-sm text-[#293241] mb-3">
                      Your Message *
                    </label>

                    <textarea
                      required
                      rows={7}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Write your message here..."
                      className={`${inputStyle} resize-y`}
                    />
                  </div>

                  {errorMessage && (
                    <p role="alert" className="text-[#C62828] text-sm font-semibold">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C62828] text-white font-bold py-5 px-6 border-2 border-[#0A0A0A] shadow-[5px_5px_0px_#0A0A0A] hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending Message...' : 'Send Message'}

                    {!loading && <ArrowUpRight size={20} />}
                  </button>

                  <p className="text-xs text-center text-[#414141]">
                    Your information will only be used to respond to your enquiry.
                  </p>

                </form>

              )}

            </div>

          </div>

        </div>
      </section>

      {/* FLOATING WHATSAPP */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">

        {/* WHATSAPP POPUP */}
        <div
          className={`mb-4 w-[320px] max-w-[calc(100vw-48px)] origin-bottom-right transition-all duration-300 ${
            whatsappOpen
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
          }`}
          aria-hidden={!whatsappOpen}
        >

          <div className="bg-white border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] overflow-hidden">

            <div className="bg-[#00897B] text-white p-5 flex items-center justify-between">

              <div>
                <h3 className="font-bold text-xl font-['Bricolage_Grotesque']">
                  Chat With Us
                </h3>

                <p className="text-white text-xs mt-1">
                  Select a number to start a conversation
                </p>
              </div>

              <MessageCircle size={27} />

            </div>

            <div className="p-4 space-y-3">

              {whatsappContacts.map((contact) => (

                <a
                  key={contact.number}
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={whatsappOpen ? 0 : -1}
                  className="flex items-center gap-3 p-3 border-2 border-[#293241]/20 hover:border-[#00897B] hover:bg-[#00897B]/5 transition-all group"
                >

                  <div className="bg-[#25D366] text-white p-3 rounded-full shrink-0">
                    <MessageCircle size={19} />
                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-bold text-[#293241]">
                      {contact.label}
                    </p>

                    <p className="text-sm text-[#414141]">
                      {contact.number}
                    </p>

                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-[#00897B] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />

                </a>

              ))}

              <p className="text-xs text-center text-[#414141] pt-2">
                A pre-filled message will be ready for you on WhatsApp.
              </p>

            </div>

          </div>

        </div>

        {/* FLOATING BUTTON */}
        <button
          type="button"
          onClick={() => setWhatsappOpen(!whatsappOpen)}
          aria-label={whatsappOpen ? 'Close WhatsApp contacts' : 'Open WhatsApp contacts'}
          aria-expanded={whatsappOpen}
          className="w-[62px] h-[62px] rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-[3px] border-white"
        >
          {whatsappOpen ? (
            <X size={27} />
          ) : (
            <MessageCircle size={30} fill="white" strokeWidth={1.5} />
          )}
        </button>

      </div>

    </main>
  );
}
