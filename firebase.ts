// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  FB_API_KEY,
  FB_AUTH_DOMAIN,
  FB_PROJ_ID,
  FB_STORAGE_BUCKET,
  FB_MSID,
  FB_APP_ID,
  FB_MEASURE_ID,
} from '@env';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// TO-DO: MOVE TO .env
export const firebaseConfig = {
  apiKey: FB_API_KEY,
  authDomain: FB_AUTH_DOMAIN,
  projectId: FB_PROJ_ID,
  storageBucket: FB_STORAGE_BUCKET,
  messagingSenderId: FB_MSID,
  appId: FB_APP_ID,
  measurementId: FB_MEASURE_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
