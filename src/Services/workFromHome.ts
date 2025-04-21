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

export const workFromHomeApi = createApi({
  reducerPath: 'workFromHomeApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://solzitessapi-dev.azurewebsites.net/api/V1', //dev
    // baseUrl: 'https://solzitessapi-dev.azurewebsites.net/api/V1', //pro
  }),

  endpoints: builder => ({
    GetAppliedWFHRecordList: builder.query({
        query: ({data, accessToken}) => ({
          url: `/LeaveRecords/GetAppliedWFHRecordList`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }),
      }),

      GetOngoingWFHDateList: builder.query({
        query: ({data, accessToken}) => ({
          url: `/LeaveRecords/GetOngoingWFHDateList`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }),
      }),


      GetAllWFHRecordList: builder.query({
        query: ({data, accessToken}) => ({
          url: `/LeaveRecords/GetAllWFHRecordList`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }),
      }),


  }),
});

export const {
    useGetAppliedWFHRecordListQuery,
    useGetOngoingWFHDateListQuery,
    useGetAllWFHRecordListQuery,
    } = workFromHomeApi;