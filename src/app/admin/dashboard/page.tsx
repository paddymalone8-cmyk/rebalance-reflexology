'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Tab = 'bookings' | 'availability' | 'exceptions' | 'services' | 'content';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  amountPaid?: number;
  service: { name: string; durationMin: number };
}

interface AvailabilityRule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface AvailabilityException {
  id: string;
  date: string;
  type: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('bookings');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Bookings state
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [bookingFilter, setBookingFilter] = useState('');

  // Availability state
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [newRule, setNewRule] = useState({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' });

  // Exceptions state
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [newException, setNewException] = useState({ date: '', type: 'BLOCKED' as 'BLOCKED' | 'CUSTOM', startTime: '', endTime: '', reason: '' });

  // Content state
  const [content, setContent] = useState<{ id: string; key: string; value: string }[]>([]);
  const [editingContent, setEditingContent] = useState<Record<string, string>>({});

  // Check auth
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(() => setAuthed(true))
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [router]);

  // Fetch data based on active tab
  const fetchBookings = useCallback(async () => {
    const params = new URLSearchParams();
    if (bookingFilter) params.set('status', bookingFilter);
    const res = await fetch(`/api/admin/bookings?${params}`);
    const data = await res.json();
    setBookings(data);
  }, [bookingFilter]);

  const fetchRules = async () => {
    const res = await fetch('/api/admin/availability');
    setRules(await res.json());
  };

  const fetchExceptions = async () => {
    const res = await fetch('/api/admin/exceptions');
    setExceptions(await res.json());
  };

  const fetchContent = async () => {
    const res = await fetch('/api/admin/content');
    const data = await res.json();
    setContent(data);
    const map: Record<string, string> = {};
    for (const item of data) map[item.key] = item.value;
    setEditingContent(map);
  };

  useEffect(() => {
    if (!authed) return;
    if (tab === 'bookings') fetchBookings();
    if (tab === 'availability') fetchRules();
    if (tab === 'exceptions') fetchExceptions();
    if (tab === 'content') fetchContent();
  }, [tab, authed, fetchBookings]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchBookings();
  };

  const addRule = async () => {
    await fetch('/api/admin/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRule),
    });
    fetchRules();
  };

  const deleteRule = async (id: string) => {
    await fetch(`/api/admin/availability?id=${id}`, { method: 'DELETE' });
    fetchRules();
  };

  const addException = async () => {
    if (!newException.date) return;
    await fetch('/api/admin/exceptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newException),
    });
    fetchExceptions();
    setNewException({ date: '', type: 'BLOCKED', startTime: '', endTime: '', reason: '' });
  };

  const deleteException = async (id: string) => {
    await fetch(`/api/admin/exceptions?id=${id}`, { method: 'DELETE' });
    fetchExceptions();
  };

  const saveContent = async (key: string) => {
    await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: editingContent[key] }),
    });
    fetchContent();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) return null;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'bookings', label: 'Bookings', icon: '📋' },
    { key: 'availability', label: 'Availability', icon: '🕐' },
    { key: 'exceptions', label: 'Blocked Dates', icon: '🚫' },
    { key: 'services', label: 'Services', icon: '💆' },
    { key: 'content', label: 'Content', icon: '✏️' },
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Admin header */}
      <header className="bg-white border-b border-sage-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/logo.png" alt="Rebalance" width={100} height={30} className="h-7 w-auto" />
            </Link>
            <span className="text-xs font-body bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <button onClick={handleLogout} className="btn-ghost text-xs text-red-600 hover:bg-red-50">
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body whitespace-nowrap transition-all ${
                tab === t.key
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-brand-800 hover:bg-brand-50'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* BOOKINGS TAB */}
        {tab === 'bookings' && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h2 className="font-display text-2xl text-brand-900">Appointments</h2>
              <div className="flex gap-1 ml-auto">
                {['', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    className={`px-3 py-1 text-xs rounded-full font-body transition-all ${
                      bookingFilter === f
                        ? 'bg-brand-700 text-white'
                        : 'bg-white text-brand-700 border border-sage-200 hover:bg-brand-50'
                    }`}
                  >
                    {f || 'All'}
                  </button>
                ))}
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="font-body text-sage-500">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-body font-semibold text-brand-900">{b.clientName}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-body ${
                              b.status === 'CONFIRMED'
                                ? 'bg-green-100 text-green-700'
                                : b.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-700'
                                  : b.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-sage-100 text-sage-700'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="font-body text-sm text-sage-600">
                          {b.service.name} · {new Date(b.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {b.startTime}–{b.endTime}
                        </p>
                        <p className="font-body text-xs text-sage-500 mt-1">
                          {b.clientEmail}{b.clientPhone ? ` · ${b.clientPhone}` : ''}
                        </p>
                        {b.notes && <p className="font-body text-xs text-sage-400 mt-1 italic">{b.notes}</p>}
                        {b.amountPaid && (
                          <p className="font-body text-xs text-brand-600 mt-1">Paid: £{(b.amountPaid / 100).toFixed(2)}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {b.status !== 'CONFIRMED' && b.status !== 'CANCELLED' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}
                            className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-body transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {b.status !== 'CANCELLED' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-body transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'COMPLETED')}
                            className="text-xs px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 font-body transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AVAILABILITY TAB */}
        {tab === 'availability' && (
          <div>
            <h2 className="font-display text-2xl text-brand-900 mb-6">Weekly Availability</h2>

            {/* Existing rules */}
            <div className="space-y-2 mb-8">
              {rules.length === 0 ? (
                <p className="font-body text-sage-500 text-sm">No availability rules set yet.</p>
              ) : (
                rules.map((rule) => (
                  <div key={rule.id} className="card p-4 flex items-center justify-between">
                    <div className="font-body text-sm">
                      <span className="font-semibold text-brand-800">{DAYS[rule.dayOfWeek]}</span>
                      <span className="text-sage-600 ml-2">{rule.startTime} – {rule.endTime}</span>
                      {!rule.isActive && <span className="ml-2 text-xs text-red-500">(inactive)</span>}
                    </div>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-body"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new rule */}
            <div className="card p-6">
              <h3 className="font-body font-semibold text-brand-800 mb-4">Add Availability</h3>
              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <label className="label">Day</label>
                  <select
                    value={newRule.dayOfWeek}
                    onChange={(e) => setNewRule({ ...newRule, dayOfWeek: Number(e.target.value) })}
                    className="input-field"
                  >
                    {DAYS.map((d, i) => (
                      <option key={i} value={i}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Start</label>
                  <input
                    type="time"
                    value={newRule.startTime}
                    onChange={(e) => setNewRule({ ...newRule, startTime: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">End</label>
                  <input
                    type="time"
                    value={newRule.endTime}
                    onChange={(e) => setNewRule({ ...newRule, endTime: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex items-end">
                  <button onClick={addRule} className="btn-primary w-full text-xs py-3">
                    Add Rule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXCEPTIONS TAB */}
        {tab === 'exceptions' && (
          <div>
            <h2 className="font-display text-2xl text-brand-900 mb-6">Blocked / Custom Dates</h2>

            <div className="space-y-2 mb-8">
              {exceptions.length === 0 ? (
                <p className="font-body text-sage-500 text-sm">No date exceptions set.</p>
              ) : (
                exceptions.map((ex) => (
                  <div key={ex.id} className="card p-4 flex items-center justify-between">
                    <div className="font-body text-sm">
                      <span className="font-semibold text-brand-800">
                        {new Date(ex.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        ex.type === 'BLOCKED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {ex.type}
                      </span>
                      {ex.type === 'CUSTOM' && ex.startTime && (
                        <span className="ml-2 text-sage-600">{ex.startTime} – {ex.endTime}</span>
                      )}
                      {ex.reason && <span className="ml-2 text-sage-500 italic">{ex.reason}</span>}
                    </div>
                    <button
                      onClick={() => deleteException(ex.id)}
                      className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-body"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="card p-6">
              <h3 className="font-body font-semibold text-brand-800 mb-4">Add Date Exception</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="label">Date</label>
                  <input
                    type="date"
                    value={newException.date}
                    onChange={(e) => setNewException({ ...newException, date: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select
                    value={newException.type}
                    onChange={(e) => setNewException({ ...newException, type: e.target.value as 'BLOCKED' | 'CUSTOM' })}
                    className="input-field"
                  >
                    <option value="BLOCKED">Blocked (day off)</option>
                    <option value="CUSTOM">Custom hours</option>
                  </select>
                </div>
                {newException.type === 'CUSTOM' && (
                  <>
                    <div>
                      <label className="label">Start</label>
                      <input type="time" value={newException.startTime} onChange={(e) => setNewException({ ...newException, startTime: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="label">End</label>
                      <input type="time" value={newException.endTime} onChange={(e) => setNewException({ ...newException, endTime: e.target.value })} className="input-field" />
                    </div>
                  </>
                )}
                <div>
                  <label className="label">Reason</label>
                  <input
                    type="text"
                    value={newException.reason}
                    onChange={(e) => setNewException({ ...newException, reason: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Bank Holiday"
                  />
                </div>
              </div>
              <button onClick={addException} className="btn-primary text-xs mt-4">
                Add Exception
              </button>
            </div>
          </div>
        )}

        {/* SERVICES TAB (view only for now, editing via API) */}
        {tab === 'services' && (
          <div>
            <h2 className="font-display text-2xl text-brand-900 mb-6">Services</h2>
            <p className="font-body text-sm text-sage-500 mb-4">Services can be managed via the seed file or API. A full service editor can be added as a future enhancement.</p>
            <ServicesManager />
          </div>
        )}

        {/* CONTENT TAB */}
        {tab === 'content' && (
          <div>
            <h2 className="font-display text-2xl text-brand-900 mb-6">Site Content</h2>
            <div className="space-y-4">
              {content.map((item) => (
                <div key={item.id} className="card p-5">
                  <label className="label capitalize">{item.key.replace(/_/g, ' ')}</label>
                  <textarea
                    value={editingContent[item.key] || ''}
                    onChange={(e) => setEditingContent({ ...editingContent, [item.key]: e.target.value })}
                    className="input-field resize-none"
                    rows={item.value.length > 100 ? 4 : 2}
                  />
                  <button
                    onClick={() => saveContent(item.key)}
                    className="btn-primary text-xs mt-3 px-4 py-2"
                  >
                    Save
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple services display component
function ServicesManager() {
  const [services, setServices] = useState<Array<{
    id: string; name: string; description: string; durationMin: number; price: number; depositPrice: number | null; isActive: boolean;
  }>>([]);

  useEffect(() => {
    fetch('/api/admin/services').then((r) => r.json()).then(setServices);
  }, []);

  return (
    <div className="space-y-3">
      {services.map((s) => (
        <div key={s.id} className="card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-body font-semibold text-brand-800">{s.name}</h3>
              <p className="font-body text-sm text-sage-600 mt-1">{s.description}</p>
              <p className="font-body text-xs text-sage-500 mt-1">
                {s.durationMin} min · £{(s.price / 100).toFixed(2)}
                {s.depositPrice ? ` (deposit: £${(s.depositPrice / 100).toFixed(2)})` : ''}
              </p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {s.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
