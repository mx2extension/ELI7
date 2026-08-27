'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ShieldCheck, RefreshCw, Search, CheckCircle, Clock, Trash2, DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Donation {
  id: string;
  donor_name: string;
  email: string;
  phone: string;
  amount: number;
  purpose: string;
  recurring_frequency: string;
  payment_status: string;
  created_at: string;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchDonations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDonations(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('donations')
      .update({ payment_status: newStatus })
      .eq('id', id);

    if (!error) {
      setDonations(donations.map(d => d.id === id ? { ...d, payment_status: newStatus } : d));
    }
  };

  const deleteDonation = async (id: string) => {
    if (confirm('Are you sure you want to delete this donation record?')) {
      const { error } = await supabase.from('donations').delete().eq('id', id);
      if (!error) {
        setDonations(donations.filter(d => d.id !== id));
      }
    }
  };

  const filteredDonations = donations.filter(d => {
    const matchesSearch = 
      d.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.phone && d.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || d.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRaised = donations
    .filter(d => d.payment_status === 'completed' || d.payment_status === 'success')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8 bg-[#F4F1EA]">
      
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FFFFFE] p-6 md:p-8 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A]">
        <div className="space-y-1">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#00897B] hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">
            Donations Management
          </h1>
        </div>

        <button 
          onClick={fetchDonations}
          className="bg-[#00897B] text-white font-bold px-5 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center gap-2 text-sm uppercase"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] p-6 space-y-2">
          <div className="text-xs font-bold uppercase text-[#0A0A0A]/60 flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-[#00897B]" /> Total Confirmed Revenue
          </div>
          <div className="text-3xl font-black font-['Bricolage_Grotesque'] text-[#293241]">
            ₦{totalRaised.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] p-6 space-y-2">
          <div className="text-xs font-bold uppercase text-[#0A0A0A]/60 flex items-center gap-1">
            <Clock className="w-4 h-4 text-amber-600" /> Total Submissions
          </div>
          <div className="text-3xl font-black font-['Bricolage_Grotesque'] text-[#293241]">
            {donations.length}
          </div>
        </div>

        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] p-6 space-y-2">
          <div className="text-xs font-bold uppercase text-[#0A0A0A]/60 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Database Status
          </div>
          <div className="text-sm font-bold text-emerald-700 bg-emerald-50 inline-block px-2 py-1 border border-emerald-300">
            Connected to Supabase
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] font-medium text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold uppercase">Status:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] font-bold text-sm w-full md:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="success">Success</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#293241] text-white border-b-2 border-[#0A0A0A] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Donor Details</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Purpose / Campaign</th>
                <th className="p-4 font-bold">Recurring</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#0A0A0A] font-medium text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 font-bold text-gray-500">Loading donations...</td>
                </tr>
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 font-bold text-gray-500">No donation records found.</td>
                </tr>
              ) : (
                filteredDonations.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F4F1EA]/50 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-[#293241]">{item.donor_name}</div>
                      <div className="text-xs text-gray-600">{item.email}</div>
                      <div className="text-xs text-gray-500">{item.phone || 'No phone provided'}</div>
                    </td>
                    <td className="p-4 font-black text-base text-[#C62828]">
                      ₦{Number(item.amount || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-xs font-bold uppercase text-[#00897B]">
                      {item.purpose}
                    </td>
                    <td className="p-4 text-xs">
                      <span className="bg-gray-100 border border-gray-300 px-2 py-1 font-bold">
                        {item.recurring_frequency}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-bold uppercase border border-[#0A0A0A] ${
                        item.payment_status === 'completed' || item.payment_status === 'success'
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-amber-200 text-amber-900'
                      }`}>
                        {item.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-600">
                      {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 text-center space-x-2">
                      {item.payment_status !== 'completed' && (
                        <button 
                          onClick={() => updateStatus(item.id, 'completed')}
                          title="Mark as Completed"
                          className="bg-emerald-600 text-white p-2 border border-[#0A0A0A] hover:bg-emerald-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteDonation(item.id)}
                        title="Delete Record"
                        className="bg-red-600 text-white p-2 border border-[#0A0A0A] hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}