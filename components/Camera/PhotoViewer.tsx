import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { MaterialIcons } from '@expo/vector-icons';
import { Photo } from '../../types';

interface PhotoViewerProps {
  photos: Photo[];
  visible: boolean;
  initialIndex?: number;
  onClose: () => void;
  onDelete?: (index: number) => void;
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  photos,
  visible,
  initialIndex = 0,
  onClose,
  onDelete
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Format image objects for the library
  const images = photos.map(photo => ({ uri: photo.uri }));

  // Custom footer component showing timestamp and location
  const Footer = useCallback(() => {
    if (photos.length === 0) return null;

    const currentPhoto = photos[currentIndex];

    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {new Date(currentPhoto.timestamp).toLocaleString()}
        </Text>
        {currentPhoto.location && (
          <Text style={styles.footerText}>
            📍 {currentPhoto.location.latitude.toFixed(6)}, {currentPhoto.location.longitude.toFixed(6)}
          </Text>
        )}
      </View>
    );
  }, [photos, currentIndex]);

  // Custom header with close and delete buttons
  const Header = useCallback(() => (
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <MaterialIcons name="close" size={24} color="white" />
      </TouchableOpacity>

      {onDelete && (
        <TouchableOpacity
          onPress={() => onDelete(currentIndex)}
          style={styles.deleteButton}
        >
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  ), [onClose, onDelete, currentIndex]);

  return (
    <ImageViewing
      images={images}
      imageIndex={initialIndex}
      visible={visible}
      onRequestClose={onClose}
      onImageIndexChange={setCurrentIndex}
      HeaderComponent={Header}
      FooterComponent={Footer}
      swipeToCloseEnabled
      doubleTapToZoomEnabled
    />
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  closeButton: {
    padding: 10,
  },
  deleteButton: {
    padding: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
}); 