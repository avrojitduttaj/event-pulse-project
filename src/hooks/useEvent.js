import { useState, useEffect } from 'react';
import { signIn } from '../services/firebase';
import { getWalkingDirections } from '../services/maps';

export const useEvent = () => {
  const [user, setUser] = useState(null);
  const [eventData, setEventData] = useState({
     name: "NextGen AI Summit 2026",
     venue: "Moscone Center",
     schedule: [
       { id: "s1", title: "Keynote: AI in 2026", room: "main-hall", startTime: Date.now() + 3600*1000 },
       { id: "s2", title: "React & Systems", room: "room-a", startTime: Date.now() + 7200*1000 }
     ]
  });

  const joinEvent = async () => {
     try {
       const cred = await signIn();
       setUser(cred.user);
       return true;
     } catch (e) {
       console.error("Join event failed:", e);
       return false;
     }
  };

  return { user, eventData, joinEvent };
};

export const useDirections = () => {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRoute = async (origin, dest) => {
     setLoading(true);
     try {
       const res = await getWalkingDirections(origin, dest);
       setRouteData(res);
     } catch(e) {
       console.error(e);
     } finally {
       setLoading(false);
     }
  };

  return { routeData, fetchRoute, loading };
};
