"use client";
import { useState, useEffect } from "react";

interface Booking {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  pickupPoint: string;
  date: Date;
  pax: number;
  status: string;
  tour: { titleId: string };
}

interface DriverDashboardClientProps {
  driver: { id: string; name: string; vehicle: any };
  bookings: Booking[];
}

export function DriverDashboardClient({ driver, bookings }: DriverDashboardClientProps) {
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [tracking, setTracking] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Auto-detect if any booking is already en-route
  useEffect(() => {
    const enRouteBooking = bookings.find(b => b.status === "en-route");
    if (enRouteBooking) {
      setActiveBookingId(enRouteBooking.id);
      setTracking(true);
    }
  }, [bookings]);

  useEffect(() => {
    let watchId: number;

    if (tracking && activeBookingId) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude, speed, heading } = position.coords;
            // Send to our backend API quietly
            try {
              await fetch("/api/driver/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  bookingId: activeBookingId,
                  lat: latitude,
                  lng: longitude,
                  speed,
                  heading
                })
              });
              setLocationError("");
            } catch (err) {
              console.error("Failed to send location");
            }
          },
          (error) => {
            setLocationError("GPS signal lost. Please check permissions.");
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      } else {
        setLocationError("Geolocation is not supported by this browser.");
      }
    }

    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [tracking, activeBookingId]);

  const handleStartTrip = async (bookingId: string) => {
    setTracking(true);
    setActiveBookingId(bookingId);
    
    // Update booking status in DB
    await fetch("/api/driver/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, status: "en-route" })
    });
  };

  const handleEndTrip = async (bookingId: string) => {
    if (!confirm("Akhiri perjalanan ini?")) return;
    
    setTracking(false);
    setActiveBookingId(null);
    
    await fetch("/api/driver/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, status: "completed" })
    });
    
    window.location.reload(); // Refresh list
  };

  return (
    <div className="pb-24">
      {/* Header Mobile */}
      <div className="bg-pine-dark text-paper p-6 rounded-b-[2rem] shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display uppercase tracking-wide text-beacon text-xl">Om Bram Driver</h1>
          <button onClick={() => { document.cookie = "driver_session=; path=/; max-age=0"; window.location.href = "/driver/login"; }} className="text-sm opacity-70">Keluar</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-xl font-bold">
            {driver.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-medium">{driver.name}</h2>
            <p className="text-sm opacity-70 font-mono">{driver.vehicle?.name} • {driver.vehicle?.plate}</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <h3 className="font-display text-xl text-pine-dark mb-4">Tugas Mendatang</h3>
        
        {locationError && (
          <div className="bg-rust/10 border border-rust/20 text-rust p-3 rounded-lg text-sm mb-4">
            {locationError}
          </div>
        )}

        {bookings.map(b => (
          <div key={b.id} className={`bg-card border ${activeBookingId === b.id ? 'border-beacon shadow-lg' : 'border-line'} rounded-2xl overflow-hidden`}>
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono font-bold bg-line px-2 py-1 rounded uppercase">{b.orderCode}</span>
                <span className="text-xs text-ink-soft">{new Date(b.date).toLocaleDateString('id-ID')}</span>
              </div>
              <h4 className="font-display text-lg text-pine-dark mb-1">{b.tour.titleId}</h4>
              <p className="text-sm font-medium mb-4">{b.customerName} • {b.pax} Penumpang</p>
              
              <div className="bg-paper p-3 rounded-lg text-sm flex gap-3 items-start border border-line">
                <div className="mt-0.5 text-beacon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <div className="font-medium">Titik Jemput:</div>
                  <div className="text-ink-soft">{b.pickupPoint}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-paper border-t border-line flex gap-3">
              <a href={`https://wa.me/${b.customerPhone}`} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-2 py-3 border border-pine-dark text-pine-dark rounded-xl font-medium text-sm">
                Hubungi Tamu
              </a>
              
              {activeBookingId === b.id ? (
                <button onClick={() => handleEndTrip(b.id)} className="flex-1 py-3 bg-rust text-white rounded-xl font-display uppercase tracking-wide text-sm shadow-md animate-pulse">
                  Akhiri Trip
                </button>
              ) : (
                <button 
                  onClick={() => handleStartTrip(b.id)} 
                  disabled={tracking && activeBookingId !== b.id}
                  className="flex-1 py-3 bg-beacon text-pine-dark rounded-xl font-display uppercase tracking-wide text-sm shadow-md disabled:opacity-50"
                >
                  Mulai Trip
                </button>
              )}
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-10 text-ink-soft">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 opacity-50"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <p>Tidak ada tugas penjemputan baru saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
