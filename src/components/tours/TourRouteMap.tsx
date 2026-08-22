"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });

import "leaflet/dist/leaflet.css";

interface StopMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
}

export function TourRouteMap({ stops }: { stops: StopMarker[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Fix Leaflet marker icons in Next.js
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[400px] w-full bg-line animate-pulse rounded-lg flex items-center justify-center">Memuat Peta...</div>;

  const validStops = stops.filter((s) => s.lat && s.lng).sort((a, b) => a.order - b.order);
  
  if (validStops.length === 0) {
    return <div className="h-[400px] w-full bg-pine-dark/5 rounded-lg flex flex-col items-center justify-center border border-line p-6 text-center text-ink-soft">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-50"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      <p>Peta rute belum tersedia untuk tour ini.</p>
    </div>;
  }

  const center: [number, number] = [validStops[0].lat, validStops[0].lng];
  const positions: [number, number][] = validStops.map(s => [s.lat, s.lng]);

  return (
    <div className="h-[450px] w-full rounded-xl overflow-hidden shadow-inner border border-line relative z-10">
      <MapContainer center={center} zoom={11} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {validStops.map((stop, i) => (
          <Marker key={stop.id} position={[stop.lat, stop.lng]}>
            <Popup>
              <div className="font-display font-bold text-sm">Destinasi {i + 1}</div>
              <div className="text-pine-dark">{stop.name}</div>
            </Popup>
          </Marker>
        ))}
        {positions.length > 1 && (
          <Polyline positions={positions} color="#B34B36" weight={3} dashArray="5, 10" opacity={0.8} />
        )}
      </MapContainer>
    </div>
  );
}
