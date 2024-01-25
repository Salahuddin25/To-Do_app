import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../app/pages/profile/actions/profile-slice';
import { todoApi } from '../app/pages/todos/components/todoapi';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    [todoApi.reducerPath]: todoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware),
});