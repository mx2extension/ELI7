
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Save,
  ArrowLeft,
  Building2,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Landmark,
} from 'lucide-react';
import Link from 'next/link';

type Setting = {
  key: string;
  value: string;
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [ngnBankName, setNgnBankName] = useState('');
  const [ngnAccountName, setNgnAccountName] = useState('');
  const [ngnAccount, setNgnAccount] = useState('');

  const [usdBankName, setUsdBankName] = useState('');
  const [usdAccountName, setUsdAccountName] = useState('');
  const [usdAccount, setUsdAccount] = useState('');

  const [emailContact, setEmailContact] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  // FETCH SETTINGS DIRECTLY FROM SUPABASE
  async function fetchSettings() {
    setLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value');

      if (error) throw error;

      const settings: Record<string, string> = {};

      (data as Setting[] || []).forEach((item) => {
        settings[item.key] = item.value;
      });

      // Only display values that actually exist in the database.
      setNgnBankName(settings['ngn_bank_name'] ?? '');
      setNgnAccountName(settings['ngn_account_name'] ?? '');
      setNgnAccount(settings['ngn_account'] ?? '');

      setUsdBankName(settings['usd_bank_name'] ?? '');
      setUsdAccountName(settings['usd_account_name'] ?? '');
      setUsdAccount(settings['usd_account'] ?? '');

      setEmailContact(settings['support_email'] ?? '');

    } catch (error: any) {
      console.error('Fetch settings error:', error);
      setErrorMessage(
        error.message || 'Failed to fetch settings from Supabase.'
      );
    } finally {
      setLoading(false);
    }
  }

  // SAVE SETTINGS TO SUPABASE
  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setSaved(false);
    setErrorMessage('');

    const updates = [
      { key: 'ngn_bank_name', value: ngnBankName.trim() },
      { key: 'ngn_account_name', value: ngnAccountName.trim() },
      { key: 'ngn_account', value: ngnAccount.trim() },
      { key: 'usd_bank_name', value: usdBankName.trim() },
      { key: 'usd_account_name', value: usdAccountName.trim() },
      { key: 'usd_account', value: usdAccount.trim() },
      { key: 'support_email', value: emailContact.trim() },
    ];

    try {
      const { error } = await supabase
        .from('settings')
        .upsert(
          updates.map((item) => ({
            key: item.key,
            value: item.value,
            updated_at: new Date().toISOString(),
          })),
          { onConflict: 'key' }
        );

      if (error) throw error;

      // Fetch the actual saved database values again.
      await fetchSettings();

      setSaved(true);

    } catch (error: any) {
      console.error('Save settings error:', error);
      setErrorMessage(
        error.message || 'Failed to save settings to Supabase.'
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'w-full p-3.5 border-2 border-[#0A0A0A] bg-white text-sm font-semibold text-[#293241] focus:outline-none focus:border-[#C62828] transition-colors rounded-none';

  const labelClass =
    'block text-xs font-bold uppercase tracking-wide text-[#293241] mb-2';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C62828]" />
          <p className="font-bold text-sm text-[#293241]">
            Fetching settings from database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-7">

        {/* HEADER */}
        <div className="bg-white p-6 md:p-8 border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A]">

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#C62828] hover:underline mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#C62828] text-white flex items-center justify-center border-2 border-[#0A0A0A]">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C62828]">
                Administration
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">
                System Settings
              </h1>
            </div>
          </div>

          <p className="text-sm text-gray-600 font-medium">
            Manage foundation banking information and official support
            contact details. All information is fetched from and saved
            directly to your Supabase settings table.
          </p>
        </div>

        {/* SUCCESS */}
        {saved && (
          <div className="bg-emerald-100 border-2 border-emerald-700 p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <p className="font-bold text-sm text-emerald-900">
              Settings successfully saved and verified!
            </p>
          </div>
        )}

        {/* ERROR */}
        {errorMessage && (
          <div className="bg-red-100 border-2 border-red-700 p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
            <div>
              <p className="font-bold text-sm text-red-900">
                Database Error
              </p>
              <p className="text-xs text-red-800">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-7">

          {/* BANKING */}
          <section className="bg-white border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A]">

            <div className="p-5 md:p-7 border-b-2 border-[#0A0A0A] flex items-center gap-3">
              <Landmark className="w-6 h-6 text-[#C62828]" />
              <div>
                <h2 className="text-xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">
                  Banking Configuration
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Bank information retrieved from Supabase.
                </p>
              </div>
            </div>

            <div className="p-5 md:p-7 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NAIRA */}
              <div className="border-2 border-[#0A0A0A] bg-[#F4F1EA] p-5 space-y-4">

                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[#293241]">
                    Naira Account
                  </h3>
                  <span className="text-[10px] font-extrabold bg-[#00897B] text-white px-2 py-1">
                    NGN
                  </span>
                </div>

                <div>
                  <label className={labelClass}>Bank Name</label>
                  <input
                    type="text"
                    value={ngnBankName}
                    onChange={(e) => setNgnBankName(e.target.value)}
                    className={inputClass}
                    placeholder="Enter bank name"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Account Name</label>
                  <input
                    type="text"
                    value={ngnAccountName}
                    onChange={(e) => setNgnAccountName(e.target.value)}
                    className={inputClass}
                    placeholder="Enter account name"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Account Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={ngnAccount}
                    onChange={(e) => setNgnAccount(e.target.value)}
                    className={inputClass}
                    placeholder="Enter account number"
                    required
                  />
                </div>
              </div>

              {/* DOLLAR */}
              <div className="border-2 border-[#0A0A0A] bg-[#F4F1EA] p-5 space-y-4">

                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[#293241]">
                    Dollar Account
                  </h3>
                  <span className="text-[10px] font-extrabold bg-[#293241] text-white px-2 py-1">
                    USD
                  </span>
                </div>

                <div>
                  <label className={labelClass}>Bank Name</label>
                  <input
                    type="text"
                    value={usdBankName}
                    onChange={(e) => setUsdBankName(e.target.value)}
                    className={inputClass}
                    placeholder="Enter bank name"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Account Name</label>
                  <input
                    type="text"
                    value={usdAccountName}
                    onChange={(e) => setUsdAccountName(e.target.value)}
                    className={inputClass}
                    placeholder="Enter account name"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Account Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={usdAccount}
                    onChange={(e) => setUsdAccount(e.target.value)}
                    className={inputClass}
                    placeholder="Enter account number"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SUPPORT EMAIL */}
          <section className="bg-white border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A]">

            <div className="p-5 md:p-7 border-b-2 border-[#0A0A0A] flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#C62828]" />
              <div>
                <h2 className="text-xl font-extrabold font-['Bricolage_Grotesque'] text-[#293241]">
                  Notifications & Support
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Configure your official support email.
                </p>
              </div>
            </div>

            <div className="p-5 md:p-7">
              <label className={labelClass}>
                Slip Verification Email / Support Email
              </label>

              <input
                type="email"
                value={emailContact}
                onChange={(e) => setEmailContact(e.target.value)}
                className={inputClass}
                placeholder="Enter official foundation email"
                required
              />

              <p className="text-xs text-gray-500 mt-2">
                Database key: support_email
              </p>
            </div>
          </section>

          {/* SAVE */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white border-2 border-[#0A0A0A] p-5 shadow-[6px_6px_0px_#0A0A0A]">

            <div>
              <p className="font-extrabold text-sm text-[#293241]">
                Save Configuration
              </p>
              <p className="text-xs text-gray-500">
                Insert new settings or update existing records.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-[#C62828] text-white font-extrabold py-4 px-7 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Configuration
                </>
              )}
            </button>

          </div>
        </form>

        <div className="bg-white border-2 border-[#0A0A0A] p-4 text-xs text-gray-500 font-medium">
          <p>
            <strong>Database:</strong> public.settings
          </p>
          <p className="mt-1">
            <strong>Columns:</strong> key, value, updated_at
          </p>
          <p className="mt-1">
            All seven configuration records are managed using their unique
            key values.
          </p>
        </div>

      </div>
    </div>
  );
}
