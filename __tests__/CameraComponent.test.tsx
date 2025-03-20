import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CameraComponent } from '../components/Camera/CameraComponent';

// Mock dependencies
jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  },
  CameraView: 'CameraView',
}));

jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 0, longitude: 0 },
  }),
}));

describe('CameraComponent', () => {
  it('renders correctly with permissions', async () => {
    const onPhotoTaken = jest.fn();
    const { findByTestId } = render(<CameraComponent onPhotoTaken={onPhotoTaken} />);

    // Wait for permissions check
    const captureButton = await findByTestId('captureButton');
    expect(captureButton).toBeTruthy();
  });
}); 