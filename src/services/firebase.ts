import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { EnvVariables } from '../env-variables';

const firebaseConfig = {
  apiKey: EnvVariables.firebaseApiKey,
  authDomain: EnvVariables.firebaseAuthDomain,
  projectId: EnvVariables.firebaseProjectId,
  storageBucket: EnvVariables.firebaseStorageBucket,
  messagingSenderId: EnvVariables.firebaseMessagingSenderId,
  appId: EnvVariables.firebaseAppId,
  measurementId: EnvVariables.firebaseMeasurementId,
};

// Initialize Firebase.
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
