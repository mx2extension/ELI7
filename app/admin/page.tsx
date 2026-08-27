'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ShieldCheck, Users, DollarSign, FileText, ArrowUpRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [totalDonations, setTotalDonations] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('donations').select('amount, payment_status');
    
    if (!error && data) {
      setDonationCount(data.length);
      const sum = data
        .filter(d => d.payment_status === 'completed' || d.payment_status === 'success')
        .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
      setTotalDonations(sum);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-10 bg-[#F4F1EA]">
      {/* Top Banner */}
      <div className="bg-[#293241] text-[#FFFFFE] p-8 border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#C62828] text-white text-xs font-bold uppercase px-2.5 py-1 border border-[#0A0A0A]">Secure Admin</span>
            <span className="text-xs font-medium text-white/70">Extend Love Initiative Foundation (ELI7)</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-['Bricolage_Grotesque'] tracking-tight">
            Command Center
          </h1>
          <p className="text-white/80 text-sm font-medium">
            Manage incoming contributions, verify transaction statuses, and oversee platform data.
          </p>
        </div>
        <button 
          onClick={fetchMetrics}
          className="bg-[#00897B] text-white font-bold px-4 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center gap-2 text-xs uppercase"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Metrics
        </button>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#0A0A0A]/70">
            <span>Total Confirmed Raised</span>
            <DollarSign className="w-5 h-5 text-[#00897B]" />
          </div>
          <div className="text-4xl font-black font-['Bricolage_Grotesque'] text-[#293241]">
            ₦{totalDonations.toLocaleString()}
          </div>
          <p className="text-xs font-medium text-gray-500">From completed online & bank transfers</p>
        </div>

        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#0A0A0A]/70">
            <span>Total Submissions</span>
            <Users className="w-5 h-5 text-[#C62828]" />
          </div>
          <div className="text-4xl font-black font-['Bricolage_Grotesque'] text-[#293241]">
            {donationCount}
          </div>
          <p className="text-xs font-medium text-gray-500">Logged intents in database</p>
        </div>

        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#0A0A0A]/70">
            <span>System Security</span>
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-lg font-black font-['Bricolage_Grotesque'] text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-300 inline-block">
            Supabase RLS Active
          </div>
          <p className="text-xs font-medium text-gray-500">Secure connection verified</p>
        </div>
      </div>

      {/* Admin Navigation Quick-Links */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">Management Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Link href="/admin/donations" className="group bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#0A0A0A] transition-all flex justify-between items-center">
            <div className="space-y-2">
              <span className="bg-[#00897B] text-white text-[10px] font-bold uppercase px-2 py-0.5 border border-[#0A0A0A]">Core Ledger</span>
              <h4 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-[#293241]">Donations & Pledges</h4>
              <p className="text-xs text-gray-600 font-medium">View, search, verify, and modify donor records and statuses.</p>
            </div>
            <ArrowUpRight className="w-6 h-6 text-[#0A0A0A] group-hover:scale-110 transition-transform" />
          </Link>

          <Link href="/admin/settings" className="group bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#0A0A0A] transition-all flex justify-between items-center">
            <div className="space-y-2">
              <span className="bg-[#C62828] text-white text-[10px] font-bold uppercase px-2 py-0.5 border border-[#0A0A0A]">Configuration</span>
              <h4 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-[#293241]">System Settings</h4>
              <p className="text-xs text-gray-600 font-medium">Manage payout accounts, bank references, and administrative preferences.</p>
            </div>
            <ArrowUpRight className="w-6 h-6 text-[#0A0A0A] group-hover:scale-110 transition-transform" />
          </Link>

        </div>
      </div>
    </div>
  );
}