import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Animated, NativeSyntheticEvent, ImageErrorEventData } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { Photo } from '../../types';

interface PhotoMarkerProps {
  photo: Photo;
  onPress: () => void;
}

export const PhotoMarker = React.memo(({ photo, onPress }: PhotoMarkerProps) => {
  const opacity = useState(new Animated.Value(0))[0];

  // Safety check for location data
  if (!photo.location) {
    console.warn('Photo missing location data', photo.timestamp);
    return null;
  }

  // Handle image load success
  const handleImageLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  // Handle image load error
  const handleImageError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    console.error('Error loading marker image:', error.nativeEvent.error);
  };

  return (
    <Marker
      coordinate={{
        latitude: Number(photo.location.latitude),
        longitude: Number(photo.location.longitude),
      }}
      title={`Photo from ${new Date(photo.timestamp).toLocaleTimeString()}`}
      onPress={onPress}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={1000}
    >
      <View style={styles.markerContainer}>
        {/* Colored background circle that's always visible */}
        <View style={styles.markerCircle}>
          <View style={styles.innerCircle} />
        </View>

        {/* Photo that fades in when loaded */}
        <Animated.View style={[styles.imageContainer, { opacity }]}>
          <Image
            source={{ uri: photo.uri }}
            style={styles.markerImage}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </Animated.View>
      </View>

      <Callout tooltip>
        <View style={styles.calloutContainer}>
          <Image
            source={{ uri: photo.uri }}
            style={styles.calloutImage}
            resizeMode="cover"
          />
          <Text style={styles.calloutText}>
            {new Date(photo.timestamp).toLocaleString()}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
});

const styles = StyleSheet.create({
  // New unified marker styles
  markerContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  innerCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#007AFF',
  },
  imageContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#f0f0f0',
  },
  markerImage: {
    width: 36,
    height: 36,
  },

  // Callout styles
  calloutContainer: {
    width: 140,
    height: 140,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calloutImage: {
    width: 120,
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
  },
  calloutText: {
    textAlign: 'center',
    fontSize: 12,
  },
}); 