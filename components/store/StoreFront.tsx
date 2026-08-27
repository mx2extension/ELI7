'use client';
import React, { useState, useMemo } from 'react';
import { StoreProduct, OrderPayload } from '@/types';
import { ShoppingBag, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import CheckoutModal from './CheckoutModal';

const categories = [
  { key: 'all', label: 'All Items' },
  { key: 't-shirts', label: 'T-Shirts' },
  { key: 'sweatshirts', label: 'Sweatshirts' },
  { key: 'face-caps', label: 'Face Caps' },
];

export default function StoreFront({ products }: { products: StoreProduct[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      
      {/* 1. FILTER SYSTEM */}
      <div className="flex flex-wrap gap-3 mb-10 border-b-2 border-[#0A0A0A] pb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider border-2 border-[#0A0A0A] transition-all shadow-[3px_3px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              activeCategory === cat.key
                ? 'bg-[#293241] text-white'
                : 'bg-[#FFFFFE] text-[#293241] hover:bg-[#F4F1EA]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 2. PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            {/* 1:1 Image Placeholder */}
            <div className="aspect-square border-b-2 border-[#0A0A0A] bg-[#F4F1EA] overflow-hidden relative">
              <img 
                src={product.image_url} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-[#C62828] text-white font-bold text-[10px] uppercase tracking-wider px-2 py-1 border border-[#0A0A0A]">
                {product.category}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-grow justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] leading-tight">
                  {product.title}
                </h3>
                <p className="text-[#0A0A0A]/60 text-sm mt-1 line-clamp-2">{product.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-extrabold text-[#293241]">
                  ₦{product.price.toLocaleString()}
                </span>
                <button 
                  onClick={() => setSelectedProduct(product)}
                  className="inline-flex items-center gap-2 bg-[#293241] text-white font-bold text-xs uppercase px-4 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#00897B] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Book Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. CHECKOUT MODAL */}
      {selectedProduct && (
        <CheckoutModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}