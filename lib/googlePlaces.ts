// Utility functions for Google Places API integration

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  photos?: google.maps.places.PlacePhoto[];
  types?: string[];
  url?: string;
  opening_hours?: google.maps.places.PlaceOpeningHours;
  address_components?: google.maps.GeocoderAddressComponent[];
}

export interface AutocompleteResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

/**
 * Initialize Google Places Autocomplete Service
 */
export function initAutocompleteService() {
  if (typeof window === 'undefined' || !window.google) {
    throw new Error('Google Maps API not loaded');
  }
  return new google.maps.places.AutocompleteService();
}

/**
 * Initialize Google Places Service for Place Details
 * Requires a map div element (can be hidden)
 */
export function initPlacesService() {
  if (typeof window === 'undefined' || !window.google) {
    throw new Error('Google Maps API not loaded');
  }
  
  // Create a hidden div for the PlacesService
  let mapDiv = document.getElementById('google-map-hidden');
  if (!mapDiv) {
    mapDiv = document.createElement('div');
    mapDiv.id = 'google-map-hidden';
    mapDiv.style.display = 'none';
    document.body.appendChild(mapDiv);
  }
  
  const map = new google.maps.Map(mapDiv);
  return new google.maps.places.PlacesService(map);
}

/**
 * Search for businesses using Google Places Autocomplete
 */
export async function searchBusinesses(
  query: string,
  autocompleteService: google.maps.places.AutocompleteService
): Promise<AutocompleteResult[]> {
  return new Promise((resolve, reject) => {
    if (!query.trim()) {
      resolve([]);
      return;
    }

    autocompleteService.getPlacePredictions(
      {
        input: query,
        types: ['establishment'],
        componentRestrictions: { country: 'us' },
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const results = predictions.map(p => ({
            place_id: p.place_id,
            description: p.description,
            structured_formatting: {
              main_text: p.structured_formatting.main_text,
              secondary_text: p.structured_formatting.secondary_text || '',
            },
          }));
          resolve(results);
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([]);
        } else {
          reject(new Error(`Autocomplete failed: ${status}`));
        }
      }
    );
  });
}

/**
 * Get detailed information about a place using Place ID
 */
export async function getPlaceDetails(
  placeId: string,
  placesService: google.maps.places.PlacesService
): Promise<GooglePlaceResult | null> {
  return new Promise((resolve, reject) => {
    placesService.getDetails(
      {
        placeId: placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'formatted_phone_number',
          'website',
          'rating',
          'user_ratings_total',
          'photos',
          'types',
          'url',
          'opening_hours',
          'address_components',
        ],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place as GooglePlaceResult);
        } else {
          reject(new Error(`Place details failed: ${status}`));
        }
      }
    );
  });
}

/**
 * Extract photo URL from Google Place
 */
export function getPhotoUrl(
  photos: google.maps.places.PlacePhoto[] | undefined,
  maxWidth: number = 400
): string | null {
  if (!photos || photos.length === 0) return null;
  return photos[0].getUrl({ maxWidth });
}

/**
 * Map Google Place data to professional form fields
 */
export function mapGooglePlaceToFormData(place: GooglePlaceResult) {
  // Extract phone number (remove formatting for consistency)
  const phone = place.formatted_phone_number?.replace(/\D/g, '') || '';
  
  // Get business type/trade from Google types
  const tradeTypes = place.types?.filter(type => 
    !['establishment', 'point_of_interest'].includes(type)
  ) || [];
  const trade = tradeTypes.length > 0 
    ? formatGoogleType(tradeTypes[0]) 
    : '';

  return {
    company_name: place.name,
    address: place.formatted_address,
    phone: formatPhoneNumber(phone),
    email: '', // Google doesn't provide email
    website: place.website || '',
    trade: trade,
    // Google-specific fields
    google_place_id: place.place_id,
    google_business_name: place.name,
    google_rating: place.rating,
    google_total_reviews: place.user_ratings_total,
    google_maps_url: place.url,
    google_profile_photo_url: getPhotoUrl(place.photos),
    google_last_synced: new Date().toISOString(),
    is_google_verified: true,
  };
}

/**
 * Format Google business type into readable trade name
 */
function formatGoogleType(type: string): string {
  const typeMap: Record<string, string> = {
    'electrician': 'Electrical',
    'plumber': 'Plumbing',
    'general_contractor': 'General Contractor',
    'roofing_contractor': 'Roofing',
    'hvac_contractor': 'HVAC',
    'painter': 'Painting',
    'carpenter': 'Carpentry',
    'landscaper': 'Landscaping',
    'locksmith': 'Locksmith',
    'moving_company': 'Moving',
  };
  
  return typeMap[type] || type.split('_').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
}

/**
 * Format phone number to (XXX) XXX-XXXX
 */
function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Check if Google Maps API is loaded
 */
export function isGoogleMapsLoaded(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.google !== 'undefined' && 
         typeof window.google.maps !== 'undefined';
}
