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

export const DashboardApi = createApi({
  reducerPath: 'DashboardApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://solzitessapi-dev.azurewebsites.net/api/V1', //dev
    // baseUrl: 'https://solzitessapi.azurewebsites.net/api/V1', //pro
  }),

  endpoints: builder => ({

    GetTimeLoggedLastWeek: builder.query({
      query: ({data, accessToken}) => ({
        url: `/Dashboard/GetTimeLoggedLastWeek`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    GetTimeLoggedThisWeek: builder.query({
      query: ({data, accessToken}) => ({
        url: `/Dashboard/GetTimeLoggedThisWeek`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    GetBalanceLeaveDashboard: builder.query({
      query: ({data, accessToken}) => ({
        url: `/Dashboard/GetBalanceLeaveDashboard`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    
  }),
});

export const {
  useGetTimeLoggedLastWeekQuery,
  useGetTimeLoggedThisWeekQuery,
  useGetBalanceLeaveDashboardQuery,
} = DashboardApi;
