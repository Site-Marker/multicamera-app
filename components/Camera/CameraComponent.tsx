import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { CameraView } from 'expo-camera';
import { Camera } from 'expo-camera';
import { Photo } from '../../types';

type CameraComponentProps = {
  onPhotoTaken: (photo: Photo) => void;
};

export const CameraComponent: React.FC<CameraComponentProps> = ({ onPhotoTaken }) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState('off');
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const getPermissions = async () => {
      try {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        await Location.requestForegroundPermissionsAsync();

        if (isMounted) {
          setPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
        }
      } catch (error) {
        console.error('Permission error:', error);
        if (isMounted) {
          setPermission(false);
        }
      }
    };

    getPermissions();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      const locationOptions = {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
      };

      const location = await Location.getCurrentPositionAsync(locationOptions);

      const photoWithLocation: Photo = {
        uri: photo.uri,
        location: {
          latitude: Number(location.coords.latitude),
          longitude: Number(location.coords.longitude),
        },
        timestamp: Date.now(),
      };

      onPhotoTaken(photoWithLocation);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert(
        'Photo Error',
        'Failed to capture photo. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [onPhotoTaken]);

  const toggleCameraType = useCallback(() => {
    setCameraType(current => current === 'back' ? 'front' : 'back');
  }, []);

  const toggleFlash = useCallback(() => {
    setFlash(current => current === 'off' ? 'on' : 'off');
  }, []);

  if (permission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (permission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No access to camera or media library</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        enableTorch={flash === 'on'}
      >
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFlash}
            testID="toggleFlash"
          >
            <Ionicons
              name={flash === 'on' ? "flash" : "flash-off"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleCameraType}
            testID="toggleCameraType"
          >
            <MaterialIcons name="flip-camera-android" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            testID="captureButton"
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={{ width: 50 }} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 10,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    borderWidth: 3,
    borderColor: 'white',
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'white',
  },
}); 