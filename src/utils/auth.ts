import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, AuthCredential } from 'firebase/auth';

const auth = getAuth();

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
