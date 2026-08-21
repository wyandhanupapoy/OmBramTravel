"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });

export function LiveMap({ bookingId, tourName, pickupGeoJson }: { bookingId: string, tourName: string, pickupGeoJson?: string }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [routeLine, setRouteLine] = useState<[number, number][]>([]);
  
  const [carIcon, setCarIcon] = useState<any>(null);
  const [pickupIcon, setPickupIcon] = useState<any>(null);

  useEffect(() => {
    if (pickupGeoJson) {
      try {
        const geo = JSON.parse(pickupGeoJson);
        if (geo.lat && geo.lng) setPickupCoords([geo.lat, geo.lng]);
      } catch(e) {}
    }
  }, [pickupGeoJson]);

  useEffect(() => {
    import("leaflet").then((L) => {
      setCarIcon(L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/741/741407.png",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      }));
      setPickupIcon(L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }));
    });
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`/api/track/latest?bookingId=${bookingId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.lat && data.lng) {
            setPosition([data.lat, data.lng]);
          }
        }
      } catch (err) {}
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 3000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    if (position && pickupCoords) {
      const fetchRoute = async () => {
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${position[1]},${position[0]};${pickupCoords[1]},${pickupCoords[0]}?overview=simplified&geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes[0]) {
            const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
            setRouteLine(coords);
          }
        } catch(e) {}
      };
      fetchRoute();
    }
  }, [position, pickupCoords]);

  const center = position || pickupCoords;

  if (!center) {
    return (
      <div className="w-full h-[400px] bg-line/20 rounded-xl flex items-center justify-center border border-line">
        <div className="text-ink-soft animate-pulse flex flex-col items-center">
          <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Menunggu Sinyal GPS...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border-2 border-line relative z-0">
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {position && carIcon && (
          <Marker position={position} icon={carIcon}>
            <Popup>
              <strong>Driver Tour</strong><br />
              {tourName}
            </Popup>
          </Marker>
        )}

        {pickupCoords && pickupIcon && (
          <Marker position={pickupCoords} icon={pickupIcon}>
            <Popup>
              <strong>Titik Jemput Anda</strong>
            </Popup>
          </Marker>
        )}

        {routeLine.length > 0 && (
          <Polyline positions={routeLine} color="#123024" weight={5} opacity={0.8} />
        )}
      </MapContainer>
    </div>
  );
}
