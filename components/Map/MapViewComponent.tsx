import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text, Image, Platform, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { Photo } from '../../types';
import { useLocation } from '../../hooks/useLocation';
import { PhotoMarker } from './PhotoMarker';

// Add this type definition at the top of your file
type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface MapViewComponentProps {
  photos: Photo[];
  onPhotoSelect: (photo: Photo) => void;
}

// Extract shared UI components 
const LocationMarker = React.memo(({ icon, color }: { icon: MaterialIconName; color: string }) => (
  <View style={[styles.marker, { backgroundColor: color }]}>
    <MaterialIcons name={icon} size={20} color="white" />
  </View>
));

const EmptyStateOverlay = ({ icon, title, subtitle }: { icon: MaterialIconName; title: string; subtitle: string }) => (
  <View style={styles.overlay}>
    <MaterialIcons name={icon} size={40} color="#ccc" />
    <Text style={styles.overlayTitle}>{title}</Text>
    <Text style={styles.overlaySubtitle}>{subtitle}</Text>
  </View>
);

export const MapViewComponent: React.FC<MapViewComponentProps> = React.memo(({ photos, onPhotoSelect }) => {
  const { location, error, retry } = useLocation();
  const [isMapReady, setIsMapReady] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Handle marker press with useCallback to prevent recreating function
  const handleMarkerPress = useCallback((photo: Photo) => {
    onPhotoSelect(photo);
  }, [onPhotoSelect]);

  // Filter photos with location using useMemo to cache result
  const photosWithLocation = useMemo(() =>
    photos.filter(photo => photo.location != null),
    [photos]);

  // Memoize initial region to avoid recalculations
  const initialRegion: Region | undefined = useMemo(() => {
    if (!location) return undefined;

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }, [location]);

  const handleMapReady = useCallback(() => setIsMapReady(true), []);

  // Add this before rendering the markers
  useEffect(() => {
    if (photos.length > 0) {
      const withLocation = photos.filter(p => p.location);
      console.log(`Photos with location: ${withLocation.length}/${photos.length}`);

      // Log the first photo with location for debugging
      if (withLocation.length > 0) {
        console.log('Sample photo location:', withLocation[0].location);
      }
    }
  }, [photos]);

  // Add this debug function
  const logMapStatus = useCallback(() => {
    // Check if coordinates are valid numbers
    if (photosWithLocation.length > 0) {
      const sample = photosWithLocation[0];
    }
  }, [isMapReady, photosWithLocation]);

  // Call it when map is ready
  useEffect(() => {
    if (isMapReady) {
      logMapStatus();
    }
  }, [isMapReady, logMapStatus]);

  // Use an effect to periodically force redrawing markers on iOS
  useEffect(() => {
    if (Platform.OS === 'ios' && isMapReady && photosWithLocation.length > 0) {
      // Force marker updates with delay
      const timer = setTimeout(() => {
        setForceUpdate(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isMapReady, photosWithLocation.length]);

  // Render different states
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Alert.alert(
              'Location Required',
              'This app needs location permissions to show photos on the map.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Try Again', onPress: retry }
              ]
            );
          }}
          accessibilityRole="button"
          accessibilityLabel="Retry getting location"
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Getting location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        testID="map-view"
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={initialRegion}
        zoomEnabled
        showsUserLocation
        showsMyLocationButton
        showsCompass
        rotateEnabled
        loadingEnabled
        onMapReady={handleMapReady}
        accessible
        accessibilityLabel="Map showing photo locations"
      >
        {isMapReady && (
          <>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
            >
              <LocationMarker icon="my-location" color="#4285F4" />
            </Marker>

            {photosWithLocation.map((photo) => (
              <PhotoMarker
                key={`${photo.timestamp}-${forceUpdate}`}
                photo={photo}
                onPress={() => handleMarkerPress(photo)}
              />
            ))}
          </>
        )}
      </MapView>

      {photosWithLocation.length === 0 && (
        <EmptyStateOverlay
          icon="photo-camera"
          title="No photos with location data"
          subtitle="Take photos to see them on the map"
        />
      )}
    </View>
  );
});

// Consolidated styles with semantic names
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
  marker: {
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  photoMarkerContainer: {
    alignItems: 'center',
  },
  photoThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  photoMarkerPin: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#007AFF',
    transform: [{ rotate: '180deg' }],
    marginTop: -2,
    zIndex: -1,
  },
  calloutContainer: {
    width: 140,
    height: 140,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  calloutImage: {
    width: 120,
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  calloutText: {
    textAlign: 'center',
    fontSize: 12,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    top: '40%',
  },
  overlayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#666',
  },
  overlaySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
}); 