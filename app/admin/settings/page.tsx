'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Save, ArrowLeft, Building2, Mail } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emailContact, setEmailContact] = useState('');
  
  // Bank fields state
  const [ngnBankName, setNgnBankName] = useState('');
  const [ngnAccount, setNgnAccount] = useState('');
  const [usdBankName, setUsdBankName] = useState('');
  const [usdAccount, setUsdAccount] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    const { data, error } = await supabase.from('settings').select('*');
    if (error) {
      console.error('Error fetching settings:', error);
    } else if (data) {
      const map: any = {};
      data.forEach((item) => {
        map[item.key] = item.value;
      });
      setNgnBankName(map['ngn_bank_name'] || 'First Bank');
      setNgnAccount(map['ngn_account'] || '5072049395');
      setUsdBankName(map['usd_bank_name'] || 'Zenith Bank');
      setUsdAccount(map['usd_account'] || '2046092805');
      setEmailContact(map['support_email'] || 'debiekaunafoundation@gmail.com');
    }
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);

    const updates = [
      { key: 'ngn_bank_name', value: ngnBankName },
      { key: 'ngn_account', value: ngnAccount },
      { key: 'usd_bank_name', value: usdBankName },
      { key: 'usd_account', value: usdAccount },
      { key: 'support_email', value: emailContact },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('settings')
        .update({ value: update.value, updated_at: new Date() })
        .eq('key', update.key);

      if (error) {
        alert('Failed to update ' + update.key);
        return;
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return <div className="p-8 text-sm font-bold">Loading settings...</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-4xl mx-auto space-y-8 bg-[#F4F1EA]">
      <div className="bg-[#FFFFFE] p-6 md:p-8 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] space-y-2">
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#C62828] hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">
          System Settings
        </h1>
        <p className="text-sm font-medium text-gray-600">
          Manage foundation banking parameters, bank names, and support contact references dynamically.
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-200 border-2 border-[#0A0A0A] p-4 font-bold text-emerald-900 shadow-[4px_4px_0px_#0A0A0A]">
          Settings updated successfully in database!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] p-8 space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold font-['Bricolage_Grotesque'] text-[#293241] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C62828]" /> Bank Transfer Account Configurations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Naira Account Config */}
            <div className="space-y-3 bg-[#F4F1EA] p-4 border-2 border-[#0A0A0A]">
              <h4 className="text-xs font-bold uppercase text-gray-700">Naira Account (NGN)</h4>
              <div>
                <label className="block text-xs font-semibold mb-1">Bank Name</label>
                <input 
                  type="text" 
                  value={ngnBankName}
                  onChange={(e) => setNgnBankName(e.target.value)}
                  className="w-full p-3 border-2 border-[#0A0A0A] bg-white text-sm font-medium focus:outline-none focus:border-[#C62828]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Account Number</label>
                <input 
                  type="text" 
                  value={ngnAccount}
                  onChange={(e) => setNgnAccount(e.target.value)}
                  className="w-full p-3 border-2 border-[#0A0A0A] bg-white text-sm font-medium focus:outline-none focus:border-[#C62828]"
                  required
                />
              </div>
            </div>

            {/* Dollar Account Config */}
            <div className="space-y-3 bg-[#F4F1EA] p-4 border-2 border-[#0A0A0A]">
              <h4 className="text-xs font-bold uppercase text-gray-700">Dollar Account (USD)</h4>
              <div>
                <label className="block text-xs font-semibold mb-1">Bank Name</label>
                <input 
                  type="text" 
                  value={usdBankName}
                  onChange={(e) => setUsdBankName(e.target.value)}
                  className="w-full p-3 border-2 border-[#0A0A0A] bg-white text-sm font-medium focus:outline-none focus:border-[#C62828]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Account Number</label>
                <input 
                  type="text" 
                  value={usdAccount}
                  onChange={(e) => setUsdAccount(e.target.value)}
                  className="w-full p-3 border-2 border-[#0A0A0A] bg-white text-sm font-medium focus:outline-none focus:border-[#C62828]"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-[#0A0A0A]" />

        <div className="space-y-4">
          <h3 className="text-xl font-bold font-['Bricolage_Grotesque'] text-[#293241] flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#C62828]" /> Notifications & Support Email
          </h3>
          <div>
            <label className="block font-bold text-sm text-[#293241] mb-2">Slip Verification Email</label>
            <input 
              type="email" 
              value={emailContact}
              onChange={(e) => setEmailContact(e.target.value)}
              className="w-full p-4 border-2 border-[#0A0A0A] bg-[#F4F1EA] font-medium focus:outline-none focus:border-[#C62828]"
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="bg-[#C62828] text-white font-bold py-4 px-8 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center gap-2 uppercase text-sm"
          >
            <Save className="w-4 h-4" /> Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
}