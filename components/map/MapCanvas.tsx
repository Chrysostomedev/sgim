"use client";

import { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Ship, AlertTriangle, Anchor, LifeBuoy } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Centre Côte d'Ivoire — golfe de Guinée
const defaultCenter = { lat: 5.25, lng: -4.0 };

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#0B1C2C" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0B1C2C" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#6B8A9E" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0A2A3F" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4A7C9E" }] },
    { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#1E3A4F" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", stylers: [{ visibility: "simplified" }, { color: "#1A3040" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
  ],
};

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  type: "incident" | "navire" | "moyen" | "port";
  title: string;
  subtitle?: string;
  status?: string;
};

const TYPE_ICON: Record<string, string> = {
  incident: "⚠️",
  navire: "🚢",
  moyen: "🛟",
  port: "⚓",
};

type Props = {
  points: MapPoint[];
  selectedId?: string | null;
  onSelect: (point: MapPoint) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
};

export default function MapCanvas({
  points,
  selectedId,
  onSelect,
  center = defaultCenter,
  zoom = 8,
}: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [hovered, setHovered] = useState<MapPoint | null>(null);

  const onLoad = useCallback((m: google.maps.Map) => setMap(m), []);
  const onUnmount = useCallback(() => setMap(null), []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-[#0B1C2C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2790A8]/30 border-t-[#2790A8] rounded-full animate-spin" />
          <p className="text-xs text-white/40">Chargement de la carte…</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {points.map((p) => (
        <Marker
          key={p.id}
          position={{ lat: p.lat, lng: p.lng }}
          onClick={() => onSelect(p)}
          onMouseOver={() => setHovered(p)}
          onMouseOut={() => setHovered(null)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: selectedId === p.id ? 12 : 8,
            fillColor:
              p.type === "incident"
                ? "#B3402F"
                : p.type === "navire"
                ? "#2790A8"
                : p.type === "moyen"
                ? "#39A8C0"
                : "#4A7C9E",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: selectedId === p.id ? 2.5 : 1.5,
          }}
        />
      ))}

      {hovered && (
        <InfoWindow
          position={{ lat: hovered.lat, lng: hovered.lng }}
          onCloseClick={() => setHovered(null)}
          options={{ pixelOffset: new google.maps.Size(0, -12) }}
        >
          <div className="px-1 py-0.5">
            <p className="text-xs font-bold text-slate-900">{hovered.title}</p>
            {hovered.subtitle && (
              <p className="text-[10px] text-slate-500">{hovered.subtitle}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}