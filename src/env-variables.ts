export const EnvVariables = {
  mapTilerKey: import.meta.env.VITE_MAP_TILER_KEY?.toString(),
  firebaseApiKey: import.meta.env.VITE_FIREBASE_API_KEY?.toString(),
  firebaseAuthDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.toString(),
  firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.toString(),
  firebaseStorageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.toString(),
  firebaseMessagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.toString(),
  firebaseAppId: import.meta.env.VITE_FIREBASE_APP_ID?.toString(),
  firebaseMeasurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.toString(),
};
