'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  Users, 
  Handshake, 
  Heart, 
  Building2, 
  ShoppingBag, 
  Share2, 
  Copy, 
  Check, 
  X, 
  Globe 
} from 'lucide-react';

export default function GetInvolvedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const samplePosts = [
    {
      platform: 'Twitter / X',
      badgeColor: 'bg-[#0284C7]/10 text-[#0284C7] border-[#0284C7]',
      // Twitter / X Icon
      icon: (
        <svg className="w-4 h-4 fill-current text-[#0284C7]" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      text: `Empowering communities and creating real change! Check out the incredible work @ELI7 is doing across education, health, and development. Join the movement and support our projects today at www.eli7.org! 💙✨ #ELI7 #ELI7LOVAS`,
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        'Empowering communities and creating real change! Check out the incredible work ELI7 is doing across education, health, and development. Join the movement and support our projects today at www.eli7.org! 💙✨ #ELI7 #ELI7LOVAS'
      )}`,
    },
    {
      platform: 'TikTok',
      badgeColor: 'bg-[#000000]/10 text-[#000000] border-[#000000]',
      // TikTok Icon
      icon: (
        <svg className="w-4 h-4 fill-current text-[#000000]" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      text: `Behind the scenes of grassroots change! 🎥✨ See how ELI7 is transforming lives through community health and education. Support our mission or get involved at www.eli7.org! 🚀 #ELI7LOVAS #ELI7`,
      shareUrl: 'https://www.tiktok.com',
    },
    {
      platform: 'Instagram / Facebook',
      badgeColor: 'bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]',
      // Instagram Icon
      icon: (
        <svg className="w-4 h-4 fill-current text-[#E4405F]" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      text: `Every action counts. ELI7 is making a tangible difference in grassroots communities by delivering essential health kits, educational tools, and resources where they are needed most. Support our work and be part of the change at www.eli7.org! 🚀🔥\n\n#ELI7 #ELI7LOVAS`,
      shareUrl: 'https://www.instagram.com',
    },
    {
      platform: 'LinkedIn',
      badgeColor: 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]',
      // LinkedIn Icon
      icon: (
        <svg className="w-4 h-4 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      text: `I am proud to support ELI7 in their mission to empower underserved communities through direct intervention, education, and healthcare initiatives. Partner with us or back our cause by visiting www.eli7.org! #ELI7 #ELI7LOVAS`,
      shareUrl: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
        'I am proud to support ELI7 in their mission to empower underserved communities through direct intervention, education, and healthcare initiatives. Partner with us or back our cause by visiting www.eli7.org! #ELI7 #ELI7LOVAS'
      )}`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSmartPost = (text: string, url: string | null, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-[#C62828] font-bold text-sm tracking-widest uppercase">Join Our Mission</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] mt-2">
          Get Involved with ELI7
        </h1>
        <p className="text-lg text-[#0A0A0A]/80 mt-4 max-w-2xl mx-auto">
          Whether you want to give your time, connect us with funding opportunities, shop our merchandise, or amplify our voice on social media, your contribution moves our community forward.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* 1. Volunteer Card (Red) */}
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

        {/* 2. Partner With Us Card (Green) */}
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
            className="inline-flex items-center gap-2 font-bold text-sm bg-[#00897B] text-white px-4 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] justify-center hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Explore Partnerships <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3. Refer Funders Card (Amber / Funder Gold) */}
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

        {/* 4. Shop Store Card (Sky Blue) */}
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-[#0284C7] text-white border-2 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[3px_3px_0px_#0A0A0A]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] mb-3">Shop Store</h3>
            <p className="text-sm text-[#0A0A0A]/80 leading-relaxed mb-6">
              Wear your values. Buy our fashion sweatshirts, t-shirts, and caps—100% of proceeds fund our projects.
            </p>
          </div>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 font-bold text-sm bg-[#0284C7] text-white px-4 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] justify-center hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Visit the Store <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5. Donate Card (Dark Navy Blue) */}
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-[#293241] text-white border-2 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[3px_3px_0px_#0A0A0A]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] mb-3">Donate</h3>
            <p className="text-sm text-[#0A0A0A]/80 leading-relaxed mb-6">
              Fund sanitary kits, educational resources, and direct community interventions across Bauchi State.
            </p>
          </div>
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 font-bold text-sm bg-[#293241] text-white px-4 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] justify-center hover:bg-[#C62828] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Support Financially <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6. Spread the Word Card (Warm Cream / Purple Accent) */}
        <div className="bg-[#FAF7F2] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-[#7C3AED] text-white border-2 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[3px_3px_0px_#0A0A0A]">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#293241] font-['Bricolage_Grotesque'] mb-3">Spread the Word</h3>
            <p className="text-sm text-[#0A0A0A]/80 leading-relaxed mb-6">
              Amplify our work online! Post about us using <span className="font-bold text-[#293241]">#ELI7</span> or <span className="font-bold text-[#293241]">#ELI7LOVAS</span> to advocate for our mission.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full inline-flex items-center gap-2 font-bold text-sm bg-[#7C3AED] text-white px-4 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] justify-center hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Get Pre-written Posts <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Social Advocacy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto relative">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#0A0A0A] mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                  Share & Advocate
                </h3>
                <p className="text-xs text-[#0A0A0A]/70 mt-1">
                  Choose a post below. Clicking "Post Now" automatically copies the text and opens the platform!
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 border-2 border-[#0A0A0A] bg-[#FFFFFE] hover:bg-[#C62828] hover:text-white shadow-[2px_2px_0px_#0A0A0A] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="space-y-6">
              {samplePosts.map((post, idx) => (
                <div key={idx} className="border-2 border-[#0A0A0A] p-4 bg-[#F8F9FA] shadow-[4px_4px_0px_#0A0A0A]">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold border-2 ${post.badgeColor} shadow-[2px_2px_0px_#0A0A0A]`}>
                      {post.icon}
                      {post.platform}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(post.text, idx)}
                        className="inline-flex items-center gap-1 text-xs font-bold bg-[#FFFFFE] text-[#0A0A0A] px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#293241] hover:text-white transition-all"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Text
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSmartPost(post.text, post.shareUrl, idx)}
                        className="inline-flex items-center gap-1 text-xs font-bold bg-[#293241] text-white px-3 py-1.5 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#C62828] transition-all"
                      >
                        Post Now <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-[#0A0A0A]/90 bg-white p-3 border border-[#0A0A0A]/20 rounded-none whitespace-pre-line font-mono">
                    {post.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t-2 border-[#0A0A0A] text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="font-bold text-xs bg-[#0A0A0A] text-white px-5 py-2 border-2 border-[#0A0A0A] hover:bg-[#C62828] transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}