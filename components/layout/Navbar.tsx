'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from 'lucide-react';

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

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const menu = menuRef.current;
    if (!menu) return;
    const focusable = menu.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeMenu(); toggleRef.current?.focus(); }
    };
    menu.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);
    return () => {
      menu.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeMenu]);

  useEffect(() => { closeMenu(); }, [pathname, closeMenu]);

  const isActive = (href: string) => pathname === href;

  return (
    <header className={`sticky top-0 z-50 bg-[#FFFFFE] border-b-2 border-[#0A0A0A] transition-shadow ${isScrolled ? 'shadow-[0_4px_0px_0px_#0A0A0A]' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787218188/logo_os2s3d.png"
              alt="Extend Love Initiative Logo"
              width={48}
              height={48}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-2xl text-[#293241] tracking-tight">ELI7</span>
            <span className="bg-[#00897B] text-white font-extrabold text-xs uppercase px-2 py-1 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">FOUNDATION</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`font-bold text-sm transition-colors relative ${isActive(link.href) ? 'text-[#C62828]' : 'text-[#0A0A0A] hover:text-[#C62828]'}`}
            >
              {link.name}
              {isActive(link.href) && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C62828]" />}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/donate"
            className="bg-[#C62828] text-white font-bold text-sm px-5 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#0A0A0A] transition-all flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-current" />
            Donate
          </Link>
        </div>

        <button
          ref={toggleRef}
          onClick={() => setIsOpen((prev) => !prev)}
          className="lg:hidden p-2 bg-[#00897B] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-label="Mobile navigation"
        className={`lg:hidden bg-[#FFFFFE] border-b-2 border-[#0A0A0A] overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 border-b-0'}`}
      >
        <div className="px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`block font-bold text-base transition-colors ${isActive(link.href) ? 'text-[#C62828]' : 'text-[#0A0A0A] hover:text-[#C62828]'}`}
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
  );
}