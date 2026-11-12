
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from 'lucide-react';

declare global {
  interface Window {
    gtranslateSettings?: {
      default_language: string;
      languages: string[];
      wrapper_selector: string;
    };
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Stories', href: '/stories' },
    { name: 'Donate', href: '/donate' },
    { name: 'Store', href: '/store' },
    { name: 'Become a Volunteer', href: '/volunteer' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const closeMenu = useCallback(() => setIsOpen(false), []);

  // GTranslate integration
  useEffect(() => {
    window.gtranslateSettings = {
      default_language: 'en',
      languages: [
        'en',
        'fr',
        'ha',
        'ar',
        'es',
        'pt',
        'de',
        'it',
        'nl',
        'zh-CN',
        'zh-TW',
        'ja',
        'ko',
        'sw',
        'yo',
        'ig',
        'tr',
        'ru',
        'hi',
        'id',
        'ur',
        'bn',
        'am',
        'tl',
      ],
      wrapper_selector: '.gtranslate_wrapper',
    };

    if (document.getElementById('gtranslate-script')) return;

    const script = document.createElement('script');
    script.id = 'gtranslate-script';
    script.src = 'https://cdn.gtranslate.net/widgets/latest/dropdown.js';
    script.defer = true;

    document.body.appendChild(script);
  }, []);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Mobile keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;

    const menu = menuRef.current;
    if (!menu) return;

    const focusable = menu.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        toggleRef.current?.focus();
      }
    };

    menu.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);

    return () => {
      menu.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeMenu]);

  // Close menu after navigation
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-[#FFFFFE] border-b-2 border-[#0A0A0A] transition-shadow ${
          isScrolled
            ? 'shadow-[0_4px_0px_0px_#0A0A0A]'
            : ''
        }`}
      >
        {/* HEADER CONTAINER */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 min-h-20 flex items-center justify-between gap-2">

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group min-w-0 shrink"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="https://res.cloudinary.com/drnrbfltr/image/upload/v1793762135/a_clean_vector_style_sticker_emoji_illustration_on_bnu77d.png"
                alt="Extend Love Initiative Logo"
                width={48}
                height={48}
                priority
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <span
                translate="no"
                className="notranslate font-extrabold text-xl sm:text-2xl text-[#293241] tracking-tight"
              >
                ELI7
              </span>

              <span
                translate="no"
                className="notranslate bg-[#00897B] text-white font-extrabold text-[9px] sm:text-xs uppercase px-1.5 sm:px-2 py-1 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] whitespace-nowrap"
              >
                FOUNDATION
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`font-bold text-sm transition-colors relative ${
                  isActive(link.href)
                    ? 'text-[#C62828]'
                    : 'text-[#0A0A0A] hover:text-[#C62828]'
                }`}
              >
                {link.name}

                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C62828]" />
                )}
              </Link>
            ))}
          </nav>

          {/* DESKTOP DONATE BUTTON */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/donate"
              className="bg-[#C62828] text-white font-bold text-sm px-5 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#0A0A0A] transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current" />
              Donate Now
            </Link>
          </div>

          {/* LANGUAGE SELECTOR */}
          <div
            className="gtranslate_wrapper shrink-0"
            aria-label="Select website language"
          />

          {/* MOBILE MENU BUTTON */}
          <button
            ref={toggleRef}
            onClick={() => setIsOpen((prev) => !prev)}
            className="lg:hidden shrink-0 p-2 bg-[#00897B] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-label="Mobile navigation"
          className={`lg:hidden bg-[#FFFFFE] border-b-2 border-[#0A0A0A] overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? 'max-h-[500px] opacity-100'
              : 'max-h-0 opacity-0 border-b-0'
          }`}
        >
          <div className="px-6 py-6 space-y-4">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`block font-bold text-base transition-colors ${
                  isActive(link.href)
                    ? 'text-[#C62828]'
                    : 'text-[#0A0A0A] hover:text-[#C62828]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-[#0A0A0A]/10">
              <Link
                href="/donate"
                className="w-full bg-[#C62828] text-white font-bold text-center py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#0A0A0A] transition-all"
              >
                <Heart className="w-4 h-4 fill-current" />
                Donate
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* GTRANSLATE STYLING */}
      <style jsx global>{`
        .gtranslate_wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          flex-shrink: 0;
          z-index: 60;
        }

        .gtranslate_wrapper select {
          font-family: inherit !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          color: #293241 !important;
          background-color: #fffffe !important;
          border: 2px solid #0a0a0a !important;
          border-radius: 0 !important;
          padding: 7px 18px 7px 6px !important;
          max-width: 105px;
          width: 100%;
          cursor: pointer;
          outline-offset: 2px;
        }

        .gtranslate_wrapper select:focus {
          outline: 2px solid #00897b;
        }

        @media (max-width: 480px) {
          .gtranslate_wrapper select {
            max-width: 82px;
            font-size: 10px !important;
            padding: 6px 14px 6px 5px !important;
          }
        }

        @media (max-width: 360px) {
          .gtranslate_wrapper select {
            max-width: 70px;
            font-size: 9px !important;
            padding: 5px 10px 5px 4px !important;
          }
        }
      `}</style>
    </>
  );
}
