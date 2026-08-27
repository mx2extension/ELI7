'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ArrowUpRight } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('contact_submissions').insert([formData]);
    setLoading(false);
    if (!error) setSuccess(true);
  };

  return (
    <div className="min-h-screen py-16 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-[#C62828] font-bold text-sm tracking-widest uppercase">Get In Touch</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] mt-2">
          Contact ELI7 Foundation
        </h1>
        <p className="text-lg text-[#0A0A0A]/80 mt-4">
          Have questions, partnership inquiries, or want to say hello? Send us a message.
        </p>
      </div>

      {success ? (
        <div className="bg-[#00897B] text-[#FFFFFE] p-8 border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] text-center space-y-4">
          <h3 className="text-3xl font-bold font-['Bricolage_Grotesque']">Message Sent Successfully</h3>
          <p className="text-white/80">Thank you for reaching out. A member of our team will respond to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#FFFFFE] p-8 md:p-12 border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-sm text-[#293241] mb-2">Your Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 border-2 border-[#0A0A0A] bg-[#F4F1EA]"
              />
            </div>
            <div>
              <label className="block font-bold text-sm text-[#293241] mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-4 border-2 border-[#0A0A0A] bg-[#F4F1EA]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-sm text-[#293241] mb-2">Subject *</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full p-4 border-2 border-[#0A0A0A] bg-[#F4F1EA]"
            />
          </div>

          <div>
            <label className="block font-bold text-sm text-[#293241] mb-2">Message *</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-4 border-2 border-[#0A0A0A] bg-[#F4F1EA]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C62828] text-white font-bold py-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Sending Message...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}