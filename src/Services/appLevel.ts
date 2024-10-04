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

// https://solzitesssvc.azurewebsites.net/api

export const appLevelApi = createApi({
  reducerPath: 'AppLevel_SolzitApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://solzitessapi-dev.azurewebsites.net/api/V1/Auth/',
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
      query: data => ({
        url: 'ChangePassword',
        method: 'POST',
        body: data,
      }),
    }),

    ForgotPassword: builder.query({
      query: userEmail => ({
        url: `ForgotPassword?userEmail=${userEmail}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useUserAuthenticationloginMutation,
  useChangePasswordMutation,
  useForgotPasswordQuery,
} = appLevelApi;
