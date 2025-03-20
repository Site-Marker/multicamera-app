# React Native Take Home Test - Multicamera Experience

This repository contains an Expo React Natvie application designed to showcase your understanding of core React Native concepts and feature building. 

## Table of Contents

1. [Overview](#overview)
2. [The Assignment](#the-assignment)
3. [Getting Started](#getting-started)
5. [Delivery](#delivery)
5. [Hints](#hints)

## Overview

This is a react native app for taking multiple pictures.\
Users can create enter the camera view - start taking pictures and view those pictures.\
Currently, **you have a bare-bones react native typescript/nativewind app.**

**We want the ability for users to take multiple pictures in a single session and be able to view those pictures.**\

* **Tech Stack:**
    * [Expo](https://expo.dev/)  
    * [React Native](https://reactnative.dev/)
    * [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
    * [React Native Maps](https://docs.expo.dev/versions/latest/sdk/map-view/)
    * [NativeWind](https://www.nativewind.dev/)
     
* **Example finished Application**
  * Check out this loom demo of an example state of a finished application (with all the extras)\
  https://www.loom.com/embed/fc43255982cf4dc7bc69e5e7c78a8039?sid=1afb35a1-3de3-480d-9e53-cd26227d02e0

## The Assignment

Update this application with the necessary changes to allow users to take multiple pictures in a single session, view those pictures, remove those pictures and toggle a map view that show's their current location. 
Create components and structure the app the same way you would to with a Production app. 

### Extra credit

- Add the ability to toggle a map view and see where they are on the map.
- Include Technical Documentation about your changes.
- Show elements on the map that represent the location of the picture taken.
- Include ability to zoom and change to front-facing camera.
- Add tests!

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Site-Marker/multicamera-app.git
   cd multicamera-app
   ```
2. **Checkout a new branch:**
   ```bash
   git checkout -b [your first name]/take-home-assessment
   ```

3. **Setup your local environment with Simulator (hopefully you're already setup to do this):**
   [more here](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated)

4. **Install things:**
   ```bash
   npm install
   npm run ios
   ```

5. **Code:**
    Local application should be live on your simulator - time to code!

## Delivery

When your changes are complete push your new branch and open Pull Request to `main` branch.\
If you decided to include Technical Documentation of your changes please include a link in the PR description.\
Please spend no-more **2 hours on the assignment**.

### Happing coding! Looking forward to see what you came up with :)

## Hints

Camera usage requires permission.

**AI/LLMs:**

Did you use AI tools to help you with this assignment? 

*GREAT!!!*

It's a brave new world of software development and leveraging these tools are imperative.\
Let us know which tools you used and how they helped you find a solution.\



# Technical Documentation - MultiCamera App

## Architecture

### Component Structure

The application follows a modular architecture with specialized components:

```
├── components/
│   ├── Camera/
│   │   ├── CameraComponent.tsx       # Camera capture functionality
│   │   ├── ImageGallery.tsx          # Photo gallery view
│   │   └── PhotoViewer.tsx           # Fullscreen photo viewer with zoom
│   └── Map/
│       ├── MapViewComponent.tsx      # Map view with photo locations
│       └── PhotoMarker.tsx           # Custom map markers for photos
├── hooks/
│   ├── useLocation.ts                # Location services hook
│   └── usePhotoStorage.ts            # Photo storage management
├── screens/
│   └── CameraScreen.tsx              # Main screen combining all components
├── types.ts                          # TypeScript type definitions
└── App.tsx                           # Application entry point
```

### Key Features

1. **Photo Capture with Location Data**
   - Front/back camera toggle
   - Flash control
   - Automatic geo-tagging of photos

2. **Photo Gallery**
   - Grid view of captured photos
   - Delete functionality with confirmation
   - Location indicator for geo-tagged photos

3. **Map Integration**
   - Display of user's current location
   - Custom markers for photos with location data
   - Interactive callouts showing photo previews

4. **Photo Viewer**
   - Fullscreen viewing with photo metadata
   - Pinch-to-zoom and double-tap-to-zoom
   - Swipe navigation between photos
   - Delete capability from viewer

5. **Responsive UI**
   - Platform-specific adaptations for iOS and Android
   - Safe area handling for notches and system UI
   - Tab-based navigation between camera, gallery, and map

## Technical Implementation

### State Management

The application uses React hooks for state management:

- `usePhotoStorage`: Custom hook that manages photo persistence and CRUD operations
- `useLocation`: Handles location permissions and current position tracking
- Component state: Local state for UI elements and component-specific logic

### Location Services

Location data is captured using Expo's Location API:

- Automatic permission handling with user-friendly prompts
- High-accuracy location tracking for precise photo geo-tagging
- Error handling for location services failures

### Camera Implementation

Built with Expo Camera:

- Permission handling for camera and media library
- Integration with location services for geo-tagged photos
- Camera controls for front/back switching and flash

### Map Integration

Implemented with react-native-maps:

- Platform-specific map providers (Google Maps on Android)
- Custom photo markers with preview thumbnails
- Performance optimizations for marker rendering
- Location tracking and centering

### Photo Viewing

Utilizing react-native-image-viewing for advanced functionality:

- Smooth zooming capabilities
- Photo metadata display
- Swipe gestures for navigation
- Custom header and footer components

## Performance Considerations

1. **Optimized Rendering**
   - `React.memo` for component memoization
   - Callback memoization with `useCallback`
   - Derived data caching with `useMemo`

2. **Image Handling**
   - Progressive loading of images
   - Optimized marker rendering with `tracksViewChanges`
   - Animated opacity transitions for smoother UX

3. **Map Performance**
   - Delayed marker updates for iOS
   - Strategic re-rendering through controlled updates
   - Platform-specific optimizations

## Accessibility Features

- Proper testIDs for UI testing
- Accessible components with proper roles and labels
- Clear visual indicators for interactive elements
- Support for screen readers

## Testing Strategy

The application includes comprehensive tests:

- Component tests for all major UI components
- Hook tests for custom hooks
- Proper mocking of platform APIs and third-party libraries
- Test coverage for critical user flows

## Future Improvements

1. **Offline Support**
   - Enhanced caching for offline photo viewing
   - Queued photo uploads when connectivity is restored

2. **Photo Enhancement**
   - Filters and editing capabilities
   - Exposure and focus controls

3. **Social Features**
   - Photo sharing functionality
   - Location-based discovery of shared photos

4. **Performance**
   - Further optimizations for large photo collections
   - Background processing for heavy operations

5. **Advanced Map Features**
   - Clustering for photos taken in similar locations
   - Custom map styles and themes

## Development Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm start
   ```

3. Run tests:
   ```
   npm test
   ```

4. Build for production:
   ```
   npm run prebuild
   npx expo run:android  # for Android
   npx expo run:ios      # for iOS
   ```
