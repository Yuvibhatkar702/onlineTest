import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import assessmentsReducer from './slices/assessmentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assessments: assessmentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

// Export types for TypeScript (if needed)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
