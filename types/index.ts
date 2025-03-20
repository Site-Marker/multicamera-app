// Create a shared types file to prevent duplication
export type Photo = {
  uri: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}; 