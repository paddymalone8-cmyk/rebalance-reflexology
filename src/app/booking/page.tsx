'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  depositPrice: number | null;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

type Step = 'service' | 'date' | 'time' | 'details' | 'confirm';

export default function BookingPage() {
  const [step, setStep] = useState<Step>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Fetch services
  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then(setServices)
      .catch(() => setError('Failed to load services'));
  }, []);

  // Fetch available dates when month or service changes
  useEffect(() => {
    if (!selectedService) return;
    fetch(`/api/bookings/slots?month=${calendarMonth}&duration=${selectedService.durationMin}`)
      .then((r) => r.json())
      .then((data) => setAvailableDates(data.dates || []))
      .catch(() => setError('Failed to load dates'));
  }, [calendarMonth, selectedService]);

  // Fetch slots when date changes
  const fetchSlots = useCallback(async (date: string) => {
    if (!selectedService) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/slots?date=${date}&duration=${selectedService.durationMin}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setError('Failed to load time slots');
    } finally {
      setLoading(false);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedDate('');
    setSelectedSlot(null);
    setStep('date');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep('time');
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('details');
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) return;
    if (!clientName.trim() || !clientEmail.trim()) {
      setError('Please fill in your name and email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (pence: number) => `£${(pence / 100).toFixed(2)}`;

  // Calendar rendering
  const renderCalendar = () => {
    const [year, month] = calendarMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthName = new Date(year, month - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dateObj = new Date(year, month - 1, d);
      const isPast = dateObj < today;
      const isAvailable = availableDates.includes(dateStr);
      const isSelected = selectedDate === dateStr;

      days.push(
        <button
          key={d}
          disabled={isPast || !isAvailable}
          onClick={() => handleDateSelect(dateStr)}
          className={`
            aspect-square rounded-xl text-sm font-body transition-all duration-200
            ${isSelected
              ? 'bg-brand-700 text-white shadow-lg shadow-brand-700/30'
              : isAvailable
                ? 'bg-brand-50 text-brand-800 hover:bg-brand-100 hover:shadow-md cursor-pointer'
                : 'text-sage-300 cursor-not-allowed'
            }
            ${isPast ? 'opacity-30' : ''}
          `}
          aria-label={`${d} ${monthName}${isAvailable ? ' — available' : ' — unavailable'}`}
        >
          {d}
        </button>
      );
    }

    const prevMonth = () => {
      const d = new Date(year, month - 2, 1);
      setCalendarMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    };
    const nextMonth = () => {
      const d = new Date(year, month, 1);
      setCalendarMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="btn-ghost p-2" aria-label="Previous month">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4l-6 6 6 6" /></svg>
          </button>
          <h3 className="font-display text-lg text-brand-900">{monthName}</h3>
          <button onClick={nextMonth} className="btn-ghost p-2" aria-label="Next month">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 4l6 6-6 6" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="text-center text-xs font-body text-sage-500 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">{days}</div>
      </div>
    );
  };

  const steps: { key: Step; label: string }[] = [
    { key: 'service', label: 'Service' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'details', label: 'Details' },
    { key: 'confirm', label: 'Confirm' },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="bg-white border-b border-sage-100">
        <div className="section-container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Rebalance Reflexology" width={120} height={36} className="h-8 w-auto" />
          </Link>
          <Link href="/" className="btn-ghost text-xs">
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="section-container py-12 max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl text-brand-900 font-light mb-2">
          Book Your <span className="italic text-brand-600">Session</span>
        </h1>
        <p className="font-body text-sage-600 text-sm mb-8">Choose your treatment and preferred time.</p>

        {/* Progress bar */}
        <div className="flex items-center gap-1 mb-10" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={5}>
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1 flex-1">
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= stepIndex ? 'bg-brand-600' : 'bg-sage-200'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm font-body" role="alert">
            {error}
            <button onClick={() => setError('')} className="ml-2 text-red-500 hover:text-red-700">×</button>
          </div>
        )}

        {/* Step: Service */}
        {step === 'service' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl text-brand-800 mb-4">Choose a treatment</h2>
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className="card w-full text-left p-6 hover:border-brand-400 transition-all group"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-display text-lg text-brand-900 group-hover:text-brand-700 transition-colors">
                    {service.name}
                  </h3>
                  <span className="font-display text-xl text-brand-700 font-semibold">
                    {formatPrice(service.depositPrice || service.price)}
                  </span>
                </div>
                <p className="font-body text-xs text-brand-500 mb-2">{service.durationMin} minutes</p>
                <p className="font-body text-sm text-sage-600">{service.description}</p>
                {service.depositPrice && (
                  <p className="font-body text-xs text-sand-600 mt-2">
                    Deposit: {formatPrice(service.depositPrice)} (full price: {formatPrice(service.price)})
                  </p>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Step: Date */}
        {step === 'date' && (
          <div>
            <button onClick={() => setStep('service')} className="btn-ghost text-xs mb-4">← Change service</button>
            <div className="card p-6 mb-4">
              <p className="font-body text-sm text-sage-600">Selected: <strong className="text-brand-800">{selectedService?.name}</strong></p>
            </div>
            <h2 className="font-display text-xl text-brand-800 mb-4">Pick a date</h2>
            <div className="card p-6">
              {renderCalendar()}
            </div>
            <p className="font-body text-xs text-sage-500 mt-3 text-center">
              Highlighted dates have available slots
            </p>
          </div>
        )}

        {/* Step: Time */}
        {step === 'time' && (
          <div>
            <button onClick={() => setStep('date')} className="btn-ghost text-xs mb-4">← Change date</button>
            <div className="card p-6 mb-4">
              <p className="font-body text-sm text-sage-600">
                {selectedService?.name} ·{' '}
                <strong className="text-brand-800">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </strong>
              </p>
            </div>
            <h2 className="font-display text-xl text-brand-800 mb-4">Choose a time</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-700 rounded-full animate-spin mx-auto" />
                <p className="font-body text-sm text-sage-500 mt-3">Loading times...</p>
              </div>
            ) : slots.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="font-body text-sage-600">No slots available on this date. Please try another.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot.startTime}
                    onClick={() => handleSlotSelect(slot)}
                    className={`card p-4 text-center transition-all ${
                      selectedSlot?.startTime === slot.startTime
                        ? 'border-brand-600 bg-brand-50 shadow-md'
                        : 'hover:border-brand-300'
                    }`}
                  >
                    <span className="font-body text-sm font-semibold text-brand-800">{slot.startTime}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step: Details */}
        {step === 'details' && (
          <div>
            <button onClick={() => setStep('time')} className="btn-ghost text-xs mb-4">← Change time</button>
            <div className="card p-6 mb-6">
              <p className="font-body text-sm text-sage-600">
                {selectedService?.name} ·{' '}
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })} · <strong className="text-brand-800">{selectedSlot?.startTime} – {selectedSlot?.endTime}</strong>
              </p>
            </div>

            <h2 className="font-display text-xl text-brand-800 mb-6">Your details</h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="label">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="input-field"
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="email" className="label">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="phone" className="label">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="input-field"
                  placeholder="Optional"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="notes" className="label">Any notes for the therapist</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Anything we should know? (optional)"
                  maxLength={500}
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!clientName.trim() || !clientEmail.trim()) {
                  setError('Please enter your name and email');
                  return;
                }
                setError('');
                setStep('confirm');
              }}
              className="btn-primary w-full mt-8"
            >
              Review Booking
            </button>
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <div>
            <button onClick={() => setStep('details')} className="btn-ghost text-xs mb-4">← Edit details</button>

            <h2 className="font-display text-xl text-brand-800 mb-6">Confirm your booking</h2>

            <div className="card p-8 space-y-4 mb-8">
              <div className="flex justify-between py-2 border-b border-sage-100">
                <span className="font-body text-sm text-sage-600">Treatment</span>
                <span className="font-body text-sm text-brand-800 font-semibold">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-sage-100">
                <span className="font-body text-sm text-sage-600">Date</span>
                <span className="font-body text-sm text-brand-800 font-semibold">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-sage-100">
                <span className="font-body text-sm text-sage-600">Time</span>
                <span className="font-body text-sm text-brand-800 font-semibold">
                  {selectedSlot?.startTime} – {selectedSlot?.endTime}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-sage-100">
                <span className="font-body text-sm text-sage-600">Name</span>
                <span className="font-body text-sm text-brand-800 font-semibold">{clientName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-sage-100">
                <span className="font-body text-sm text-sage-600">Email</span>
                <span className="font-body text-sm text-brand-800 font-semibold">{clientEmail}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-body text-sm text-sage-600">Amount</span>
                <span className="font-display text-2xl text-brand-700 font-semibold">
                  {selectedService && formatPrice(selectedService.depositPrice || selectedService.price)}
                </span>
              </div>
              {selectedService?.depositPrice && (
                <p className="font-body text-xs text-sand-600">
                  This is a deposit. The remainder ({formatPrice(selectedService.price - selectedService.depositPrice)}) is payable at the session.
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting to payment...
                </span>
              ) : (
                'Proceed to Payment'
              )}
            </button>

            <p className="font-body text-xs text-sage-500 text-center mt-4">
              You&apos;ll be redirected to Stripe for secure payment. Your booking is confirmed once payment is complete.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
