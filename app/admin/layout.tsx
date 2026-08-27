import Link from 'next/link';
import { 
  LayoutDashboard, 
  Newspaper, 
  FolderKanban, 
  BarChart3, 
  Image as ImageIcon, 
  Heart, 
  Mail, 
  MailOpen, // Added MailOpen to differentiate the icons
  Layers, 
  Settings, 
  LogOut,
  ShoppingBag,
  Tag
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[#293241] text-[#FFFFFE] border-r-2 border-[#0A0A0A] p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <span className="bg-[#C62828] text-white text-[10px] font-bold uppercase px-2 py-1 border border-white/20">
              Control Panel
            </span>
            <h2 className="text-2xl font-bold font-['Bricolage_Grotesque'] mt-2">
              ELI7 Admin
            </h2>
          </div>

          <nav className="space-y-1.5">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-[#C62828]" /> Overview
            </Link>
            <Link
              href="/admin/news"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <Newspaper className="w-4 h-4 text-[#C62828]" /> News & Stories
            </Link>
            <Link
              href="/admin/programs"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <FolderKanban className="w-4 h-4 text-[#C62828]" /> Programs
            </Link>
            <Link
              href="/admin/impact"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <Layers className="w-4 h-4 text-[#C62828]" /> Impact & Useful
            </Link>
            <Link
              href="/admin/stats"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <BarChart3 className="w-4 h-4 text-[#C62828]" /> Impact Stats
            </Link>
            <Link
              href="/admin/projects"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <Layers className="w-4 h-4 text-[#C62828]" /> Projects
            </Link>
            <Link
              href="/admin/gallery"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <ImageIcon className="w-4 h-4 text-[#C62828]" /> Gallery
            </Link>
            <Link
              href="/admin/donations"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <Heart className="w-4 h-4 text-[#C62828]" /> Donations
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-[#C62828]" /> Store
            </Link>
            
            {/* Original Messages Link */}
            <Link
              href="/admin/messages"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <Mail className="w-4 h-4 text-[#C62828]" /> Messages / Inbox
            </Link>

            {/* NEW: Footer Messages Link */}
            <Link
              href="/admin/footer-messages"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <MailOpen className="w-4 h-4 text-[#C62828]" /> Footer Messages
            </Link>
            
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2.5 font-bold text-sm bg-[#FFFFFE]/10 border-2 border-transparent hover:border-[#C62828] transition-all"
            >
              <Settings className="w-4 h-4 text-[#C62828]" /> System Settings
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-white/70 hover:text-[#C62828]"
          >
            <LogOut className="w-4 h-4" /> Return to Live Site
          </Link>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}