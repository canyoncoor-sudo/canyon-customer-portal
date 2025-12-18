"use client";

import { useState, useEffect, useRef } from 'react';
import {
  initAutocompleteService,
  initPlacesService,
  searchBusinesses,
  getPlaceDetails,
  isGoogleMapsLoaded,
  mapGooglePlaceToFormData,
  AutocompleteResult,
} from '@/lib/googlePlaces';

interface GoogleBusinessSearchProps {
  onBusinessSelect: (businessData: any) => void;
  disabled?: boolean;
}

export default function GoogleBusinessSearch({ onBusinessSelect, disabled = false }: GoogleBusinessSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initialize Google Maps API
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (isGoogleMapsLoaded()) {
        try {
          autocompleteServiceRef.current = initAutocompleteService();
          placesServiceRef.current = initPlacesService();
          setIsGoogleLoaded(true);
        } catch (err) {
          console.error('Failed to initialize Google Places:', err);
          setError('Failed to initialize Google Places API');
        }
      }
    };

    // Check immediately
    checkGoogleMaps();

    // If not loaded, wait for script to load
    if (!isGoogleMapsLoaded()) {
      const interval = setInterval(() => {
        if (isGoogleMapsLoaded()) {
          checkGoogleMaps();
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || !autocompleteServiceRef.current) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout (debounce 300ms)
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const results = await searchBusinesses(query, autocompleteServiceRef.current!);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search businesses');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSelectBusiness = async (suggestion: AutocompleteResult) => {
    if (!placesServiceRef.current) return;

    setIsLoading(true);
    setShowDropdown(false);
    setQuery(suggestion.structured_formatting.main_text);
    setError('');

    try {
      const placeDetails = await getPlaceDetails(suggestion.place_id, placesServiceRef.current);
      
      if (placeDetails) {
        const formData = mapGooglePlaceToFormData(placeDetails);
        onBusinessSelect(formData);
      }
    } catch (err) {
      console.error('Failed to get place details:', err);
      setError('Failed to load business details');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isGoogleLoaded) {
    return (
      <div style={{
        padding: '12px',
        background: '#FFF3CD',
        border: '1px solid #FFC107',
        borderRadius: '8px',
        color: '#856404',
        fontSize: '14px',
      }}>
        ⚠️ Google Places API is loading... If this persists, check your API key.
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '20px' }} ref={wrapperRef}>
      <div style={{
        background: '#E8F4F8',
        padding: '16px',
        borderRadius: '12px',
        border: '2px solid #567A8D',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '20px' }}>🔍</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#261312' }}>
            Search Google Business
          </h3>
        </div>
        
        <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#454547', lineHeight: 1.5 }}>
          Find and link this professional to their Google Business Profile for verified information.
        </p>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for business name (e.g., Premier Plumbing LLC)"
            disabled={disabled || isLoading}
            style={{
              width: '100%',
              padding: '12px 40px 12px 12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              background: 'white',
            }}
          />
          
          {isLoading && (
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '20px',
            }}>
              ⏳
            </div>
          )}

          {/* Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000,
            }}>
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  onClick={() => handleSelectBusiness(suggestion)}
                  style={{
                    padding: '12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F0F0EE'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div style={{ fontWeight: 600, color: '#261312', marginBottom: '4px' }}>
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div style={{ fontSize: '13px', color: '#454547' }}>
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={{
            marginTop: '8px',
            padding: '8px',
            background: '#FFE5E5',
            border: '1px solid #FF6B6B',
            borderRadius: '6px',
            color: '#C92A2A',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#454547',
          fontStyle: 'italic',
        }}>
          💡 Can't find the business? You can still fill out the form manually below.
        </div>
      </div>
    </div>
  );
}
