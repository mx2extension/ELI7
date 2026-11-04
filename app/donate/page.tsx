'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Heart, CreditCard, Building2, Copy, Check, Send, Sparkles } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: any) => void;
  }
}

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState<'online' | 'transfer'>('online');
  const [settings, setSettings] = useState({
    ngn_bank_name: 'PARALLEX BANK',
    ngn_account_name: 'CHINEMEREM PATRICK NWANKPA',
    ngn_account: '2000674970',
    usd_bank_name: 'PARALLEX BANK',
    usd_account_name: 'CHINEMEREM PATRICK NWANKPA',
    usd_account: '2000674970',
    support_email: 'debiekaunafoundation@gmail.com',
  });

  // Online Checkout Form State
  const [currency, setCurrency] = useState<'NGN' | 'USD' | 'GBP'>('NGN');
  const [amount, setAmount] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('General Foundation Support');
  const [isProcessing, setIsProcessing] = useState(false);

  // Bank Transfer Form State
  const [transferName, setTransferName] = useState('');
  const [transferEmail, setTransferEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferCurrency, setTransferCurrency] = useState('NGN');
  const [transferPurpose, setTransferPurpose] = useState('General Foundation Support');
  const [receiptSubmitted, setReceiptSubmitted] = useState(false);
  const [submittingReceipt, setSubmittingReceipt] = useState(false);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || '';
        if (name) {
          setFullName(name);
          setTransferName(name);
        }
        if (user.email) {
          setEmail(user.email);
          setTransferEmail(user.email);
        }
      }
    }
    loadUser();

    if (!document.getElementById('flutterwave-script')) {
      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.async = true;
      script.id = 'flutterwave-script';
      document.body.appendChild(script);
    }
  }, []);

  async function fetchSettings() {
    const { data, error } = await supabase.from('settings').select('*').limit(1).single();
    if (error) {
      console.error('Error fetching settings, using fallbacks:', error);
    } else if (data) {
      const fallbackName = data.account_name || 'CHINEMEREM PATRICK NWANKPA';
      const fallbackAccount = data.account_number || data.account || '2000674970';
      const fallbackBank = data.bank_name || 'PARALLEX BANK';

      setSettings({
        ngn_bank_name: data.ngn_bank_name || fallbackBank,
        ngn_account_name: data.ngn_account_name || fallbackName,
        ngn_account: data.ngn_account || fallbackAccount,
        usd_bank_name: data.usd_bank_name || fallbackBank,
        usd_account_name: data.usd_account_name || fallbackName,
        usd_account: data.usd_account || fallbackAccount,
        support_email: data.support_email || 'debiekaunafoundation@gmail.com',
      });
    }
  }

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  }

  async function handleOnlineDonate(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !fullName || !email) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!window.FlutterwaveCheckout) {
      alert('Payment gateway is still loading. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([
          {
            donor_name: fullName,
            email,
            phone,
            amount: parseFloat(amount),
            currency: currency,
            purpose,
            payment_status: 'pending',
          },
        ])
        .select('id')
        .single();

      if (error) throw error;
      const donationId = data?.id;

      window.FlutterwaveCheckout({
        public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
        tx_ref: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        amount: parseFloat(amount),
        currency: currency,
        payment_options: 'card, banktransfer, ussd',
        customer: { email, phonenumber: phone, name: fullName },
        customizations: {
          title: 'Debiekauna Foundation',
          description: purpose || 'Donation',
          logo: 'https://st2.depositphotos.com/4403296/7418/v/450/depositphotos_74189661-stock-illustration-photo-comes-here.jpg',
        },
        callback: async (response: any) => {
          if (response.status === 'successful') {
            if (donationId) {
              await supabase
                .from('donations')
                .update({ payment_status: 'paid', transaction_id: response.transaction_id })
                .eq('id', donationId);
            }
            const symbol = currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : '£';
            alert(`Payment Successful! Thank you for your donation of ${symbol}${Number(amount).toLocaleString()}.`);
            
            setAmount('');
            setPurpose('General Foundation Support');
          } else {
            alert('Payment was not completed. Please try again.');
          }
          setIsProcessing(false);
        },
        onclose: () => {
          setIsProcessing(false);
        }
      });
    } catch (err: any) {
      alert('Error recording donation: ' + err.message);
      setIsProcessing(false);
    }
  }

  async function handleTransferNotification(e: React.FormEvent) {
    e.preventDefault();
    if (!transferName || !transferEmail || !transferAmount) {
      alert('Please fill out all required notification fields.');
      return;
    }

    setSubmittingReceipt(true);
    try {
      const { error } = await supabase.from('donations').insert([
        {
          donor_name: transferName,
          email: transferEmail,
          amount: parseFloat(transferAmount),
          currency: transferCurrency,
          purpose: transferPurpose,
          payment_status: 'pending',
        },
      ]);

      if (error) throw error;
      setReceiptSubmitted(true);
      setTransferAmount('');
    } catch (err: any) {
      alert('Failed to submit transfer notification: ' + err.message);
    } finally {
      setSubmittingReceipt(false);
    }
  }

  const getSymbol = () => {
    if (currency === 'NGN') return '₦';
    if (currency === 'USD') return '$';
    return '£';
  };

  const getPresets = () => {
    if (currency === 'NGN') return ['10000', '50000', '250000', '500000', '1000000'];
    if (currency === 'USD') return ['50', '100', '250', '500', '1000'];
    return ['50', '100', '250', '500', '1000'];
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-12 px-4 md:px-8 text-[#0A0A0A]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-8 shadow-[6px_6px_0px_#0A0A0A] text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#C62828] text-white text-xs font-bold uppercase px-3 py-1 border border-[#0A0A0A]">
            <Heart className="w-3.5 h-3.5 fill-white" /> Support Our Mission
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">
            Invest in Sustainable Impact
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Your contributions directly fund community empowerment, education initiatives, and regional development programs. Choose your preferred way to give below.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('online')}
            className={`flex items-center justify-center gap-2 py-4 px-6 font-bold text-sm border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] transition-all ${
              activeTab === 'online' ? 'bg-[#293241] text-white translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-[#FFFFFE] text-[#293241] hover:bg-gray-50'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#C62828]" /> Online Checkout
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`flex items-center justify-center gap-2 py-4 px-6 font-bold text-sm border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] transition-all ${
              activeTab === 'transfer' ? 'bg-[#293241] text-white translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-[#FFFFFE] text-[#293241] hover:bg-gray-50'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#C62828]" /> Bank Transfer
          </button>
        </div>

        {activeTab === 'online' && (
          <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-6 md:p-10 shadow-[8px_8px_0px_#0A0A0A]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b-2 border-[#0A0A0A]">
              <h2 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-[#293241] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C62828]" /> Secure Instant Contribution
              </h2>
              
              <div className="flex items-center gap-1 bg-[#F4F1EA] p-1.5 border-2 border-[#0A0A0A] overflow-x-auto">
                <span className="text-[10px] font-bold uppercase px-1 text-gray-600">Currency:</span>
                {(['NGN', 'USD', 'GBP'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => { 
                      setCurrency(curr); 
                      setAmount(''); 
                    }}
                    className={`px-2.5 py-1 text-xs font-bold uppercase border border-[#0A0A0A] transition-all ${
                      currency === curr ? 'bg-[#C62828] text-white shadow-[2px_2px_0px_#0A0A0A]' : 'bg-white text-[#293241]'
                    }`}
                  >
                    {curr} ({curr === 'NGN' ? '₦' : curr === 'USD' ? '$' : '£'})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleOnlineDonate} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-gray-700">
                  Select or Enter Amount ({getSymbol()})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                  {getPresets().map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`py-3 px-2 border-2 border-[#0A0A0A] font-bold text-xs sm:text-sm transition-all ${
                        amount === preset ? 'bg-[#C62828] text-white shadow-[2px_2px_0px_#0A0A0A]' : 'bg-[#F4F1EA] text-[#293241] hover:bg-gray-200'
                      }`}
                    >
                      {getSymbol()}{Number(preset).toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder={`Custom ${currency} amount...`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 border-2 border-[#0A0A0A] bg-[#F4F1EA] font-medium focus:outline-none focus:border-[#C62828]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase mb-2 text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-4 border-2 border-[#0A0A0A] bg-[#F4F1EA] font-medium focus:outline-none focus:border-[#C62828]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-2 text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border-2 border-[#0A0A0A] bg-[#F4F1EA] font-medium focus:outline-none focus:border-[#C62828]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase mb-2 text-gray-700">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="08000000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-4 border-2 border-[#0A0A0A] bg-[#F4F1EA] font-medium focus:outline-none focus:border-[#C62828]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-2 text-gray-700">Donation Purpose</label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full p-4 border-2 border-[#0A0A0A] bg-[#F4F1EA] font-medium focus:outline-none focus:border-[#C62828]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#C62828] text-white font-bold py-4 px-8 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase text-sm disabled:opacity-50"
              >
                {isProcessing ? 'Initializing Gateway...' : `Proceed to Pay ${getSymbol()}${amount ? Number(amount).toLocaleString() : '0'}`}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="space-y-6">
            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-6 md:p-10 shadow-[8px_8px_0px_#0A0A0A] space-y-6">
              <h2 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-[#293241] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C62828]" /> Direct Bank Transfer Accounts
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                Transfer your support funds directly into our verified foundation accounts. Once completed, notify us using the form below.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-[#0A0A0A] p-6 bg-[#F4F1EA] space-y-3 shadow-[4px_4px_0px_#0A0A0A]">
                  <span className="bg-[#293241] text-white text-[10px] font-bold uppercase px-2 py-0.5 border border-[#0A0A0A]">
                    Naira Account (NGN)
                  </span>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[11px] text-gray-500 font-bold uppercase">Bank Name</p>
                      <p className="text-xs font-extrabold text-[#293241]">{settings.ngn_bank_name}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-bold uppercase">Account Name</p>
                      <p className="text-xs font-extrabold text-[#293241]">{settings.ngn_account_name}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-bold uppercase mb-1">Account Number</p>
                      <div className="flex items-center justify-between bg-white p-3 border-2 border-[#0A0A0A]">
                        <span className="font-mono font-bold text-lg text-[#293241]">{settings.ngn_account}</span>
                        <button
                          onClick={() => copyToClipboard(settings.ngn_account, 'ngn')}
                          className="bg-[#C62828] text-white p-2 border border-[#0A0A0A] hover:bg-[#a52222] transition-all"
                          title="Copy Account Number"
                        >
                          {copiedField === 'ngn' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-[#0A0A0A] p-6 bg-[#F4F1EA] space-y-3 shadow-[4px_4px_0px_#0A0A0A]">
                  <span className="bg-[#293241] text-white text-[10px] font-bold uppercase px-2 py-0.5 border border-[#0A0A0A]">
                    Dollar Account (USD)
                  </span>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[11px] text-gray-500 font-bold uppercase">Bank Name</p>
                      <p className="text-xs font-extrabold text-[#293241]">{settings.usd_bank_name}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-bold uppercase">Account Name</p>
                      <p className="text-xs font-extrabold text-[#293241]">{settings.usd_account_name}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-bold uppercase mb-1">Account Number</p>
                      <div className="flex items-center justify-between bg-white p-3 border-2 border-[#0A0A0A]">
                        <span className="font-mono font-bold text-lg text-[#293241]">{settings.usd_account}</span>
                        <button
                          onClick={() => copyToClipboard(settings.usd_account, 'usd')}
                          className="bg-[#C62828] text-white p-2 border border-[#0A0A0A] hover:bg-[#a52222] transition-all"
                          title="Copy Account Number"
                        >
                          {copiedField === 'usd' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-600 p-4 text-xs font-bold text-yellow-900">
                💡 <b>Important:</b> Please send your transfer receipts or slip confirmations to our verification address:{' '}
                <a href={`mailto:${settings.support_email}`} className="underline font-mono text-blue-700 hover:text-blue-900 ml-1">
                  {settings.support_email}
                </a>
              </div>
            </div>

            <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] p-6 md:p-10 shadow-[8px_8px_0px_#0A0A0A]">
              <h3 className="text-xl font-bold font-['Bricolage_Grotesque'] text-[#293241] mb-2 flex items-center gap-2">
                <Send className="w-5 h-5 text-[#C62828]" /> Notify Us of Your Transfer
              </h3>
              <p className="text-xs text-gray-600 mb-6 font-medium">
                Already made a bank transfer? Fill out this quick form so our accounts team can log and confirm your gift.
              </p>

              {receiptSubmitted ? (
                <div className="bg-emerald-200 border-2 border-[#0A0A0A] p-6 text-emerald-900 space-y-2">
                  <p className="font-extrabold text-lg flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-800" /> Transfer Notification Received!
                  </p>
                  <p className="text-sm font-medium">
                    Thank you! Our administrative team will verify your transfer against our bank records and update your donation status shortly.
                  </p>
                  <button
                    onClick={() => setReceiptSubmitted(false)}
                    className="mt-4 bg-[#293241] text-white text-xs font-bold px-4 py-2 border border-[#0A0A0A]"
                  >
                    Submit Another Notification
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTransferNotification} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1 text-gray-700">Your Full Name *</label>
                      <input
                        type="text"
                        value={transferName}
                        onChange={(e) => setTransferName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium focus:outline-none focus:border-[#C62828]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1 text-gray-700">Your Email Address *</label>
                      <input
                        type="email"
                        value={transferEmail}
                        onChange={(e) => setTransferEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium focus:outline-none focus:border-[#C62828]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1 text-gray-700">Amount Transferred *</label>
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="e.g. 20000"
                        className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium focus:outline-none focus:border-[#C62828]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1 text-gray-700">Currency *</label>
                      <select
                        value={transferCurrency}
                        onChange={(e) => setTransferCurrency(e.target.value)}
                        className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium focus:outline-none focus:border-[#C62828]"
                      >
                        <option value="NGN">NGN (Naira)</option>
                        <option value="USD">USD (Dollar)</option>
                        <option value="GBP">GBP (Pounds)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-gray-700">Purpose</label>
                    <input
                      type="text"
                      value={transferPurpose}
                      onChange={(e) => setTransferPurpose(e.target.value)}
                      className="w-full p-3 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-sm font-medium focus:outline-none focus:border-[#C62828]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReceipt}
                    className="bg-[#293241] text-white font-bold py-3 px-6 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#1f2631] transition-all uppercase text-xs disabled:opacity-50"
                  >
                    {submittingReceipt ? 'Submitting Notification...' : 'Submit Transfer Confirmation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}