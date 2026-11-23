
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  FolderKanban,
  BarChart3,
  ImageIcon,
  Heart,
  Mail,
  MailOpen,
  Layers,
  Settings,
  LogOut,
  ShoppingBag,
  LockKeyhole,
  Menu,
  X,
  Users,
  ChevronRight,
  Home,
  BookOpen,
} from 'lucide-react';

const ADMIN_PASSWORD = '728991123';
const SESSION_KEY = 'eli7_admin_unlocked';

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'News', href: '/admin/news', icon: Newspaper },
  { name: 'Programs', href: '/admin/programs', icon: Layers },
  { name: 'Impact', href: '/admin/impact', icon: Heart },
  { name: 'Statistics', href: '/admin/stats', icon: BarChart3 },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Stories', href: '/admin/stories', icon: BookOpen },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Donations', href: '/admin/donations', icon: Heart },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
  { name: 'Messages', href: '/admin/messages', icon: Mail },
  { name: 'Footer Messages', href: '/admin/footer-messages', icon: MailOpen },
  { name: 'Volunteers', href: '/admin/volunteers', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unlocked = sessionStorage.getItem(SESSION_KEY);
    setIsUnlocked(unlocked === 'true');
    setIsChecking(false);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsUnlocked(true);
      setError('');
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsUnlocked(false);
    setMobileMenuOpen(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 mt-3">Loading admin...</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-5">
            <LockKeyhole className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900">
            Admin Access
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 mb-6">
            Enter your password to access the ELi Foundation dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              autoComplete="current-password"
              required
            />

            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800 transition"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* DESKTOP SIDEBAR - PRESERVED SEPARATELY */}
      <aside className="hidden md:flex md:w-64 lg:w-64 bg-white border-r border-gray-200 flex-col min-h-screen sticky top-0 h-screen">
        <div className="px-6 py-7 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">
            ELi Foundation
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Admin Dashboard
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            <Home size={18} />
            Return to Live Site
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 w-full overflow-x-hidden">

        {/* MOBILE TOP BAR */}
        <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 h-12 px-3 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              ELi Foundation
            </p>
            <p className="text-[10px] text-gray-500 leading-tight">
              Admin Dashboard
            </p>
          </div>

          <Link
            href="/"
            aria-label="Return to live site"
            className="text-gray-500 p-2 rounded-lg hover:bg-gray-100"
          >
            <Home size={17} />
          </Link>
        </header>

        {/* PAGE CONTENT */}
        <div className="w-full min-w-0 p-3 sm:p-4 md:p-6 lg:p-10">
          {children}
        </div>
      </main>

      {/* MOBILE FLOATING HAMBURGER */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open admin navigation"
        aria-expanded={mobileMenuOpen}
        className="md:hidden fixed bottom-5 right-4 z-40 w-12 h-12 rounded-full bg-gray-900 text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
      >
        <Menu size={21} />
      </button>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">

          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* MOBILE DRAWER */}
          <div className="absolute right-0 top-0 bottom-0 w-[82%] max-w-[320px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">

            {/* DRAWER HEADER */}
            <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  ELi Foundation
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Admin Navigation
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                <X size={17} />
              </button>
            </div>

            {/* NAVIGATION LINKS */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-[13px] transition ${
                      isActive
                        ? 'bg-gray-900 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon size={17} className="shrink-0" />
                      <span>{item.name}</span>
                    </span>

                    <ChevronRight
                      size={15}
                      className={isActive ? 'text-white/70' : 'text-gray-400'}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* DRAWER FOOTER */}
            <div className="border-t border-gray-100 p-3 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-gray-600 hover:bg-gray-100"
              >
                <Home size={17} />
                Return to Live Site
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-red-600 hover:bg-red-50"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
