import {createSlice} from '@reduxjs/toolkit';

export const appStateSlice = createSlice({
  name: 'appState',
  initialState: {
    authToken: null,
    appliedLeave: null,
    processed: null,
  },
  reducers: {
    auth: (state, action) => {
      state.authToken = action.payload;
    },
    applied: (state, action) => {
      state.appliedLeave = action.payload;
    },
    processedLeaves: (state, action) => {
      state.processed = action.payload;
    },
  },
});

export const {auth, applied, processedLeaves} = appStateSlice.actions;

export default appStateSlice.reducer;
