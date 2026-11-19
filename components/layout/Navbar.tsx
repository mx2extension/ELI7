
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, ChevronDown } from 'lucide-react';

declare global {
  interface Window {
    gtranslateSettings?: {
      default_language: string;
      languages: string[];
      wrapper_selector: string;
    };
  }
}

const dropdownLinks = [
  {
    name: 'About',
    items: [
      { name: 'About Us', href: '/about' },
      { name: 'Projects', href: '/projects' },
      { name: 'Impact', href: '/impact' },
      { name: 'Programs', href: '/programs' },
    ],
  },
  {
    name: 'Media',
    items: [
      { name: 'News Articles', href: '/news' },
      { name: 'Stories', href: '/stories' },
      { name: 'Gallery', href: '/gallery' },
    ],
  },
  {
    name: 'Get Involved',
    items: [
      { name: 'Become a Volunteer', href: '/volunteer' },
      { name: 'How to Help', href: '/get-involved' },
      { name: 'Partner With Us', href: '/partner' },
    ],
  },
];

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Donate', href: '/donate' },
  { name: 'Store', href: '/store' },
  { name: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null);

  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setMobileDropdown(null);
    setDesktopDropdown(null);
  }, []);

  const isActive = (href: string) => pathname === href;

  const isDropdownActive = (items: { href: string }[]) =>
    items.some(item => pathname === item.href);

  // GOOGLE TRANSLATE INITIALIZATION
  useEffect(() => {
    window.gtranslateSettings = {
      default_language: 'en',
      languages: [
        'en', 'fr', 'ha', 'ar', 'es', 'pt', 'de', 'it', 'nl',
        'zh-CN', 'zh-TW', 'ja', 'ko', 'sw', 'yo', 'ig', 'tr',
        'ru', 'hi', 'id', 'ur', 'bn', 'am', 'tl',
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

  // CLOSE MENUS AFTER NAVIGATION
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // CLOSE DESKTOP DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest('[data-desktop-dropdown]')) {
        setDesktopDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDesktopDropdown(null);
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeMenu]);

  // MOBILE MENU SCROLL LOCK
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // MOBILE MENU KEYBOARD ACCESSIBILITY
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;

    const focusable = menu.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        toggleRef.current?.focus();
        return;
      }

      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    menu.addEventListener('keydown', handleKeyDown);

    return () => {
      menu.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  const toggleMobileDropdown = (name: string) => {
    setMobileDropdown(current =>
      current === name ? null : name
    );
  };

  const toggleDesktopDropdown = (name: string) => {
    setDesktopDropdown(current =>
      current === name ? null : name
    );
  };

  return (
    <>
      <header className="relative z-50 bg-[#FFFFFE] border-b-2 border-[#0A0A0A]">

        {/* MAIN HEADER */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 min-h-20 flex items-center justify-between gap-2">

          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2 sm:gap-3 shrink-0 group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="https://res.cloudinary.com/drnrbfltr/image/upload/v1793762135/a_clean_vector_style_sticker_emoji_illustration_on_bnu77d.png"
                alt="ELI7 Foundation Logo"
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
            className="hidden lg:flex items-center gap-4 xl:gap-5"
            aria-label="Main navigation"
          >

            {/* HOME FIRST */}
            <Link
              href="/"
              onClick={closeMenu}
              aria-current={isActive('/') ? 'page' : undefined}
              className={`font-bold text-sm whitespace-nowrap transition-colors ${
                isActive('/')
                  ? 'text-[#C62828]'
                  : 'text-[#0A0A0A] hover:text-[#C62828]'
              }`}
            >
              Home
            </Link>

            {/* DROPDOWN MENUS */}
            {dropdownLinks.map(dropdown => {
              const active = isDropdownActive(dropdown.items);
              const expanded = desktopDropdown === dropdown.name;

              return (
                <div
                  key={dropdown.name}
                  data-desktop-dropdown
                  className="relative"
                  onMouseEnter={() => setDesktopDropdown(dropdown.name)}
                  onMouseLeave={() => setDesktopDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => toggleDesktopDropdown(dropdown.name)}
                    onFocus={() => setDesktopDropdown(dropdown.name)}
                    aria-haspopup="true"
                    aria-expanded={expanded}
                    className={`flex items-center gap-1 font-bold text-sm whitespace-nowrap py-3 transition-colors ${
                      active || expanded
                        ? 'text-[#C62828]'
                        : 'text-[#0A0A0A] hover:text-[#C62828]'
                    }`}
                  >
                    {dropdown.name}

                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expanded && (
                    <div className="absolute left-0 top-full pt-2 min-w-[220px] z-[80]">
                      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] py-2">
                        {dropdown.items.map(item => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDesktopDropdown(null)}
                            className={`flex items-center justify-between px-5 py-3 text-sm font-semibold transition-colors ${
                              isActive(item.href)
                                ? 'bg-[#C62828] text-white'
                                : 'text-[#293241] hover:bg-[#00897B] hover:text-white'
                            }`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* REMAINING NAVIGATION LINKS */}
            {navLinks.slice(1).map(link => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`font-bold text-sm whitespace-nowrap transition-colors ${
                  isActive(link.href)
                    ? 'text-[#C62828]'
                    : 'text-[#0A0A0A] hover:text-[#C62828]'
                }`}
              >
                {link.name}
              </Link>
            ))}

          </nav>

          {/* DESKTOP DONATE NOW BUTTON */}
          <Link
            href="/donate"
            onClick={closeMenu}
            className="hidden lg:flex shrink-0 items-center gap-2 bg-[#C62828] text-white font-bold text-sm px-4 xl:px-5 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#0A0A0A] transition-all"
          >
            <Heart className="w-4 h-4 fill-current" />
            Donate Now
          </Link>

          {/* GOOGLE TRANSLATE - ALWAYS IN THE MAIN HEADER */}
          <div
            className="gtranslate_wrapper shrink-0"
            aria-label="Select website language"
          />

          {/* MOBILE MENU BUTTON */}
          <button
            ref={toggleRef}
            onClick={() => setIsOpen(prev => !prev)}
            className="lg:hidden shrink-0 p-2 bg-[#00897B] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
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
          aria-modal="true"
          aria-hidden={!isOpen}
          inert={!isOpen}
          className={`lg:hidden fixed top-20 left-0 right-0 bottom-0 bg-[#FFFFFE] z-[70] overflow-y-auto border-b-2 border-[#0A0A0A] transition-all duration-300 ease-in-out ${
            isOpen
              ? 'max-h-[100vh] opacity-100 visible'
              : 'max-h-0 opacity-0 invisible pointer-events-none border-b-0'
          }`}
        >
          <div className="px-6 py-6 pb-12 max-w-2xl mx-auto">

            {/* MOBILE HOME FIRST */}
            <Link
              href="/"
              onClick={closeMenu}
              className={`block py-4 border-b border-[#0A0A0A]/10 font-bold text-base ${
                isActive('/') ? 'text-[#C62828]' : 'text-[#293241]'
              }`}
            >
              Home
            </Link>

            {/* MOBILE DROPDOWNS */}
            {dropdownLinks.map(dropdown => {
              const expanded = mobileDropdown === dropdown.name;
              const active = isDropdownActive(dropdown.items);

              return (
                <div
                  key={dropdown.name}
                  className="border-b border-[#0A0A0A]/10"
                >
                  <button
                    type="button"
                    onClick={() => toggleMobileDropdown(dropdown.name)}
                    aria-expanded={expanded}
                    className={`w-full flex items-center justify-between py-4 font-bold text-base transition-colors ${
                      active ? 'text-[#C62828]' : 'text-[#293241]'
                    }`}
                  >
                    {dropdown.name}

                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      expanded
                        ? 'grid-rows-[1fr] opacity-100 pb-3'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-3 pl-4 border-l-2 border-[#00897B] space-y-1">
                        {dropdown.items.map(item => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            className={`block py-3 px-3 text-sm font-semibold transition-colors ${
                              isActive(item.href)
                                ? 'text-[#C62828] bg-[#C62828]/5'
                                : 'text-[#293241] hover:text-[#C62828]'
                            }`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* MOBILE REMAINING LINKS */}
            {navLinks.slice(1).map(link => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className={`block py-4 border-b border-[#0A0A0A]/10 font-bold text-base transition-colors ${
                  isActive(link.href)
                    ? 'text-[#C62828]'
                    : 'text-[#293241]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* MOBILE DONATE BUTTON */}
            <div className="pt-7">
              <Link
                href="/donate"
                onClick={closeMenu}
                className="w-full bg-[#C62828] text-white font-bold text-center py-4 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
              >
                <Heart className="w-5 h-5 fill-current" />
                Donate Now
              </Link>
            </div>

            <p className="text-center text-xs text-[#293241]/50 mt-8">
              Women-led. Be the change you want to see.
            </p>

          </div>
        </div>

      </header>

      {/* GOOGLE TRANSLATE STYLING */}
      <style jsx global>{`
        .gtranslate_wrapper {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-width: 0 !important;
          flex-shrink: 0 !important;
          z-index: 80 !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        .gtranslate_wrapper select {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
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
