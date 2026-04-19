// maps.js - A utility layer for interacting with Google Maps APIs (Directions & Places)

/**
 * Fetches walking directions between an origin and destination.
 * Using google.maps.DirectionsService
 * 
 * @param {string | google.maps.LatLng | google.maps.Place} origin 
 * @param {string | google.maps.LatLng | google.maps.Place} destination 
 * @returns {Promise<google.maps.DirectionsResult>}
 */
export const getWalkingDirections = async (origin, destination) => {
  // If no maps instance available globally, we are likely mocking or maps hasn't loaded
  if (!window.google || !window.google.maps) {
    console.warn("Google Maps API not loaded. Using mock directions.");
    return { mock: true, duration: "5 mins", distance: "400 m" };
  }

  const directionsService = new window.google.maps.DirectionsService();

  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          resolve(result);
        } else {
          console.error(`error fetching directions ${result}`);
          reject(status);
        }
      }
    );
  });
};

/**
 * Perform a nearby search for places (e.g., getting info about the venue)
 * @param {google.maps.Map} map 
 * @param {google.maps.LatLng} location 
 * @param {string} keyword 
 * @returns {Promise<Array>}
 */
export const searchNearbyPlaces = async (map, location, keyword) => {
  if (!window.google || !window.google.maps) {
    return [{ name: "Mock Venue", vicinity: "123 Event Street" }];
  }

  const service = new window.google.maps.places.PlacesService(map);
  
  return new Promise((resolve, reject) => {
    service.nearbySearch(
      { location, radius: 500, keyword },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      }
    );
  });
};
