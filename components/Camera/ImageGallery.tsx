import React, { useCallback, useMemo } from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Photo } from '../../types';

interface ImageGalleryProps {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
  onDeletePhoto?: (index: number) => void;
  isLoading?: boolean;
}

// Use React.memo to prevent unnecessary re-renders
export const ImageGallery = React.memo(({
  photos,
  onSelect,
  onDeletePhoto,
  isLoading = false
}: ImageGalleryProps) => {
  // Use useMemo for calculations that shouldn't be recalculated on every render
  const { width } = Dimensions.get('window');
  const imageSize = useMemo(() => (width - 6) / 3, [width]);

  // Use getItemLayout to optimize FlatList rendering
  const getItemLayout = useCallback((_: any, index: number) => ({
    length: imageSize,
    offset: imageSize * Math.floor(index / 3),
    index,
  }), [imageSize]);

  // Memoize the renderItem function to prevent recreating on each render
  const renderItem = useCallback(({ item, index }: { item: Photo, index: number }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity
        onPress={() => onSelect(item)}
        testID="photo-item"
        accessible={true}
        accessibilityLabel={`Photo taken on ${new Date(item.timestamp).toLocaleString()}`}
        accessibilityHint="Double tap to open and zoom into photo"
      >
        <Image
          source={{ uri: item.uri }}
          style={[styles.image, { width: imageSize, height: imageSize }]}
          // Add loading placeholder and error handling
          onError={(e) => console.warn('Image loading error:', e.nativeEvent.error)}
        />
        {item.location && (
          <View style={styles.locationBadge}>
            <MaterialIcons name="location-on" size={12} color="white" />
          </View>
        )}
      </TouchableOpacity>
      {onDeletePhoto && (
        <TouchableOpacity
          style={styles.deleteButton}
          testID={`delete-photo-${index}`}
          onPress={() => confirmDelete(item, index)}
          accessible={true}
          accessibilityLabel="Delete photo"
          accessibilityRole="button"
        >
          <MaterialIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  ), [onSelect, onDeletePhoto, imageSize]);

  // Add confirmation alert before deleting photos
  const confirmDelete = (photo: Photo, index: number) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onDeletePhoto) {
              onDeletePhoto(index);
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading photos...</Text>
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="photo-camera" size={80} color="#ccc" />
        <Text style={styles.emptyText}>No photos yet</Text>
        <Text style={styles.emptySubtext}>Take some photos to see them here</Text>
      </View>
    );
  }

  return (
    <FlatList
      testID="image-gallery"
      data={photos}
      numColumns={3}
      keyExtractor={(item) => item.timestamp.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.gallery}
      // Performance optimizations
      removeClippedSubviews={true}
      initialNumToRender={12}
      maxToRenderPerBatch={6}
      windowSize={7}
      getItemLayout={getItemLayout}
      // Pull to refresh functionality can be added here
      // Handle empty list case
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No photos available</Text>
        </View>
      }
    />
  );
});

const styles = StyleSheet.create({
  gallery: {
    padding: 2,
  },
  imageContainer: {
    position: 'relative',
    margin: 1,
  },
  image: {
    borderRadius: 3,
    // Width and height are set dynamically via inline style
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0, 122, 255, 0.7)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
}); 