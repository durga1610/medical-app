import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocationCoords } from '../types';

interface LocationContextType {
  coords: LocationCoords | null;
  status: 'idle' | 'loading' | 'success' | 'denied' | 'unsupported';
  isDemoLocation: boolean;
  requestCurrentLocation: () => void;
  setManualLocation: (lat: number, lng: number, label: string) => void;
  availableDemoPresets: LocationCoords[];
}

const DEFAULT_DEMO_LOCATION: LocationCoords = {
  lat: 12.9352,
  lng: 77.6245,
  label: 'Koramangala 4th Block, Bengaluru'
};

const DEMO_PRESETS: LocationCoords[] = [
  { lat: 12.9352, lng: 77.6245, label: 'Koramangala, Bengaluru' },
  { lat: 12.9784, lng: 77.6408, label: 'Indiranagar 100ft Rd' },
  { lat: 12.9822, lng: 77.6083, label: 'Commercial Street / MG Road' },
  { lat: 12.9250, lng: 77.5938, label: 'Jayanagar 4th Block' },
  { lat: 12.9260, lng: 77.6762, label: 'Bellandur / Outer Ring Rd' }
];

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coords, setCoords] = useState<LocationCoords | null>(() => {
    const saved = localStorage.getItem('mediaccess_location');
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_LOCATION;
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'denied' | 'unsupported'>('idle');
  const [isDemoLocation, setIsDemoLocation] = useState<boolean>(true);

  useEffect(() => {
    if (coords) {
      localStorage.setItem('mediaccess_location', JSON.stringify(coords));
    }
  }, [coords]);

  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus('unsupported');
      return;
    }

    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords: LocationCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Your Current GPS Location'
        };
        setCoords(newCoords);
        setStatus('success');
        setIsDemoLocation(false);
      },
      (error) => {
        console.warn('Geolocation access not granted:', error.message);
        setStatus('denied');
        // Fall back to demo location
        if (!coords) {
          setCoords(DEFAULT_DEMO_LOCATION);
        }
        setIsDemoLocation(true);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const setManualLocation = (lat: number, lng: number, label: string) => {
    setCoords({ lat, lng, label });
    setStatus('success');
    setIsDemoLocation(true);
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        status,
        isDemoLocation,
        requestCurrentLocation,
        setManualLocation,
        availableDemoPresets: DEMO_PRESETS
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
