import { createSlice } from '@reduxjs/toolkit';

export const appStateSlice = createSlice({
  name: 'appState',
  initialState: {
    token: null,
    authToken: undefined,
    appliedLeave: null,
    colorScheme: null,
    processed: null,
    authCredential: {},
    connected: false,
    metadata: [],
    worklogDetails: [],
    BugDetails: [],
    todo: '',
    breakeOutId: '',
    EmployeeList: [],
    FilterEmployeeList: [],
    PMList: [],
    FilterPMList: [],
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
    internet: (state, action) => {
      state.connected = action.payload;
    },
    SetMetaData: (state, action) => {
      state.metadata = action.payload;
    },
    SetWorklogDetails: (state, action) => {
      state.worklogDetails = action.payload;
    },
    SetBugDetails: (state, action) => {
      state.BugDetails = action.payload;
    },
    setToDo: (state, action) => {
      state.todo = action.payload;
    },
    setBreakeOutId: (state, action) => {
      state.breakeOutId = action.payload;
    },
    setEmployeeList: (state, action) => {
      state.EmployeeList = action.payload;
    },
    setFilterEmployeeList: (state, action) => {
      state.FilterEmployeeList = action.payload;
    },
    setPMList: (state, action) => {
      state.PMList = action.payload;
    },
    setFilterPMList: (state, action) => {
      state.FilterPMList = action.payload;
    },
  },
});
export const isDarkTheme = (state: any) =>
  state.appState.colorScheme === 'dark';

export const {
  auth,
  applied,
  theme,
  processedLeaves,
  assesstoken,
  credential,
  internet,
  SetMetaData,
  SetWorklogDetails,
  SetBugDetails,
  setToDo,
  setBreakeOutId,
  setEmployeeList,
  setFilterEmployeeList,
  setPMList,
  setFilterPMList
} = appStateSlice.actions;

export default appStateSlice.reducer;
