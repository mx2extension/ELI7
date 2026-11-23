'use client';

import Link from 'next/link';
import { useState } from 'react';
import { submitFooterMessage } from '@/app/actions/footerMessage';

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const toggleEnvelope = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const result = await submitFooterMessage(email);

    if (result.error) {
      setStatus('error');
      setMessage(result.error);
    } else if (result.success) {
      setStatus('success');
      setMessage(result.success);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#293241] text-[#FFFFFE] border-t-2 border-[#0A0A0A] mt-20 relative">
      {/* Message & Envelope Graphic */}
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="flex justify-center mb-16">
          <div className="relative w-full max-w-2xl flex flex-col items-center">
            {/* Expandable Letter */}
            <div
              className={`w-full transition-all duration-500 ease-out overflow-hidden ${
                isOpen
                  ? 'max-h-[600px] opacity-100 -mb-10 z-10'
                  : 'max-h-0 opacity-0 mb-0 pointer-events-none'
              }`}
            >
              <div className="bg-[#FFFFFE] p-8 md:p-10 rounded-t-lg shadow-2xl border-2 border-b-0 border-[#0A0A0A] mx-auto">
                <h3 className="text-xl md:text-2xl font-bold text-[#0A0A0A] mb-2 text-center">
                  Leave us a Message
                </h3>
                <p className="text-[#0A0A0A]/80 text-center mb-6 text-sm">
                  We&apos;d love to hear from you. Drop your email below.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 border-2 border-[#0A0A0A] bg-[#FFFFFE] text-[#0A0A0A] rounded focus:outline-none focus:border-[#C62828]"
                    disabled={status === 'loading'}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-[#C62828] text-white font-bold px-6 py-3 border-2 border-[#0A0A0A] hover:bg-red-700 transition-colors uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>

                {message && (
                  <p
                    className={`text-sm mt-4 text-center font-medium ${
                      status === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {message}
                  </p>
                )}

                <div className="flex gap-2 mt-8 opacity-20">
                  <div className="h-1 w-full bg-gray-400 rounded" />
                  <div className="h-1 w-1/2 bg-gray-400 rounded" />
                </div>
              </div>
            </div>

            {/* Envelope Body & Toggle Button */}
            <button
              type="button"
              onClick={toggleEnvelope}
              className="w-full relative h-32 md:h-40 focus:outline-none group"
              aria-label={isOpen ? 'Close message envelope' : 'Open message envelope'}
            >
              <svg
                className="absolute inset-0 w-full h-full transition-opacity group-hover:opacity-95"
                viewBox="0 0 672 160"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <rect width="672" height="160" fill="#3a4757" stroke="#0A0A0A" strokeWidth="2" />
                <polygon points="0,0 672,0 336,160" fill="#293241" stroke="#0A0A0A" strokeWidth="2" />
                <line x1="0" y1="0" x2="336" y2="160" stroke="#0A0A0A" strokeWidth="2" />
                <line x1="672" y1="0" x2="336" y2="160" stroke="#0A0A0A" strokeWidth="2" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-[#C62828] text-white font-bold px-6 py-3 border-2 border-[#0A0A0A] uppercase tracking-wider text-sm shadow-[3px_3px_0px_0px_#0A0A0A] group-hover:shadow-none group-hover:translate-x-[3px] group-hover:translate-y-[3px] transition-all">
                  {isOpen ? 'Close Message' : 'Open Message'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-white/10 pt-16 items-start">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <Link
            href="/"
            className="font-extrabold text-2xl text-[#FFFFFE] tracking-tight inline-flex items-center gap-2"
          >
            <span className="bg-[#C62828] text-white px-2 py-1 border-2 border-[#0A0A0A]">
              ELI7
            </span>
            <span>Foundation</span>
          </Link>
          <p className="text-sm text-[#FFFFFE]/85 leading-relaxed">
            A women-led organization advancing full inclusion for persons with
            disabilities, expanding equal access to digital skills, digital
            awareness, education, healthcare, and community growth. Our vision is a Nigeria where every individual have equal opportunities to thrive as equal participants in society. Join us in creating barrier‑breaking change!
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://x.com/elih7foundation"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border-2 border-white/25 flex items-center justify-center text-[#FFFFFE]/80 hover:text-white hover:border-[#C62828] hover:bg-[#C62828] transition-colors"
              aria-label="Follow us on X"
            >
              <XIcon className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com/@eli7foundation"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border-2 border-white/25 flex items-center justify-center text-[#FFFFFE]/80 hover:text-white hover:border-[#C62828] hover:bg-[#C62828] transition-colors"
              aria-label="Subscribe on YouTube"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/eli7foundation"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border-2 border-white/25 flex items-center justify-center text-[#FFFFFE]/80 hover:text-white hover:border-[#C62828] hover:bg-[#C62828] transition-colors"
              aria-label="Follow us on Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:eli7foundation@gmail.com"
              className="w-10 h-10 border-2 border-white/25 flex items-center justify-center text-[#FFFFFE]/80 hover:text-white hover:border-[#C62828] hover:bg-[#C62828] transition-colors"
              aria-label="Email us"
            >
              <MailIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="font-bold text-[#C62828] uppercase text-xs tracking-wider mb-4">
            Explore
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/about" className="hover:underline text-[#FFFFFE]/90">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/our-work" className="hover:underline text-[#FFFFFE]/90">
                Our Work
              </Link>
            </li>
            <li>
              <Link href="/programs" className="hover:underline text-[#FFFFFE]/90">
                Programs
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:underline text-[#FFFFFE]/90">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/impact" className="hover:underline text-[#FFFFFE]/90">
                Impact
              </Link>
            </li>
          </ul>
        </div>

        {/* Action Links */}
        <div>
          <h4 className="font-bold text-[#C62828] uppercase text-xs tracking-wider mb-4">
            Get Involved
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/get-involved" className="hover:underline text-[#FFFFFE]/90">
                How to Help
              </Link>
            </li>
            <li>
              <Link href="/stories/submit" className="hover:underline text-[#FFFFFE]/90">
                Submit a Story
              </Link>
            </li>
            <li>
              <Link href="/partner" className="hover:underline text-[#FFFFFE]/90">
                Partner with Us
              </Link>
            </li>
            <li>
              <Link href="/donate" className="hover:underline text-[#FFFFFE]/90">
                Donate
              </Link>
            </li>
            <li>
              <Link href="/store" className="hover:underline text-[#FFFFFE]/90">
                Store
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline text-[#FFFFFE]/90">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Location */}
        <div>
          <h4 className="font-bold text-[#C62828] uppercase text-xs tracking-wider mb-4">
            Contact
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="text-[#FFFFFE]/85">
              <a href="tel:+2347034684943" className="hover:underline">
                +234 703 468 4943
              </a>
            </li>
            <li className="text-[#FFFFFE]/85">Bauchi State, Nigeria</li>
          </ul>
          <p className="text-xs text-[#FFFFFE]/55 mt-6">
            &copy; {new Date().getFullYear()} ELI7 Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}