import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import connectionReducer from './slices/connectionSlice';
import authReducer from './slices/authSlice';
import resourcesReducer from './slices/resourcesSlice';
import userDataReducer from './slices/userDataSlice';
import jobsReducer from './slices/jobsSlice';

export const store = configureStore({
  reducer: {
    connection: connectionReducer,
    auth: authReducer,
    resources: resourcesReducer,
    userData: userDataReducer,
    jobs: jobsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
