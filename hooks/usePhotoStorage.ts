import { useState, useCallback } from 'react';
import { Photo } from '../types';

export const usePhotoStorage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add a new photo - just adds to memory state
  const addPhoto = useCallback(async (photo: Photo) => {
    try {
      // Add to state memory only, no persisting
      const newPhoto: Photo = {
        ...photo,
        timestamp: Date.now(),
      };

      setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
      return newPhoto;
    } catch (err) {
      console.error('Failed to add photo:', err);
      setError('Failed to add photo');
      return null;
    }
  }, []);

  // Delete a photo
  const deletePhoto = useCallback(async (photoToDelete: Photo) => {
    try {
      // Remove from state only
      setPhotos(currentPhotos =>
        currentPhotos.filter(p => p.uri !== photoToDelete.uri)
      );
      return true;
    } catch (err) {
      console.error('Failed to delete photo:', err);
      setError('Failed to delete photo');
      return false;
    }
  }, []);

  // Delete a photo by index
  const deletePhotoByIndex = useCallback(async (index: number) => {
    if (index < 0 || index >= photos.length) {
      setError('Invalid photo index');
      return false;
    }

    try {
      const newPhotos = [...photos];
      newPhotos.splice(index, 1);
      setPhotos(newPhotos);
      return true;
    } catch (err) {
      console.error('Failed to delete photo:', err);
      setError('Failed to delete photo');
      return false;
    }
  }, [photos]);

  // Clear all photos
  const clearAllPhotos = useCallback(() => {
    setPhotos([]);
    return true;
  }, []);

  // Load photos - now just returns the in-memory photos
  const loadPhotos = useCallback(() => {
    return photos;
  }, [photos]);

  return {
    photos,
    isLoading,
    error,
    addPhoto,
    deletePhoto,
    deletePhotoByIndex,
    clearAllPhotos,
    refreshPhotos: loadPhotos
  };
}; 