'use client';
import React, { useState } from 'react';
import { StoreProduct, OrderPayload } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { X, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  product: StoreProduct;
  onClose: () => void;
}

export default function CheckoutModal({ product, onClose }: Props) {
  // Safely fallback to 'Standard' if the product has no sizes or colors defined
  const [size, setSize] = useState(product.sizes?.[0] || 'Standard');
  const [color, setColor] = useState(product.colors?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    delivery_address: ''
  });

  const totalPrice = product.price * quantity;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: OrderPayload = {
      product_id: product.id,
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      email: formData.email || null,
      delivery_address: formData.delivery_address,
      size,
      color,
      quantity,
      total_price: totalPrice
    };

    const { error } = await supabase.from('store_orders').insert([payload]);

    if (error) {
      console.error('Error saving order:', error);
      alert('Failed to place order. Please try again.');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[12px_12px_0px_#0A0A0A] w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-[#00897B] text-white flex items-center justify-center border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">Order Booked!</h3>
            <p className="text-[#0A0A0A]/80 font-medium">Thank you for supporting our mission. Our team will contact you shortly via phone to confirm delivery and payment details.</p>
            <button 
              onClick={onClose}
              className="mt-4 bg-[#293241] text-white font-bold uppercase px-6 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b-2 border-[#0A0A0A] bg-[#F4F1EA]">
              <h3 className="text-xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">Book Order</h3>
              <button onClick={onClose} className="p-1 hover:bg-[#0A0A0A]/10 border-2 border-[#0A0A0A]">
                <X className="w-5 h-5 text-[#0A0A0A]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Product Summary */}
              <div className="flex gap-4 items-center border-b-2 border-[#0A0A0A]/10 pb-4">
                <img src={product.image_url} alt={product.title} className="w-20 h-20 object-cover border-2 border-[#0A0A0A]" />
                <div>
                  <p className="font-bold text-[#293241]">{product.title}</p>
                  <p className="text-sm text-[#0A0A0A]/60">₦{product.price.toLocaleString()} per item</p>
                </div>
              </div>

              {/* Variants */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#293241] mb-2">Size</label>
                  <select 
                    value={size} 
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-white border-2 border-[#0A0A0A] px-3 py-2 outline-none focus:shadow-[3px_3px_0px_#0A0A0A] transition-all"
                  >
                    {product.sizes && product.sizes.length > 0 ? (
                      product.sizes.map((s) => <option key={s} value={s}>{s}</option>)
                    ) : (
                      <option value="Standard">Standard</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#293241] mb-2">Color</label>
                  <select 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-white border-2 border-[#0A0A0A] px-3 py-2 outline-none focus:shadow-[3px_3px_0px_#0A0A0A] transition-all"
                  >
                    {product.colors && product.colors.length > 0 ? (
                      product.colors.map((c) => <option key={c} value={c}>{c}</option>)
                    ) : (
                      <option value="Standard">Standard</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#293241] mb-2">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border-2 border-[#0A0A0A] px-3 py-2 outline-none focus:shadow-[3px_3px_0px_#0A0A0A] transition-all"
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#293241] mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    name="full_name" 
                    required 
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-[#0A0A0A] px-3 py-2 outline-none focus:shadow-[3px_3px_0px_#0A0A0A] transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#293241] mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone_number" 
                      required 
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-[#0A0A0A] px-3 py-2 outline-none focus:shadow-[3px_3px_0px_#0A0A0A] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#293241] mb-2">Email (Optional)</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-[#0A0A0A] px-3 py-2 outline-none focus:shadow-[3px_3px_0px_#0A0A0A] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#293241] mb-2">Delivery Address *</label>
                  <textarea 
                    name="delivery_address" 
                    required 
                    rows={3}
                    value={formData.delivery_address}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-[#0A0A0A] px-3 py-2 outline-none focus:shadow-[3px_3px_0px_#0A0A0A] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Total & Submit */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-[#0A0A0A]">
                <div>
                  <p className="text-xs font-bold uppercase text-[#0A0A0A]/60">Total</p>
                  <p className="text-2xl font-extrabold text-[#293241]">₦{totalPrice.toLocaleString()}</p>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#C62828] text-white font-bold text-sm uppercase tracking-wider px-6 py-3 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#293241] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    'Confirm Order'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}