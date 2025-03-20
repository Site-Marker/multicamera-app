import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      setLocation(currentLocation);
      setError(null);
    } catch (error) {
      console.log('Error getting location:', error);
      setError('Could not get your location');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        await getLocation();
        if (isMounted) {
          // State updates here if needed
        }
      } catch (error) {
        if (isMounted) {
          setError('Error initializing location');
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [getLocation]);

  const retry = useCallback(() => {
    getLocation();
  }, [getLocation]);

  return { location, error, retry };
}; 