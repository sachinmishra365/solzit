import {createApi} from '@reduxjs/toolkit/query/react';
import axios from 'axios';

const axiosBaseQuery = (baseUrl: any) => async (payload: any) => {
  try {
    const result = await axios({
      url: baseUrl?.baseUrl + payload?.url,
      method: payload?.method,
      data: payload?.body,
      headers: payload?.headers,
    });
    return {data: result?.data};
  } catch (axiosError) {
    const err: any = axiosError;
    return {
      error: {
        status: err?.response?.status,
        data: err?.response?.data || err?.message,
      },
    };
  }
};

export const appLevelApi = createApi({
  reducerPath: 'AppLevel_SolzitApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://solzitessapi-dev.azurewebsites.net/api/V1/Auth/', //dev
    // baseUrl: 'https://solzitessapi.azurewebsites.net/api/V1/Auth/', //pro
  }),

  endpoints: builder => ({
    userAuthenticationlogin: builder.mutation({
      query: data => ({
        url: 'Authenticate',
        method: 'POST',
        body: data,
      }),
    }),

    ChangePassword: builder.mutation({
      query: ({data,accessToken}) => ({
        url: 'ChangePassword',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data,
      }),
    }),

    ForgotPassword: builder.query({
      query: userEmail => ({
        url: `ForgotPassword?userEmail=${userEmail}`,
        method: 'GET',
      }),
    }),

    EmployeeUpdateProfile: builder.mutation({
      query: ({data,accessToken}) => ({
        url: `/UpdateDisplayPicture`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data,
      }),
    }),
  }),
});

export const {
  useUserAuthenticationloginMutation,
  useChangePasswordMutation,
  useForgotPasswordQuery,
  useEmployeeUpdateProfileMutation,
} = appLevelApi;
