"use client";
import { useState, useEffect, useRef } from "react";
import { getDestinationCategory, allDestinations } from "@/lib/destinationCatalog";

interface DestinationSearchResult {
  name: string;
  category: string;
}

export function DestinationSearchInput({ 
  value, 
  onChange, 
  placeholder = "Cari tempat wisata..." 
}: { 
  value: string; 
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DestinationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Parse initial JSON value if it exists
  useEffect(() => {
    try {
      if (value.startsWith("{")) {
        const parsed = JSON.parse(value);
        setQuery(parsed.name);
      } else {
        setQuery(value);
      }
    } catch(e) {}
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter local destinations
  useEffect(() => {
    if (query.length === 0) {
      setResults(allDestinations.slice(0, 12).map(name => ({ name, category: getDestinationCategory(name) })));
      return;
    }

    if (!value.startsWith("{")) {
      const filtered = allDestinations
        .filter(d => d.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 12)
        .map(name => ({ name, category: getDestinationCategory(name) }));
      setResults(filtered);
    }
  }, [query, value]);

  const handleSelect = async (result: DestinationSearchResult) => {
    setQuery(result.name);
    setShowDropdown(false);
    setIsSearching(true);
    
    // Fetch coordinates silently from OSM
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(result.name + " Bandung")}&format=json&limit=1`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const payload = JSON.stringify({
          name: result.name,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
        onChange(payload);
      } else {
        // Fallback center bandung if not found exactly
        const payload = JSON.stringify({
          name: result.name,
          lat: -6.9175,
          lng: 107.6191
        });
        onChange(payload);
      }
    } catch(e) {
      const payload = JSON.stringify({
        name: result.name,
        lat: -6.9175,
        lng: 107.6191
      });
      onChange(payload);
    }
    setIsSearching(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value); // fallback to raw string
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-line rounded bg-white text-ink placeholder:text-ink-soft focus:outline-none focus:border-pine-dark"
        required
      />
      
      {isSearching && (
        <div className="absolute right-3 top-3.5">
          <svg className="animate-spin h-5 w-5 text-pine" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-line rounded shadow-lg max-h-80 overflow-y-auto">
          <li className="sticky top-0 bg-paper px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-ink-soft border-b border-line">
            {query ? `${results.length} hasil teratas dari ${allDestinations.length} destinasi` : "Destinasi populer Bandung Raya"}
          </li>
          {results.map((result, i) => (
            <li 
              key={i}
              onClick={() => handleSelect(result)}
              className="px-4 py-3 hover:bg-paper cursor-pointer border-b border-line last:border-0 text-sm text-ink text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-pine-dark">{result.name}</div>
                <span className="shrink-0 rounded-full bg-mist px-2 py-0.5 text-[10px] text-pine-dark">{result.category}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
