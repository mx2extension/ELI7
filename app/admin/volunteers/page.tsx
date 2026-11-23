
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Trash2,
  RefreshCw,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  X,
  Heart,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string;
  skills: string;
  interest: string;
  availability: string;
  message: string | null;
  status: string | null;
  created_at: string;
}

type FilterType = 'all' | 'pending' | 'accepted';

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('volunteer_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setVolunteers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const acceptVolunteer = async (id: string) => {
    setAcceptingId(id);

    const { data, error } = await supabase
      .from('volunteer_submissions')
      .update({ status: 'accepted' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      alert('Failed to accept volunteer: ' + error.message);
      setAcceptingId(null);
      return;
    }

    setVolunteers(prev =>
      prev.map(v => v.id === id ? { ...v, status: data.status } : v)
    );

    setSelectedVolunteer(prev =>
      prev?.id === id ? { ...prev, status: data.status } : prev
    );

    setAcceptingId(null);
  };

  const deleteVolunteer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this volunteer application?')) {
      return;
    }

    const { error } = await supabase
      .from('volunteer_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete volunteer: ' + error.message);
      return;
    }

    setVolunteers(prev => prev.filter(v => v.id !== id));
    setSelectedVolunteer(prev => prev?.id === id ? null : prev);
  };

  const filteredVolunteers = volunteers.filter(v => {
    if (filter === 'pending') return v.status === 'pending' || !v.status;
    if (filter === 'accepted') return v.status === 'accepted';
    return true;
  });

  const pendingCount = volunteers.filter(
    v => v.status === 'pending' || !v.status
  ).length;

  const acceptedCount = volunteers.filter(
    v => v.status === 'accepted'
  ).length;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const isPending = (volunteer: Volunteer) =>
    volunteer.status !== 'accepted';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 sm:space-y-7">

      {/* HEADER */}
      <div className="bg-white p-4 sm:p-6 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] sm:shadow-[5px_5px_0px_#0A0A0A]">

        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase text-[#00897B] hover:underline mb-3"
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#293241]">
              Volunteers
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Review and manage volunteer applications.
            </p>
          </div>

          <button
            onClick={fetchVolunteers}
            disabled={loading}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#00897B] text-white border-2 border-[#0A0A0A] font-bold text-xs sm:text-sm hover:opacity-90 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">

        <div className="bg-white p-3 sm:p-5 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] sm:shadow-[4px_4px_0px_#0A0A0A]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-[9px] sm:text-xs uppercase font-bold text-gray-500 leading-tight">
                Total
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#293241] mt-1">
                {volunteers.length}
              </p>
            </div>
            <Users size={20} className="text-[#293241] sm:w-7 sm:h-7" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] sm:shadow-[4px_4px_0px_#0A0A0A]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-[9px] sm:text-xs uppercase font-bold text-gray-500 leading-tight">
                Pending
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-yellow-600 mt-1">
                {pendingCount}
              </p>
            </div>
            <Clock size={20} className="text-yellow-600 sm:w-7 sm:h-7" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] sm:shadow-[4px_4px_0px_#0A0A0A]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-[9px] sm:text-xs uppercase font-bold text-gray-500 leading-tight">
                Accepted
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#00897B] mt-1">
                {acceptedCount}
              </p>
            </div>
            <CheckCircle size={20} className="text-[#00897B] sm:w-7 sm:h-7" />
          </div>
        </div>

      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {([
          { key: 'all', label: 'All', count: volunteers.length },
          { key: 'pending', label: 'Pending', count: pendingCount },
          { key: 'accepted', label: 'Accepted', count: acceptedCount },
        ] as const).map(item => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 border-2 border-[#0A0A0A] font-bold text-xs sm:text-sm transition ${
              filter === item.key
                ? item.key === 'pending'
                  ? 'bg-yellow-400 text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]'
                  : item.key === 'accepted'
                    ? 'bg-[#00897B] text-white shadow-[2px_2px_0px_#0A0A0A]'
                    : 'bg-[#293241] text-white shadow-[2px_2px_0px_#0A0A0A]'
                : 'bg-white text-[#293241]'
            }`}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-100 text-red-700 text-xs sm:text-sm font-semibold border border-red-300 break-words">
          Error loading submissions: {error}
        </div>
      )}

      {/* VOLUNTEER LIST */}
      {loading ? (
        <div className="bg-white border-2 border-[#0A0A0A] p-10 text-center shadow-[3px_3px_0px_#0A0A0A]">
          <RefreshCw size={25} className="animate-spin mx-auto text-[#00897B]" />
          <p className="text-sm font-semibold text-gray-500 mt-3">
            Loading applications...
          </p>
        </div>
      ) : filteredVolunteers.length === 0 ? (
        <div className="bg-white border-2 border-[#0A0A0A] p-10 text-center shadow-[3px_3px_0px_#0A0A0A]">
          <Users size={34} className="mx-auto text-gray-300" />
          <h3 className="text-base sm:text-lg font-extrabold text-[#293241] mt-3">
            No volunteer applications found
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Applications in this category will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">

          {filteredVolunteers.map(v => (
            <article
              key={v.id}
              onClick={() => setSelectedVolunteer(v)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedVolunteer(v);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View application from ${v.name}`}
              className="bg-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:shadow-[5px_5px_0px_#00897B] transition-all cursor-pointer overflow-hidden"
            >

              <div className="p-4 sm:p-5">

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#293241] break-words">
                      {v.name}
                    </h3>

                    <div className="flex items-start gap-1 text-gray-500 text-[11px] sm:text-xs mt-1.5">
                      <MapPin size={13} className="shrink-0 mt-0.5" />
                      <span className="break-words">{v.location}</span>
                    </div>
                  </div>

                  {v.status === 'accepted' ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-[9px] font-extrabold uppercase border border-green-300">
                      <CheckCircle size={11} />
                      Accepted
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-[9px] font-extrabold uppercase border border-yellow-300">
                      <Clock size={11} />
                      Pending
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-[9px] font-extrabold uppercase text-gray-400 mb-1">
                    Skills
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 break-words line-clamp-2">
                    {v.skills}
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-[9px] font-extrabold uppercase text-gray-400 mb-1">
                    Area of Interest
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 break-words line-clamp-2">
                    {v.interest}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
                  <Calendar size={13} />
                  Applied {formatDate(v.created_at)}
                </div>

              </div>

              <div className="border-t-2 border-[#0A0A0A] bg-[#F4F1EA] px-3 py-2.5 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00897B]">
                  <Eye size={14} />
                  View Details
                </span>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteVolunteer(v.id);
                  }}
                  className="p-2 bg-red-600 text-white border border-[#0A0A0A] hover:bg-red-700"
                  title="Delete application"
                  aria-label={`Delete application from ${v.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>

            </article>
          ))}

        </div>
      )}

      {/* APPLICATION DETAILS MODAL */}
      {selectedVolunteer && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-2 sm:p-5"
          onClick={() => setSelectedVolunteer(null)}
        >
          <div
            className="bg-[#F4F1EA] w-full max-w-2xl max-h-[94dvh] overflow-y-auto border-2 border-[#0A0A0A] shadow-[5px_5px_0px_#00897B] sm:shadow-[8px_8px_0px_#00897B]"
            onClick={e => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 bg-[#293241] text-white px-4 py-4 sm:px-6 sm:py-5 border-b-2 border-[#0A0A0A]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#80CBC4]">
                    Volunteer Application
                  </p>

                  <h2 className="text-xl sm:text-2xl font-extrabold mt-1 break-words">
                    {selectedVolunteer.name}
                  </h2>

                  <p className="text-[10px] sm:text-xs text-gray-300 mt-1">
                    Submitted {formatDate(selectedVolunteer.created_at)}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="p-2 bg-white text-[#293241] hover:bg-gray-200 border border-[#0A0A0A] shrink-0"
                  aria-label="Close application"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">

              {/* STATUS */}
              <div className="bg-white border border-gray-200 p-3 flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-xs font-extrabold uppercase text-gray-500">
                  Application Status
                </span>

                {selectedVolunteer.status === 'accepted' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-green-100 text-green-800 font-bold text-[10px] sm:text-xs">
                    <CheckCircle size={13} />
                    Accepted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-yellow-100 text-yellow-800 font-bold text-[10px] sm:text-xs">
                    <Clock size={13} />
                    Pending
                  </span>
                )}
              </div>

              {/* CONTACT DETAILS */}
              <section className="bg-white border border-gray-200 p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-extrabold text-[#293241] mb-4">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold uppercase text-gray-400 mb-1">
                      Full Name
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#293241] break-words">
                      {selectedVolunteer.name}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold uppercase text-gray-400 mb-1">
                      Email Address
                    </p>
                    <a
                      href={`mailto:${selectedVolunteer.email}`}
                      className="flex items-start gap-1.5 text-xs sm:text-sm text-[#00897B] font-semibold break-all hover:underline"
                    >
                      <Mail size={14} className="shrink-0 mt-0.5" />
                      {selectedVolunteer.email}
                    </a>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold uppercase text-gray-400 mb-1">
                      Phone Number
                    </p>
                    <div className="flex items-start gap-1.5 text-xs sm:text-sm text-[#293241] break-words">
                      <Phone size={14} className="shrink-0 mt-0.5" />
                      {selectedVolunteer.phone || 'Not provided'}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold uppercase text-gray-400 mb-1">
                      Location
                    </p>
                    <div className="flex items-start gap-1.5 text-xs sm:text-sm text-[#293241] break-words">
                      <MapPin size={14} className="shrink-0 mt-0.5" />
                      {selectedVolunteer.location}
                    </div>
                  </div>

                </div>
              </section>

              {/* SKILLS */}
              <section className="bg-white border border-gray-200 p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-extrabold text-[#293241] mb-2">
                  Skills & Expertise
                </h3>
                <div className="bg-[#F4F1EA] p-3 border border-gray-200">
                  <p className="text-xs sm:text-sm text-[#293241] leading-relaxed whitespace-pre-wrap break-words">
                    {selectedVolunteer.skills}
                  </p>
                </div>
              </section>

              {/* INTEREST */}
              <section className="bg-white border border-gray-200 p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-extrabold text-[#293241] mb-2">
                  Area of Interest
                </h3>
                <div className="bg-[#F4F1EA] p-3 border border-gray-200">
                  <p className="text-xs sm:text-sm text-[#293241] leading-relaxed whitespace-pre-wrap break-words">
                    {selectedVolunteer.interest}
                  </p>
                </div>
              </section>

              {/* AVAILABILITY */}
              <section className="bg-white border border-gray-200 p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-extrabold text-[#293241] mb-2">
                  Availability
                </h3>
                <div className="flex items-start gap-2 bg-[#F4F1EA] p-3 border border-gray-200">
                  <Calendar size={16} className="text-[#00897B] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#293241] leading-relaxed whitespace-pre-wrap break-words">
                    {selectedVolunteer.availability}
                  </p>
                </div>
              </section>

              {/* ADDITIONAL MESSAGE */}
              <section className="bg-white border border-gray-200 p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-extrabold text-[#293241] mb-2 flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#00897B]" />
                  Additional Message
                </h3>
                <div className="bg-[#F4F1EA] p-3 border border-gray-200 min-h-[65px]">
                  {selectedVolunteer.message ? (
                    <p className="text-xs sm:text-sm text-[#293241] leading-relaxed whitespace-pre-wrap break-words">
                      {selectedVolunteer.message}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No additional message provided.
                    </p>
                  )}
                </div>
              </section>

            </div>

            {/* MODAL ACTIONS */}
            <div className="sticky bottom-0 bg-white border-t-2 border-[#0A0A0A] p-3 sm:p-4">
              <div className="grid grid-cols-2 sm:flex gap-2">

                {isPending(selectedVolunteer) ? (
                  <button
                    onClick={() => acceptVolunteer(selectedVolunteer.id)}
                    disabled={acceptingId === selectedVolunteer.id}
                    className="col-span-2 sm:flex-1 flex items-center justify-center gap-1.5 px-3 py-3 bg-[#00897B] text-white border-2 border-[#0A0A0A] font-extrabold text-xs sm:text-sm hover:bg-[#00695C] disabled:opacity-50"
                  >
                    <CheckCircle size={16} />
                    {acceptingId === selectedVolunteer.id
                      ? 'Accepting...'
                      : 'Accept Volunteer'}
                  </button>
                ) : (
                  <div className="col-span-2 sm:flex-1 flex items-center justify-center gap-1.5 px-3 py-3 bg-green-100 text-green-800 border border-green-300 font-extrabold text-xs sm:text-sm">
                    <Heart size={16} />
                    Volunteer Accepted
                  </div>
                )}

                <button
                  onClick={() => deleteVolunteer(selectedVolunteer.id)}
                  className="flex items-center justify-center gap-1.5 px-3 py-3 bg-red-600 text-white border-2 border-[#0A0A0A] font-bold text-xs sm:text-sm hover:bg-red-700"
                >
                  <Trash2 size={15} />
                  Delete
                </button>

                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="flex items-center justify-center px-3 py-3 bg-white text-[#293241] border-2 border-[#0A0A0A] font-bold text-xs sm:text-sm hover:bg-gray-100"
                >
                  Close
                </button>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
