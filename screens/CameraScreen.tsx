import { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Platform, StatusBar, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraComponent } from '../components/Camera/CameraComponent';
import { ImageGallery } from '../components/Camera/ImageGallery';
import { MapViewComponent } from '../components/Map/MapViewComponent';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import ImageView from 'react-native-image-viewing';
import { Photo } from '../types';
import { usePhotoStorage } from '../hooks/usePhotoStorage';
import { PhotoViewer } from '../components/Camera/PhotoViewer';

export default function CameraScreen() {
  const insets = Platform.OS === 'android' ? useSafeAreaInsets() : { top: 0, bottom: 0 };
  const {
    photos,
    addPhoto,
    deletePhotoByIndex,
    isLoading
  } = usePhotoStorage();

  const [showGallery, setShowGallery] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const handlePhotoTaken = useCallback(async (photo: Photo) => {
    const savedPhoto = await addPhoto(photo);
    if (!savedPhoto) {
      Alert.alert('Error', 'Failed to save photo');
    }
  }, [addPhoto]);

  const handleDeletePhoto = useCallback(async (index: number) => {
    const success = await deletePhotoByIndex(index);
    if (!success) {
      Alert.alert('Error', 'Failed to delete photo');
    }
  }, [deletePhotoByIndex]);

  const handlePhotoSelect = (photo: Photo) => {
    const index = photos.findIndex(p => p.timestamp === photo.timestamp);
    setViewerIndex(index >= 0 ? index : 0);
    setViewerVisible(true);
  };

  const handleClosePhotoView = useCallback(() => {
    setIsImageViewVisible(false);
    setTimeout(() => setSelectedPhoto(null), 300);
  }, []);

  const toggleGallery = useCallback(() => {
    setShowGallery(prev => !prev);
    if (showMap) setShowMap(false);
  }, [showMap]);

  const toggleMap = useCallback(() => {
    setShowMap(prev => !prev);
    if (showGallery) setShowGallery(false);
  }, [showGallery]);

  const backToCamera = useCallback(() => {
    setShowGallery(false);
    setShowMap(false);
  }, []);

  const headerStyle = Platform.OS === 'android'
    ? { ...styles.header, paddingTop: insets.top + 15 }
    : styles.header;

  const cameraContentStyle = Platform.OS === 'android' && !showGallery && !showMap
    ? { ...styles.content, marginTop: insets.top }
    : styles.content;

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'android' && (
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
      )}

      <View style={headerStyle}>
        {(showGallery || showMap) ? (
          <View style={styles.headerWithBack}>
            <TouchableOpacity
              onPress={backToCamera}
              style={styles.backButton}
              testID="back-button"
            >
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {showGallery ? 'Gallery' : 'Map'}
            </Text>
            <View style={{ width: 40 }} />
          </View>
        ) : (
          <Text style={styles.headerTitle}>Camera</Text>
        )}
      </View>

      <View style={cameraContentStyle}>
        {!showGallery && !showMap ? (
          <CameraComponent onPhotoTaken={handlePhotoTaken} />
        ) : showGallery ? (
          <ImageGallery
            photos={photos}
            isLoading={false}
            onDeletePhoto={handleDeletePhoto}
            onSelect={handlePhotoSelect}
          />
        ) : (
          <MapViewComponent
            photos={photos}
            onPhotoSelect={handlePhotoSelect}
          />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, showGallery ? styles.activeButton : {}]}
          onPress={toggleGallery}
        >
          <Ionicons
            name="images"
            size={24}
            color={showGallery ? "#fff" : "#333"}
          />
          <Text style={[styles.footerText, showGallery ? styles.activeText : {}]}>
            Gallery ({photos.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, showMap ? styles.activeButton : {}]}
          onPress={toggleMap}
        >
          <MaterialIcons
            name="map"
            size={24}
            color={showMap ? "#fff" : "#333"}
          />
          <Text style={[styles.footerText, showMap ? styles.activeText : {}]}>
            Map
          </Text>
        </TouchableOpacity>
      </View>

      {selectedPhoto && (
        <ImageView
          images={[{ uri: selectedPhoto.uri }]}
          imageIndex={0}
          visible={isImageViewVisible}
          onRequestClose={handleClosePhotoView}
          swipeToCloseEnabled={true}
          doubleTapToZoomEnabled={true}
          FooterComponent={() => (
            selectedPhoto.location ? (
              <View style={styles.photoLocationInfo}>
                <MaterialIcons name="location-on" size={16} color="white" />
                <Text style={styles.photoLocationText}>
                  {`${selectedPhoto.location.latitude.toFixed(6)}, ${selectedPhoto.location.longitude.toFixed(6)}`}
                </Text>
              </View>
            ) : null
          )}
          presentationStyle="overFullScreen"
        />
      )}

      <PhotoViewer
        photos={photos}
        visible={viewerVisible}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
        onDelete={(index) => {
          deletePhotoByIndex(index);
          if (photos.length <= 1) {
            setViewerVisible(false);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  activeText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  photoLocationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
    marginBottom: 30,
  },
  photoLocationText: {
    color: 'white',
    marginLeft: 5,
  },
  headerWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 8,
  },
}); 