/* eslint-disable @typescript-eslint/indent */
import { PayloadAction, createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import { SERVER_URL } from 'utils/constants.js';
import axios from 'axios';
import { getBearerToken, setBearerToken } from 'utils/asyncStorage';
import { UserScopes } from 'types/user';
import { auth } from '../../../firebase';
import { User as FBUser, signOut } from 'firebase/auth';
import { RootState } from 'redux/store';

export interface AuthState {
  authenticated: boolean
  loading: boolean
  id: string
  email: string
  name: string
  role: UserScopes
  fbUserRef: FBUser | null
}

const initialState: AuthState = {
  authenticated: false,
  loading: false,
  id: '',
  email: '',
  name: '',
  role: UserScopes.Uninitialized,
  fbUserRef: null,
};

interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    // no password
    name: string
    role: UserScopes
  }
}

export const setCredentials = createAsyncThunk(
  'setCredentials',
  async (token: string) => {
    await setBearerToken(token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
);

export const initCredentials = createAsyncThunk(
  'initCredentials',
  async (req: unknown, { dispatch }) => {
    await getBearerToken().then((token: string | null | undefined) => {
      if (token) {
        dispatch(setCredentials(token));
      } else {
        dispatch(logout({}));
      }
    });
  },
);

export const logout = createAsyncThunk(
  'auth/logOut',
  async (req: unknown, { dispatch }) => {
    try {
      dispatch(startAuthLoading());
      await signOut(auth);
      dispatch(setCredentials(''));
      dispatch(stopAuthLoading());
      return true;
    } catch (err) {
      dispatch(stopAuthLoading());
      throw err;
    }
  },
);

export const handleAuthStateChanged = createAsyncThunk('auth/signin',
  async (user: FBUser | null, { dispatch }) => {
    try {
      if (!user) {
        dispatch(handleFirebaseNoAuth());
        return true;
      }
      const token = await user.getIdToken();
      dispatch(setCredentials(token));
      dispatch(handleFirebaseUser(user));
      return true;
    } catch (err) {
      throw err;
    }
  },
);

// export const signUp = createAsyncThunk(
//   'auth/signup',
//   async (credentials: { email: string, password: string, name: string }, { dispatch }) => {
//     dispatch(startAuthLoading());
//     return axios
//       .post(`${SERVER_URL}auth/signup`, credentials)
//       .finally(() => dispatch(stopAuthLoading()))
//       .then((response) => {
//         alert('Sign up successful!');
//         return response.data;
//       })
//       .catch((error) => {
//         console.error('Error when signing up', error);
//         return false;
//       });
//   },
// );

// export const signIn = createAsyncThunk(
//   'auth/signin',
//   async (credentials: { email: string, password: string }, { dispatch }) => {
//     dispatch(startAuthLoading());
//     return axios
//       .post<LoginResponse>(`${SERVER_URL}auth/signin`, credentials)
//       .finally(() => dispatch(stopAuthLoading()))
//       .then((response) => {
//         if (response.status == 403) {
//           // forbidden - not verified
//           return {
//             user: { email: credentials.email },
//             verified: false,
//           };
//         }
//         dispatch(setCredentials(response.data.token));
//         alert('Signed In!');
//         return { ...response.data };
//       })
//       .catch((error) => {
//         alert(
//           'Unable to log in, please ensure your email and password are correct.',
//         );
//         console.error('Error when logging in', error);
//         throw error;
//       });
//   },
// );

// export const jwtSignIn = createAsyncThunk(
//   'auth/jwt-signin',
//   async (req: unknown, { dispatch }) => {
//     const token = await getBearerToken();
//     if (!token) {
//       throw Error('null token');
//     }
    
//     dispatch(startAuthLoading());
//     return axios
//       .get<LoginResponse>(`${SERVER_URL}auth/jwt-signin/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .finally(() => dispatch(stopAuthLoading()))
//       .then((response) => {
//         if (token) {
//           dispatch(setCredentials(token));
//         }
//         return response.data;
//       })
//       .catch((err) => {
//         console.error(err);
//         alert('Your login session has expired.');
//         throw err;
//       });
//   },
// );

// export const logout = createAsyncThunk(
//   'auth/logout',
//   async (req: unknown, { dispatch }) => {
//     dispatch(startAuthLoading());
//     return axios
//       .post(`${SERVER_URL}auth/logout`)
//       .finally(() => dispatch(stopAuthLoading()))
//       .then((response) => {
//         dispatch(setCredentials(''));
//         return response.data;
//       })
//       .catch((err) => {
//         console.error('Logout attempt failed', err);
//         throw err;
//       });
//   },
// );

export const resendCode = createAsyncThunk(
  'auth/resend-code',
  async (req: { id: string, email: string }) => {
    return axios
      .post<LoginResponse>(`${SERVER_URL}auth/resend-code/${req.id}`, req)
      .then((response) => {
        if (response.status === 201) {
          return true;
        }
        return isRejectedWithValue(response.statusText);
      })
      .catch((error) => {
        console.error('Error when sending code', error);
      });
  },
);

export const verify = createAsyncThunk(
  'auth/verify',
  async (req: { id: string, email: string, code: string }) => {
    return axios
      .patch<LoginResponse>(`${SERVER_URL}auth/verify/${req.id}`, req)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error when verifying', error);
      });
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      return { ...state, name: action.payload };
    },
    startAuthLoading: (state) => ({ ...state, loading: true }),
    stopAuthLoading: (state) => ({ ...state, loading: false }),
    handleFirebaseNoAuth: (state) => {
      return {
        ...state,
        id: '',
        email: '',
        authenticated: false,
        role: UserScopes.Uninitialized,
      };
    },
    handleFirebaseUser: (state, action: PayloadAction<FBUser>) => {
      return {
        ...state,
        id: action.payload.uid || '',
        email: action.payload.email || '',
        authenticated: true,
        role: UserScopes.Uninitialized,
        fbUserRef: action.payload,
      };
    },
    setUserInitialized: (state) => {
      return {
        ...state,
        role: UserScopes.User,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, () => {
      alert('Logged out of account');
      return initialState;
    });
    builder.addCase(resendCode.fulfilled, () => {
      alert('Code sent to your email');
    });
    builder.addCase(resendCode.rejected, () => {});
    builder.addCase(verify.fulfilled, (state, action) => {
      if (action.payload != null) {
        setBearerToken(action.payload.token);
        state = ({ ...state, ...action.payload.user });
        state.authenticated = true;
      }
      alert('Your account has been authorized!');
      return state;
    });
  },
});

export const {
  setName,
  startAuthLoading,
  stopAuthLoading,
  handleFirebaseUser,
  handleFirebaseNoAuth,
  setUserInitialized,
} =
  authSlice.actions;
export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
