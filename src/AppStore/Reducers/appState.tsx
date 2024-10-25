import {createSlice} from '@reduxjs/toolkit';

export const appStateSlice = createSlice({
  name: 'appState',
  initialState: {
    token: null,
    authToken: undefined,
    appliedLeave: null,
    colorScheme: null,
    processed: null,
    authCredential: {},
  },
  reducers: {
    auth: (state, action) => {
      state.authToken = action.payload;
    },
    applied: (state, action) => {
      state.appliedLeave = action.payload;
    },
    theme: (state, action) => {
      state.colorScheme = action.payload;
    },
    processedLeaves: (state, action) => {
      state.processed = action.payload;
    },
    assesstoken: (state, action) => {
      state.token = action.payload;
    },
    credential: (state, action) => {
      state.authCredential = action.payload;
    },
  },
});
export const isDarkTheme = (state: any) =>
  state.appState.colorScheme === 'dark';

export const {auth, applied, theme, processedLeaves, assesstoken, credential} =
  appStateSlice.actions;

export default appStateSlice.reducer;
