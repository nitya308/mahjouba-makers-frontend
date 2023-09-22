// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// TO-DO: MOVE TO .env
export const firebaseConfig = {
  apiKey: 'AIzaSyCyoy48P6y3tqroDzOlp75vPmGR-T0CiZ0',
  authDomain: 'mahjouba-initiative.firebaseapp.com',
  projectId: 'mahjouba-initiative',
  storageBucket: 'mahjouba-initiative.appspot.com',
  messagingSenderId: '880532850393',
  appId: '1:880532850393:web:0f812d940e3f04b87aa0c8',
  measurementId: 'G-RVWMG7PZXS',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
