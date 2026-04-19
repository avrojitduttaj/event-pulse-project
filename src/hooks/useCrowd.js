import { useState, useEffect } from 'react';
import { subscribeToPath } from '../services/firebase';

export const useCrowd = () => {
  const [crowdState, setCrowdState] = useState({});

  useEffect(() => {
    // "current" represents the ongoing event id
    const unsubscribe = subscribeToPath(`events/current/crowd`, (snapshot) => {
      if (snapshot.exists && snapshot.exists()) {
        setCrowdState(snapshot.val());
      } else if (snapshot.val) {
         setCrowdState(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  return { crowdState };
};
