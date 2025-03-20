import { renderHook, act } from '@testing-library/react-hooks';
import { usePhotoStorage } from '../hooks/usePhotoStorage';

describe('usePhotoStorage', () => {
  it('initializes with empty photos array', () => {
    const { result } = renderHook(() => usePhotoStorage());

    expect(result.current.photos).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('adds a photo', async () => {
    const { result } = renderHook(() => usePhotoStorage());

    const mockPhoto = {
      uri: 'file://test.jpg',
      location: { latitude: 40.7128, longitude: -74.0060 },
      timestamp: Date.now(),
    };

    await act(async () => {
      await result.current.addPhoto(mockPhoto);
    });

    expect(result.current.photos.length).toBe(1);
  });

  it('deletes a photo by index', async () => {
    const { result } = renderHook(() => usePhotoStorage());

    const mockPhoto = {
      uri: 'file://test.jpg',
      location: { latitude: 40.7128, longitude: -74.0060 },
      timestamp: Date.now(),
    };

    await act(async () => {
      await result.current.addPhoto(mockPhoto);
      await result.current.deletePhotoByIndex(0);
    });

    expect(result.current.photos.length).toBe(0);
  });
}); 