"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// React-Leaflet MUST be loaded dynamically to avoid SSR window errors
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export function LiveMap({ bookingId, tourName }: { bookingId: string, tourName: string }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  
  // Custom marker icon (loaded only on client)
  const [carIcon, setCarIcon] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet so we can create custom icons
    import("leaflet").then((L) => {
      // Setup simple car icon (can be replaced with actual image later)
      setCarIcon(L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }));
    });
  }, []);

  useEffect(() => {
    // Function to fetch latest coordinate
    const fetchLocation = async () => {
      try {
        const res = await fetch(`/api/track/latest?bookingId=${bookingId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.lat && data.lng) {
            setPosition([data.lat, data.lng]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch location", err);
      }
    };

    fetchLocation();
    
    // Poll every 10 seconds
    const interval = setInterval(fetchLocation, 10000);
    return () => clearInterval(interval);
  }, [bookingId]);

  if (!position) {
    return (
      <div className="w-full h-[400px] bg-line flex flex-col items-center justify-center rounded-xl border border-line-strong">
        <div className="w-12 h-12 border-4 border-beacon border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-pine-dark font-mono text-sm uppercase tracking-widest animate-pulse">Menunggu Sinyal GPS...</p>
        <p className="text-ink-soft text-xs mt-2">Driver mungkin sedang dalam perjalanan atau sinyal lemah.</p>
      </div>
    );
  }

  // Ensure map only renders when icon is ready
  if (!carIcon) return null;

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-line-strong shadow-inner">
      <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={carIcon}>
          <Popup>
            <div className="font-display text-pine-dark">{tourName}</div>
            <div className="text-xs font-mono">Driver Om Bram En-route</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
