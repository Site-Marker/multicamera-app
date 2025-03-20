import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ImageGallery } from '../components/Camera/ImageGallery';

describe('ImageGallery', () => {
  const mockPhotos = [
    {
      uri: 'file://photo1.jpg',
      timestamp: 1615482489000,
      location: { latitude: 40.7128, longitude: -74.0060 }
    }
  ];

  it('renders empty state when no photos', () => {
    const { getByText } = render(
      <ImageGallery photos={[]} onSelect={jest.fn()} />
    );

    expect(getByText('No photos yet')).toBeTruthy();
  });

  it('renders photos when available', () => {
    const { getByTestId } = render(
      <ImageGallery
        photos={mockPhotos}
        onSelect={jest.fn()}
        onDeletePhoto={jest.fn()}
      />
    );

    expect(getByTestId('image-gallery')).toBeTruthy();
  });
}); 