import Link from 'next/link';
import { ArrowUpRight, Users, Handshake, Heart, Building2, ShoppingBag } from 'lucide-react';

export default function GetInvolvedPage() {
  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-[#C62828] font-bold text-sm tracking-widest uppercase">Join Our Mission</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] mt-2">
          Get Involved with ELI7
        </h1>
        <p className="text-lg text-[#0A0A0A]/80 mt-4 max-w-2xl mx-auto">
          Whether you want to give your time, connect us with funding opportunities, shop our merchandise, or provide direct financial backing, your contribution moves our community forward.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Volunteer Card */}
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-[#C62828] text-white border-2 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[3px_3px_0px_#0A0A0A]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] mb-3">Volunteer</h3>
            <p className="text-sm text-[#0A0A0A]/80 leading-relaxed mb-6">
              Lend your skills, time, and passion on the ground during community health drives and educational workshops.
            </p>
          </div>
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-2 font-bold text-sm bg-[#C62828] text-white px-4 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] justify-center hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Become a Volunteer <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Partner With Us Card */}
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-[#00897B] text-white border-2 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[3px_3px_0px_#0A0A0A]">
              <Handshake className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] mb-3">Partner With Us</h3>
            <p className="text-sm text-[#0A0A0A]/80 leading-relaxed mb-6">
              Collaborate with us as an organization, corporate body, or institution to scale our impact frameworks.
            </p>
          </div>
          <Link
            href="/partner"
            className="inline-flex items-center gap-2 font-bold text-sm bg-[#293241] text-white px-4 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] justify-center hover:bg-[#C62828] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Explore Partnerships <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Refer for Grants / Funders Card */}
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-[#D97706] text-white border-2 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[3px_3px_0px_#0A0A0A]">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] mb-3">Refer Funders</h3>
            <p className="text-sm text-[#0A0A0A]/80 leading-relaxed mb-6">
              Connect us with grant-making foundations or organizations offering financial backing and project grants.
            </p>
          </div>
          <Link
            href="/contact?subject=Grant%20Referral"
            className="inline-flex items-center gap-2 font-bold text-sm bg-[#D97706] text-white px-4 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] justify-center hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Submit a Referral <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Store / Merchandise Card */}
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-[#293241] text-white border-2 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[3px_3px_0px_#0A0A0A]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] mb-3">Shop Store</h3>
            <p className="text-sm text-[#0A0A0A]/80 leading-relaxed mb-6">
              Wear your values. Buy our fashion sweatshirts, t-shirts, and caps—100% of proceeds fund our projects.
            </p>
          </div>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 font-bold text-sm bg-[#293241] text-white px-4 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] justify-center hover:bg-[#C62828] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Visit the Store <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Donate Card */}
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div>
            <div className="w-12 h-12 bg-[#C62828] text-white border-2 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[3px_3px_0px_#0A0A0A]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] mb-3">Donate</h3>
            <p className="text-sm text-[#0A0A0A]/80 leading-relaxed mb-6">
              Fund sanitary kits, educational resources, and direct community interventions across Bauchi State.
            </p>
          </div>
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 font-bold text-sm bg-[#C62828] text-white px-4 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] justify-center hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Support Financially <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}