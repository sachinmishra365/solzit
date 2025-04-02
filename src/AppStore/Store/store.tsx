import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';
import { services } from '../../Services/services';
import appStateSlice from '../Reducers/appState';
import { appLevelApi } from '../../Services/appLevel';
import { workloglevelApi } from '../../Services/workloglevel';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  [appLevelApi.reducerPath]: appLevelApi.reducer,
  [services.reducerPath]: services.reducer,
  [workloglevelApi.reducerPath]: workloglevelApi.reducer,
  appState: appStateSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(services.middleware, appLevelApi.middleware, workloglevelApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
