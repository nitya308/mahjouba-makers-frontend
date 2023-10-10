import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, AuthCredential } from 'firebase/auth';
import { auth } from '../../firebase';
import { GOOGLE_WCID } from '@env';
import { GoogleAuthProvider } from 'firebase/auth';
import Constants from 'expo-constants';

let GoogleSignin: any | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const gsPackage: any = require('@react-native-google-signin/google-signin');
  console.log(gsPackage);
  GoogleSignin = gsPackage.GoogleSignin;
  GoogleSignin.configure({
    webClientId: GOOGLE_WCID,
    offlineAccess: true,
  });
} catch (err) {
  console.log(err);
}

export const userPassSignUp = async (email: string, password: string) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return credential;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const userPassLogin = async (email: string, password: string) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const authorizeCredential = async (cred: AuthCredential) => {
  try {
    const userCred = await signInWithCredential(auth, cred);
    return userCred;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const googleSignIn = async () => {
  if (!GoogleSignin) {
    console.log('google sign in not found');
    return;
  }
  try {
    const { idToken } = await GoogleSignin.signIn();
    const credential = GoogleAuthProvider.credential(idToken);
    await authorizeCredential(credential);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
