
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Heart,
  CreditCard,
  Building2,
  Check,
  Send,
  Sparkles,
  Copy,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: any) => void;
  }
}

type DonationSettings = {
  support_email: string;
  ngn_bank_name: string;
  ngn_account_name: string;
  ngn_account: string;
  usd_bank_name: string;
  usd_account_name: string;
  usd_account: string;
};

const emptySettings: DonationSettings = {
  support_email: '',
  ngn_bank_name: '',
  ngn_account_name: '',
  ngn_account: '',
  usd_bank_name: '',
  usd_account_name: '',
  usd_account: '',
};

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState<'online' | 'transfer'>('online');

  // SETTINGS FETCHED FROM SUPABASE
  const [settings, setSettings] = useState<DonationSettings>(emptySettings);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState('');

  const supportEmail = settings.support_email;

  // ONLINE DONATION
  const [currency, setCurrency] = useState<'NGN' | 'USD' | 'GBP'>('NGN');
  const [amount, setAmount] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('General Foundation Support');
  const [isProcessing, setIsProcessing] = useState(false);

  // BANK TRANSFER NOTIFICATION
  const [transferName, setTransferName] = useState('');
  const [transferEmail, setTransferEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferCurrency, setTransferCurrency] = useState('NGN');
  const [transferPurpose, setTransferPurpose] = useState(
    'General Foundation Support'
  );

  const [receiptSubmitted, setReceiptSubmitted] = useState(false);
  const [submittingReceipt, setSubmittingReceipt] = useState(false);

  // COPY ACCOUNT NUMBER
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          '';

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

  // ==========================================
  // FETCH SETTINGS DIRECTLY FROM SUPABASE
  // ==========================================

  async function fetchSettings() {
    setSettingsLoading(true);
    setSettingsError('');

    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value');

      if (error) throw error;

      const settingsMap: Record<string, string> = {};

      (data || []).forEach((item) => {
        settingsMap[item.key] = item.value;
      });

      setSettings({
        support_email: settingsMap['support_email'] || '',

        ngn_bank_name: settingsMap['ngn_bank_name'] || '',
        ngn_account_name: settingsMap['ngn_account_name'] || '',
        ngn_account: settingsMap['ngn_account'] || '',

        usd_bank_name: settingsMap['usd_bank_name'] || '',
        usd_account_name: settingsMap['usd_account_name'] || '',
        usd_account: settingsMap['usd_account'] || '',
      });
    } catch (error: any) {
      console.error('Error fetching foundation settings:', error);

      setSettingsError(
        error.message || 'Unable to retrieve foundation account details.'
      );
    } finally {
      setSettingsLoading(false);
    }
  }

  // ==========================================
  // COPY BANK ACCOUNT NUMBER
  // ==========================================

  async function copyAccountNumber(
    accountNumber: string,
    field: string
  ) {
    try {
      await navigator.clipboard.writeText(accountNumber);

      setCopiedField(field);

      setTimeout(() => {
        setCopiedField(null);
      }, 2500);
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Unable to copy account number. Please copy it manually.');
    }
  }

  // ==========================================
  // ONLINE DONATION / FLUTTERWAVE
  // ==========================================

  async function handleOnlineDonate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!amount || !fullName || !email) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!window.FlutterwaveCheckout) {
      alert('Payment gateway is still loading. Please wait and try again.');
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
            currency,
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
        currency,

        payment_options: 'card, banktransfer, ussd',

        customer: {
          email,
          phonenumber: phone,
          name: fullName,
        },

        customizations: {
          title: 'ELI7 Foundation',
          description: purpose || 'Foundation Donation',
          logo: 'https://www.mx2bdi.com/eli7foundation/logo.png',
        },

        callback: async (response: any) => {
          if (response.status === 'successful') {
            if (donationId) {
              await supabase
                .from('donations')
                .update({
                  payment_status: 'paid',
                  transaction_id: response.transaction_id,
                })
                .eq('id', donationId);
            }

            const symbol =
              currency === 'NGN'
                ? '₦'
                : currency === 'USD'
                  ? '$'
                  : '£';

            alert(
              `Payment Successful! Thank you for your donation of ${symbol}${Number(amount).toLocaleString()}.`
            );

            setAmount('');
            setPurpose('General Foundation Support');
          } else {
            alert('Payment was not completed. Please try again.');
          }

          setIsProcessing(false);
        },

        onclose: () => {
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      alert('Error recording donation: ' + err.message);
      setIsProcessing(false);
    }
  }

  // ==========================================
  // BANK TRANSFER NOTIFICATION
  // ==========================================

  async function handleTransferNotification(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!transferName || !transferEmail || !transferAmount) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmittingReceipt(true);

    try {
      const { error } = await supabase
        .from('donations')
        .insert([
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

  // ==========================================
  // CURRENCY HELPERS
  // ==========================================

  const getSymbol = () => {
    if (currency === 'NGN') return '₦';
    if (currency === 'USD') return '$';
    return '£';
  };

  const getPresets = () => {
    if (currency === 'NGN') {
      return ['10000', '50000', '250000', '500000', '1000000'];
    }

    return ['50', '100', '250', '500', '1000'];
  };

  // ==========================================
  // STYLING
  // ==========================================

  const inputStyle =
    'w-full p-3.5 border-2 border-[#0A0A0A] bg-[#F4F1EA] text-[#293241] font-medium text-sm placeholder:text-[#555555] focus:outline-none focus:border-[#C62828] transition-colors';

  const labelStyle =
    'block text-xs font-bold uppercase mb-2 text-[#293241]';

  const sectionStyle =
    'border-2 border-[#0A0A0A] p-6 md:p-8 shadow-[6px_6px_0px_#0A0A0A]';

  // ==========================================
  // BANK ACCOUNT CARD
  // ==========================================

  function BankAccountCard({
    title,
    bankName,
    accountName,
    accountNumber,
    field,
    currencyLabel,
  }: {
    title: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    field: string;
    currencyLabel: string;
  }) {
    const isComplete = Boolean(
      bankName.trim() &&
        accountName.trim() &&
        accountNumber.trim()
    );

    return (
      <div className="border-2 border-[#0A0A0A] p-5 bg-transparent space-y-4 shadow-[4px_4px_0px_#0A0A0A]">

        <div className="flex items-center justify-between gap-2">
          <span className="inline-block bg-[#293241] text-white text-[10px] font-bold uppercase px-2.5 py-1 border border-[#0A0A0A]">
            {title}
          </span>

          <span className="text-[10px] font-extrabold text-[#00897B]">
            {currencyLabel}
          </span>
        </div>

        {settingsLoading ? (
          <div className="min-h-[160px] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#C62828]" />
            <p className="text-xs font-bold text-gray-500">
              Loading bank details...
            </p>
          </div>
        ) : isComplete ? (
          <div className="space-y-4">

            <div>
              <p className="text-xs font-bold uppercase text-gray-500 mb-1">
                Bank Name
              </p>

              <p className="font-extrabold text-lg text-[#293241]">
                {bankName}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-gray-500 mb-1">
                Account Name
              </p>

              <p className="font-bold text-[#293241]">
                {accountName}
              </p>
            </div>

            <div className="border-2 border-[#0A0A0A] bg-[#F4F1EA] p-4">

              <p className="text-xs font-bold uppercase text-gray-500 mb-2">
                Account Number
              </p>

              <div className="flex items-center justify-between gap-2">

                <p className="text-xl sm:text-2xl font-extrabold tracking-wider text-[#293241] break-all">
                  {accountNumber}
                </p>

                <button
                  type="button"
                  onClick={() => copyAccountNumber(accountNumber, field)}
                  className="shrink-0 bg-[#C62828] text-white px-3 py-2 text-xs font-bold border-2 border-[#0A0A0A] hover:bg-[#293241] transition-colors flex items-center gap-1"
                >
                  {copiedField === field ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>

              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#00897B] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Official foundation account
            </div>

          </div>
        ) : (
          <div className="border-2 border-[#293241] p-5 bg-transparent space-y-3">

            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#C62828]" />
              <p className="font-bold text-sm text-[#293241]">
                Account Details Unavailable
              </p>
            </div>

            <p className="text-sm text-[#293241] leading-relaxed">
              Our {currencyLabel} bank account details are not yet fully
              configured. Please contact us using the support email below.
            </p>

          </div>
        )}

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 md:px-8 text-[#293241]">

      <div className="max-w-5xl mx-auto space-y-8">

        {/* PAGE INTRODUCTION */}

        <div className="text-center space-y-3 mb-10">

          <div className="inline-flex items-center gap-2 bg-[#C62828] text-white text-xs font-bold uppercase px-3 py-1.5 border-2 border-[#0A0A0A]">
            <Heart className="w-3.5 h-3.5 fill-white" />
            Support Our Mission
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">
            Invest in Sustainable Impact
          </h1>

          <p className="text-sm md:text-base text-[#293241] font-medium leading-relaxed max-w-2xl mx-auto">
            Your contributions directly support community empowerment,
            education initiatives, healthcare and sustainable development.
            Choose your preferred way to give below.
          </p>

          <div className="flex justify-center gap-2 pt-2">
            <span className="w-12 h-1.5 bg-[#C62828]" />
            <span className="w-12 h-1.5 bg-[#00897B]" />
            <span className="w-4 h-1.5 bg-[#FFD23F]" />
          </div>

        </div>

        {/* PAYMENT TABS */}

        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">

          <button
            type="button"
            onClick={() => setActiveTab('online')}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 font-bold text-xs sm:text-sm border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] transition-all ${
              activeTab === 'online'
                ? 'bg-[#293241] text-white translate-x-[2px] translate-y-[2px] shadow-none'
                : 'bg-transparent text-[#293241] hover:bg-[#F4F1EA]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#C62828]" />
            Online Checkout
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transfer')}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 font-bold text-xs sm:text-sm border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] transition-all ${
              activeTab === 'transfer'
                ? 'bg-[#293241] text-white translate-x-[2px] translate-y-[2px] shadow-none'
                : 'bg-transparent text-[#293241] hover:bg-[#F4F1EA]'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#C62828]" />
            Bank Transfer
          </button>

        </div>

        {/* ONLINE CHECKOUT */}

        {activeTab === 'online' && (

          <div className={`${sectionStyle} space-y-8`}>

            {/* TEMPORARY MENSTRUAL HEALTH OUTREACH PAYMENT */}

            <div className="border-2 border-[#0A0A0A] p-5 md:p-6 bg-transparent shadow-[4px_4px_0px_#0A0A0A] space-y-5">

              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#C62828]" />

                <h2 className="text-lg md:text-xl font-bold font-['Bricolage_Grotesque'] text-[#293241]">
                  Support Our Menstrual Health Outreach
                </h2>
              </div>

              <p className="text-sm text-[#293241] font-medium leading-relaxed">
                Help us reach 6,000 girls with menstrual health education,
                support and essential resources. You can make your contribution
                directly through our temporary secure Flutterwave payment link
                below while our main online checkout is being set up.
              </p>

              <a
                href="https://flutterwave.com/pay/eli7menstrualhealth6000girls"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#00897B] text-white font-bold py-4 px-6 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Donate to Menstrual Health Outreach
              </a>

              <p className="text-xs text-[#293241] font-medium leading-relaxed">
                You will be redirected to Flutterwave to complete your
                contribution.
              </p>

            </div>

            {/* EXISTING ONLINE DONATION FORM - RETAINED */}

            <div className="space-y-6">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b-2 border-[#0A0A0A]">

                <h2 className="text-xl md:text-2xl font-bold font-['Bricolage_Grotesque'] text-[#293241] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C62828]" />
                  Secure Instant Contribution
                </h2>

                <div className="flex items-center gap-1.5 bg-transparent p-1.5 border-2 border-[#0A0A0A] overflow-x-auto">

                  <span className="text-[10px] font-bold uppercase px-1 text-[#293241]">
                    Currency:
                  </span>

                  {(['NGN', 'USD', 'GBP'] as const).map((curr) => (

                    <button
                      key={curr}
                      type="button"
                      onClick={() => {
                        setCurrency(curr);
                        setAmount('');
                      }}
                      className={`px-2.5 py-1.5 text-xs font-bold uppercase border border-[#0A0A0A] transition-all ${
                        currency === curr
                          ? 'bg-[#C62828] text-white shadow-[2px_2px_0px_#0A0A0A]'
                          : 'bg-transparent text-[#293241] hover:bg-[#F4F1EA]'
                      }`}
                    >
                      {curr}
                    </button>

                  ))}

                </div>

              </div>

              <form onSubmit={handleOnlineDonate} className="space-y-6">

                {/* AMOUNT */}

                <div>

                  <label className={labelStyle}>
                    Select or Enter Amount ({getSymbol()})
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">

                    {getPresets().map((preset) => (

                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className={`py-3 px-2 border-2 border-[#0A0A0A] font-bold text-xs sm:text-sm transition-all ${
                          amount === preset
                            ? 'bg-[#C62828] text-white shadow-[2px_2px_0px_#0A0A0A]'
                            : 'bg-transparent text-[#293241] hover:bg-[#F4F1EA]'
                        }`}
                      >
                        {getSymbol()}{Number(preset).toLocaleString()}
                      </button>

                    ))}

                  </div>

                  <input
                    type="number"
                    min="1"
                    placeholder={`Custom ${currency} amount...`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={inputStyle}
                    required
                  />

                </div>

                {/* DONOR INFORMATION */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className={labelStyle}>
                      Full Name *
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>
                      Email Address *
                    </label>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputStyle}
                      required
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className={labelStyle}>
                      Phone Number (Optional)
                    </label>

                    <input
                      type="tel"
                      placeholder="08000000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>
                      Donation Purpose
                    </label>

                    <input
                      type="text"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#C62828] text-white font-bold py-4 px-6 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase text-xs sm:text-sm disabled:opacity-50"
                >
                  {isProcessing
                    ? 'Initializing Gateway...'
                    : `Proceed to Pay ${getSymbol()}${amount ? Number(amount).toLocaleString() : '0'}`}
                </button>

              </form>

            </div>

          </div>

        )}

        {/* BANK TRANSFER */}

        {activeTab === 'transfer' && (

          <div className="space-y-7">

            <div className={`${sectionStyle} space-y-6`}>

              <div>

                <h2 className="text-xl md:text-2xl font-bold font-['Bricolage_Grotesque'] text-[#293241] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#C62828]" />
                  Direct Bank Transfer Accounts
                </h2>

                <p className="text-sm text-[#293241] font-medium mt-2 leading-relaxed">
                  Transfer your support funds directly into our foundation
                  accounts. Once completed, notify us using the form below.
                </p>

              </div>

              {/* SETTINGS FETCH ERROR */}

              {settingsError && (

                <div className="border-2 border-red-600 bg-red-50 p-4 flex items-start gap-3">

                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />

                  <div>

                    <p className="font-bold text-sm text-red-800">
                      Unable to load bank details
                    </p>

                    <p className="text-xs text-red-700 mt-1">
                      {settingsError}
                    </p>

                    <button
                      type="button"
                      onClick={fetchSettings}
                      className="mt-3 text-xs font-bold text-red-800 underline"
                    >
                      Try Again
                    </button>

                  </div>

                </div>

              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* NAIRA ACCOUNT */}

                <BankAccountCard
                  title="Naira Account (NGN)"
                  currencyLabel="NGN"
                  bankName={settings.ngn_bank_name}
                  accountName={settings.ngn_account_name}
                  accountNumber={settings.ngn_account}
                  field="ngn"
                />

                {/* USD ACCOUNT */}

                <BankAccountCard
                  title="Dollar Account (USD)"
                  currencyLabel="USD"
                  bankName={settings.usd_bank_name}
                  accountName={settings.usd_account_name}
                  accountNumber={settings.usd_account}
                  field="usd"
                />

              </div>

              {/* TRANSFER INSTRUCTIONS */}

              <div className="border-2 border-[#293241] bg-transparent p-4 text-sm text-[#293241] font-medium leading-relaxed">

                <p className="font-bold mb-1">
                  Important: Transfer Confirmation
                </p>

                After completing your transfer, please use the
                notification form below to inform our team.

                <p className="mt-3 font-bold">
                  Need assistance?
                </p>

                {settingsLoading ? (

                  <p className="text-gray-500 mt-1">
                    Loading support contact...
                  </p>

                ) : supportEmail ? (

                  <a
                    href={`mailto:${supportEmail}`}
                    className="block font-bold underline text-[#C62828] mt-1"
                  >
                    {supportEmail}
                  </a>

                ) : (

                  <p className="text-gray-500 mt-1">
                    Support email currently unavailable.
                  </p>

                )}

              </div>

            </div>

            {/* TRANSFER NOTIFICATION */}

            <div className={sectionStyle}>

              <h3 className="text-xl font-bold font-['Bricolage_Grotesque'] text-[#293241] mb-2 flex items-center gap-2">
                <Send className="w-5 h-5 text-[#C62828]" />
                Notify Us of Your Transfer
              </h3>

              <p className="text-sm text-[#293241] mb-6 font-medium leading-relaxed">
                Already made a bank transfer? Fill out this form so our
                administrative team can record and verify your contribution.
              </p>

              {receiptSubmitted ? (

                <div className="border-2 border-[#0A0A0A] p-6 bg-[#00897B] text-white space-y-3">

                  <p className="font-extrabold text-lg flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Transfer Notification Received!
                  </p>

                  <p className="text-sm font-medium text-white leading-relaxed">
                    Thank you for supporting ELI7 Foundation. Our team will
                    verify your transfer against our bank records.
                  </p>

                  <button
                    type="button"
                    onClick={() => setReceiptSubmitted(false)}
                    className="mt-3 bg-[#293241] text-white text-xs font-bold px-4 py-3 border-2 border-[#0A0A0A] hover:bg-[#C62828] transition-all"
                  >
                    Submit Another Notification
                  </button>

                </div>

              ) : (

                <form
                  onSubmit={handleTransferNotification}
                  className="space-y-5"
                >

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                      <label className={labelStyle}>
                        Your Full Name *
                      </label>

                      <input
                        type="text"
                        value={transferName}
                        onChange={(e) => setTransferName(e.target.value)}
                        placeholder="Enter your full name"
                        className={inputStyle}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelStyle}>
                        Your Email Address *
                      </label>

                      <input
                        type="email"
                        value={transferEmail}
                        onChange={(e) => setTransferEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputStyle}
                        required
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                      <label className={labelStyle}>
                        Amount Transferred *
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="e.g. 20000"
                        className={inputStyle}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelStyle}>
                        Currency *
                      </label>

                      <select
                        value={transferCurrency}
                        onChange={(e) => setTransferCurrency(e.target.value)}
                        className={inputStyle}
                      >
                        <option value="NGN">NGN (Naira)</option>
                        <option value="USD">USD (Dollar)</option>
                        <option value="GBP">GBP (Pounds)</option>
                      </select>
                    </div>

                  </div>

                  <div>
                    <label className={labelStyle}>
                      Purpose
                    </label>

                    <input
                      type="text"
                      value={transferPurpose}
                      onChange={(e) => setTransferPurpose(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReceipt}
                    className="bg-[#293241] text-white font-bold py-3.5 px-7 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#C62828] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase text-xs sm:text-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {submittingReceipt ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Notification...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Transfer Confirmation
                      </>
                    )}
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
