"use client";
import { useState, useEffect, useRef } from "react";

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function LocationSearchInput({ 
  value, 
  onChange, 
  placeholder = "Cari lokasi penjemputan..." 
}: { 
  value: string; 
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<SearchResult[]>([]);
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

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Search using OpenStreetMap Nominatim
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2 && !query.startsWith("{")) {
        setIsSearching(true);
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=id`)
          .then(res => res.json())
          .then((data) => {
            setResults(data);
            setIsSearching(false);
            setShowDropdown(true);
          })
          .catch(() => setIsSearching(false));
      } else if (query.length === 0) {
        // Show default popular pickup points when empty
        setResults([
          { place_id: 1, display_name: "Stasiun Bandung", lat: "-6.9146", lon: "107.6022" },
          { place_id: 2, display_name: "Bandara Husein Sastranegara", lat: "-6.9005", lon: "107.5755" },
          { place_id: 3, display_name: "Stasiun Kiaracondong", lat: "-6.9248", lon: "107.6465" },
          { place_id: 4, display_name: "Terminal Cicaheum", lat: "-6.9030", lon: "107.6534" },
          { place_id: 5, display_name: "Terminal Leuwipanjang", lat: "-6.9463", lon: "107.5947" },
        ]);
        if (document.activeElement === wrapperRef.current?.querySelector('input')) {
          setShowDropdown(true);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500); // Reduced delay to 500ms for faster feel

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    const shortName = result.display_name.split(',').slice(0, 3).join(','); // Take first 3 parts to keep it concise
    setQuery(shortName);
    setShowDropdown(false);
    
    // Pass stringified JSON to the parent form so it saves both name and coordinates
    const payload = JSON.stringify({
      name: shortName,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon)
    });
    onChange(payload);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        onFocus={() => {
          if (query.length === 0) {
            setResults([
              { place_id: 1, display_name: "Stasiun Bandung", lat: "-6.9146", lon: "107.6022" },
              { place_id: 2, display_name: "Bandara Husein Sastranegara", lat: "-6.9005", lon: "107.5755" },
              { place_id: 3, display_name: "Stasiun Kiaracondong", lat: "-6.9248", lon: "107.6465" },
              { place_id: 4, display_name: "Terminal Cicaheum", lat: "-6.9030", lon: "107.6534" },
              { place_id: 5, display_name: "Terminal Leuwipanjang", lat: "-6.9463", lon: "107.5947" },
            ]);
            setShowDropdown(true);
          } else if (results.length > 0) {
            setShowDropdown(true);
          }
        }}
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
        <ul className="absolute z-50 w-full mt-1 bg-white border border-line rounded shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <li 
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="px-4 py-3 hover:bg-paper cursor-pointer border-b border-line last:border-0 text-sm text-ink text-left"
            >
              <div className="font-semibold text-pine-dark">{result.display_name.split(',')[0]}</div>
              <div className="text-xs text-ink-soft mt-0.5 truncate">{result.display_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
