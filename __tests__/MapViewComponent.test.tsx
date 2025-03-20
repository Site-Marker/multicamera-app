import React from 'react';
import { render } from '@testing-library/react-native';
import { MapViewComponent } from '../components/Map/MapViewComponent';

// Mock hooks and components
jest.mock('../hooks/useLocation', () => ({
  useLocation: () => ({
    location: { coords: { latitude: 40.7128, longitude: -74.0060 } },
    error: null,
    retry: jest.fn(),
  }),
}));

jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Marker: View,
    PROVIDER_GOOGLE: 'google',
  };
});

describe('MapViewComponent', () => {
  const mockPhotos = [
    {
      uri: 'file://photo1.jpg',
      timestamp: 1615482489000,
      location: { latitude: 40.7128, longitude: -74.0060 }
    }
  ];

  it('renders map when location is available', () => {
    const { getByTestId } = render(
      <MapViewComponent photos={mockPhotos} onPhotoSelect={jest.fn()} />
    );

    expect(getByTestId('map-view')).toBeTruthy();
  });
}); 