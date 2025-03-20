import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PhotoViewer } from '../components/Camera/PhotoViewer';

// Mock ImageViewing component
jest.mock('react-native-image-viewing', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ visible, HeaderComponent, FooterComponent, onRequestClose, onDelete }) => {
      if (!visible) return null;

      return (
        <View testID="mock-image-viewing">
          {HeaderComponent && <HeaderComponent />}
          <View testID="image-content" />
          {FooterComponent && <FooterComponent />}
          <View testID="mock-controls">
            <View testID="close-control" onTouchEnd={onRequestClose} />
          </View>
        </View>
      );
    }
  };
});

describe('PhotoViewer', () => {
  const mockPhotos = [
    {
      uri: 'file://photo1.jpg',
      timestamp: 1615482489000,
      location: { latitude: 40.7128, longitude: -74.0060 }
    },
    {
      uri: 'file://photo2.jpg',
      timestamp: 1615482490000,
      location: { latitude: 41.8781, longitude: -87.6298 }
    }
  ];

  const mockOnClose = jest.fn();
  const mockOnDelete = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const { getByTestId } = render(
      <PhotoViewer
        photos={mockPhotos}
        visible={true}
        initialIndex={0}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );

    expect(getByTestId('mock-image-viewing')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByTestId } = render(
      <PhotoViewer
        photos={mockPhotos}
        visible={false}
        initialIndex={0}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );

    expect(queryByTestId('mock-image-viewing')).toBeNull();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(
      <PhotoViewer
        photos={mockPhotos}
        visible={true}
        initialIndex={0}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );

    fireEvent(getByTestId('close-control'), 'touchEnd');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows footer with photo information', () => {
    const { getByText } = render(
      <PhotoViewer
        photos={mockPhotos}
        visible={true}
        initialIndex={0}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );

    // Check for timestamp in footer
    const date = new Date(mockPhotos[0].timestamp).toLocaleString();
    expect(getByText(date)).toBeTruthy();

    // Check for location in footer
    const locationText = `📍 ${mockPhotos[0].location.latitude.toFixed(6)}, ${mockPhotos[0].location.longitude.toFixed(6)}`;
    expect(getByText(locationText)).toBeTruthy();
  });
}); 