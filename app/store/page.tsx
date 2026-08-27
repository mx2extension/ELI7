'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { StoreProduct } from '@/types';
import StoreFront from '../../components/store/StoreFront';
import Image from 'next/image';
import { X } from 'lucide-react';

// 1. Sliding Marquee Component for database clothing items
function SlidingMarquee({ products }: { products: StoreProduct[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full overflow-hidden relative py-4">
      <div className="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <div className="flex gap-6 w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
        {[...products, ...products].map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            className="w-48 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden flex-shrink-0 text-left"
          >
            <div className="aspect-square bg-gray-100 relative overflow-hidden border-b-2 border-black">
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm truncate text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-600 font-semibold mt-1">₦{item.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// 2. Typewriter Effect Component for the Scripture Quote (Inside Modal)
function TypewriterQuote() {
  const fullText = "“And why take ye thought for raiment? Consider the lilies of the field, how they grow; they toil not, neither do they spin: And yet I say unto you, That even Solomon in all his glory was not arrayed like one of these.”";
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const speed = 25; // Speed of typing
    
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.substring(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <blockquote className="italic text-lg md:text-xl text-gray-800 leading-relaxed font-serif text-center min-h-[120px] flex items-center justify-center px-4">
      <span>{displayedText}</span>
      {!isComplete && (
        <span className="inline-block w-2 h-5 bg-[#008066] ml-1 animate-pulse" />
      )}
    </blockquote>
  );
}

export default function StorePageContainer() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAbout, setViewAbout] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('store_products')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
      } else if (data) {
        setProducts(data);
      }
      setLoading(false);
    }

    fetchProducts();

    const checkView = () => {
      const searchParams = new URLSearchParams(window.location.search);
      setViewAbout(searchParams.get('view') === 'about');
    };

    checkView();
    window.addEventListener('popstate', checkView);
    return () => window.removeEventListener('popstate', checkView);
  }, []);

  const toggleView = (isAbout: boolean, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setViewAbout(isAbout);
    const newUrl = isAbout ? '/store?view=about' : '/store';
    window.history.pushState({}, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewAbout) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">About Our Store & Partnership</h1>
          <button 
            onClick={(e) => toggleView(false, e)}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition cursor-pointer"
          >
            View Store
          </button>
        </div>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Welcome to our store! Every piece of merchandise you purchase is more than just an item—it is a direct form of support. In proud partnership with <strong>Arrayed Like None</strong>, we ensure that every supporter receives something truly authentic and unique.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-6">Unmatched Authenticity: Serialized QR Codes</h2>
          <p>
            We know how important trust is. That is why we are introducing a strict limitation on our drops. For example, if we release a special sweatshirt, we will only produce a limited run (e.g., exactly 300 pieces). 
          </p>
          <p>
            Each item is assigned a unique serial number (from 001 to 300) embedded within a special QR code safely attached to the apparel. This guarantees that your item cannot be faked or replicated by anyone.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-6">Interactive Goodwill Messages</h2>
          <p>
            When scanned with a smartphone, the unique QR code takes you directly to our official website. There, it will display a personalized message of goodwill, acknowledge your support, and celebrate your connection to this cause.
          </p>

          <div className="pt-6 border-t border-gray-200 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">In partnership with:</span>
            <div className="flex items-center gap-2">
              <Image 
                src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787826175/ChatGPT_Image_Aug_27_2026_11_10_03_AM_txadns.png" 
                alt="Arrayed Like None Logo" 
                width={120} 
                height={40} 
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 overflow-hidden relative">
      {/* 1. Single Green Banner Section at the very top */}
      <div className="bg-[#008066] text-white p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border border-black flex flex-col items-center text-center space-y-4">
        <span className="text-3xl">❤️</span>
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          100% Proceeds to Community Outreach
        </h2>
        <p className="max-w-2xl text-sm md:text-base text-gray-100 leading-relaxed">
          This is a support store, not a commercial enterprise. Every purchase you make directly funds our community outreaches, menstrual hygiene kits, and social initiatives, keeping our projects self-sustaining.
        </p>
      </div>

      {/* 2. Hero Section featuring Bouncing & Sun-shining Logo Trigger & Sliding Marquee */}
      <div className="text-center max-w-4xl mx-auto space-y-8 pt-4">
        
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 flex flex-col items-center justify-center gap-4">
            <span>Support the Cause with</span>
            
            {/* Bouncing & Sun-shining Logo Container */}
            <div 
              onClick={() => setShowQuoteModal(true)}
              className="p-3 cursor-pointer inline-block animate-bounce relative rounded-2xl hover:scale-105 transition-transform"
              style={{ animation: 'bounce 1s infinite, sunShine 2.5s infinite alternate' }}
              title="Click to view scripture"
            >
              <Image 
                src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787826175/ChatGPT_Image_Aug_27_2026_11_10_03_AM_txadns.png" 
                alt="Arrayed Like None Logo" 
                width={180} 
                height={60} 
                className="object-contain inline-block drop-shadow-md relative z-10"
              />
            </div>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Every purchase comes with a limited-edition, verifiable serialized QR code loaded with a personal message of gratitude.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={(e) => toggleView(true, e)}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              Learn About Our Store
            </button>
          </div>
        </div>

        {/* 3. Automatic Sliding Clothing Marquee connected to database */}
        {!loading && <SlidingMarquee products={products} />}
      </div>

      {/* 4. Product Grid / Categories Section */}
      <div id="products-section" className="pt-4">
        <StoreFront products={products} />
      </div>

      {/* 5. Scripture Quote Pop-up Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl max-w-lg w-full p-6 md:p-8 relative space-y-6 text-center">
            <button 
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer border border-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center">
              <Image 
                src="https://res.cloudinary.com/drnrbfltr/image/upload/v1787826175/ChatGPT_Image_Aug_27_2026_11_10_03_AM_txadns.png" 
                alt="Arrayed Like None Logo" 
                width={120} 
                height={40} 
                className="object-contain"
              />
            </div>

            <TypewriterQuote />

            <button
              onClick={() => setShowQuoteModal(false)}
              className="bg-black text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Global CSS for the sun-like radiant shine animation */}
      <style jsx global>{`
        @keyframes sunShine {
          0% {
            filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 18px rgba(255, 204, 0, 0.9)) drop-shadow(0 0 35px rgba(255, 240, 100, 0.6));
          }
          100% {
            filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.4));
          }
        }
      `}</style>
    </div>
  );
}