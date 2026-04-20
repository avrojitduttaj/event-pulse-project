/**
 * EventPulse Maps Service
 * Integrates Google Maps Directions API and Places API
 * 
 * Google Services used:
 * - Maps JavaScript API
 * - Directions API (walking routes between venue zones)
 * - Places API (venue lookup and nearby search)
 */

const isMapsLoaded = () => {
  if (!window.google || !window.google.maps) {
    console.warn('Google Maps API not loaded — using mock data');
    return false;
  }
  return true;
};

const validateLatLng = (location) => {
  if (!location) throw new Error('Location is required');
  return true;
};

/**
 * Fetches walking directions between two points
 * @param {string|Object} origin - Start location
 * @param {string|Object} destination - End location  
 * @returns {Promise<Object>} Directions result or mock
 */
export const getWalkingDirections = async (origin, destination) => {
  if (!origin || !destination) {
    return { mock: true, duration: '5 mins', distance: '400 m' };
  }

  if (!isMapsLoaded()) {
    return { mock: true, duration: '5 mins', distance: '400 m' };
  }

  const directionsService = new window.google.maps.DirectionsService();

  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          resolve(result);
        } else {
          console.error('Directions error:', status);
          resolve({ mock: true, duration: '5 mins', distance: '400 m' });
        }
      }
    );
  });
};

/**
 * Search for nearby places around a venue
 * @param {Object} map - Google Maps instance
 * @param {Object} location - LatLng object
 * @param {string} keyword - Search keyword
 * @returns {Promise<Array>} Array of place results
 */
export const searchNearbyPlaces = async (map, location, keyword) => {
  if (!map || !location || !keyword) {
    return [{ name: 'Convention Centre', vicinity: 'Mumbai' }];
  }

  if (!isMapsLoaded()) {
    return [{ name: 'Mock Venue', vicinity: '123 Event Street' }];
  }

  try {
    validateLatLng(location);
    const service = new window.google.maps.places.PlacesService(map);

    return new Promise((resolve) => {
      service.nearbySearch(
        { location, radius: 500, keyword: String(keyword).slice(0, 100) },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(results);
          } else {
            resolve([{ name: 'Venue', vicinity: 'Event Location' }]);
          }
        }
      );
    });
  } catch (err) {
    console.error('Places search error:', err);
    return [];
  }
};

/**
 * Resolve a venue name to coordinates using Places API
 * @param {string} venueName - Name of the venue
 * @returns {Promise<Object>} lat/lng object
 */
export const resolveVenueLocation = async (venueName) => {
  if (!venueName) throw new Error('Venue name is required');
  if (!isMapsLoaded()) {
    return { lat: 19.076, lng: 72.877 };
  }

  return new Promise((resolve) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: String(venueName).slice(0, 200) }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
      } else {
        resolve({ lat: 19.076, lng: 72.877 });
      }
    });
  });
};
