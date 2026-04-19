import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useCrowd } from '../../hooks/useCrowd';
import { crowdScoreToWeight } from '../../utils/crowdScore';

export const CrowdHeatmap = () => {
  const map = useMap();
  const visualization = useMapsLibrary('visualization');
  const { crowdState } = useCrowd();
  const [heatmap, setHeatmap] = useState(null);

  useEffect(() => {
    if (!map || !visualization || !window.google) return;

    // Hardcoded coords for demo rooms 
    const zones = {
      'room-a': { lat: 37.784, lng: -122.402 },
      'room-b': { lat: 37.785, lng: -122.403 },
      'main-hall': { lat: 37.786, lng: -122.401 }
    };

    const dataPoints = Object.keys(crowdState).map(key => {
      const parts = key.split('/');
      const room = parts[parts.length-1];
      if (zones[room]) {
        return {
          location: new window.google.maps.LatLng(zones[room].lat, zones[room].lng),
          weight: crowdScoreToWeight(crowdState[key].density)
        };
      }
      return null;
    }).filter(p => p !== null);

    if (heatmap) {
      heatmap.setMap(null);
    }
    
    if (dataPoints.length > 0) {
      const gradient = [
        "rgba(0, 255, 255, 0)",
        "rgba(20, 184, 166, 1)", 
        "rgba(245, 158, 11, 1)",
        "rgba(239, 68, 68, 1)"
      ];
      
      const newLayer = new window.google.maps.visualization.HeatmapLayer({
        data: dataPoints,
        map: map,
        radius: 40,
        gradient: gradient,
        opacity: 0.8
      });
      setHeatmap(newLayer);
    }

    return () => {
      if (heatmap) heatmap.setMap(null);
    };
  }, [map, visualization, crowdState]);

  return null;
};

export const VenueMap = ({ center, zoom = 17, children }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  if (!apiKey || apiKey.includes('YOUR_')) {
    return (
      <div className="w-full h-64 bg-gray-900 rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/40 to-blue-900/40 opacity-50"></div>
         <div className="relative text-center p-6">
           <svg className="w-12 h-12 text-teal-500 mx-auto mb-3 opacity-80 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
           </svg>
           <span className="text-gray-300 font-medium">Mock Venue Map Loaded</span>
           <p className="text-xs text-gray-500 mt-2">Add Google Maps API Key to enable real interactive map & heatmap.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-white/10 shadow-lg relative z-0">
      <APIProvider apiKey={apiKey}>
        <Map defaultCenter={center} defaultZoom={zoom} disableDefaultUI={true} mapId="DEMO_MAP_ID">
          {children}
        </Map>
      </APIProvider>
    </div>
  );
};
