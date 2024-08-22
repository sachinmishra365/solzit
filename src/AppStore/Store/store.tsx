import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import {setupListeners} from '@reduxjs/toolkit/query';
import {services} from '../../Services/services';
import  appStateSlice  from '../Reducers/appState';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  [services.reducerPath]: services.reducer,
  appState: appStateSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(services.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
