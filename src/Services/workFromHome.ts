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
    // baseUrl: 'https://solzitessapi.azurewebsites.net/api/V1', //pro
  }),

  endpoints: builder => ({
    GetAllWFHRecordList: builder.query({
      query: ({data, accessToken}) => ({
        url: `/LeaveRecords/GetAllWFHRecordList`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    GetOngoingWFHDateList: builder.query({
      query: ({accessToken}) => ({
        url: `/LeaveRecords/GetOngoingWFHDateList`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    GetTodayRemoteEmpAttendance: builder.query({
      query: ({accessToken}) => ({
        url: `/LeaveRecords/GetTodayRemoteEmpAttendance`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    CreateCheckInRequest: builder.mutation({
      query: ({body, accessToken}) => ({
        url: `/LeaveRecords/CreateCheckInRequest`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: body,
      }),
    }),

    UpdateOutTimeRequest: builder.mutation({
      query: ({body, accessToken}) => ({
        url: `/LeaveRecords/UpdateOutTimeRequest`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: body,
      }),
    }),

    CreateBreakInRequest: builder.mutation({
      query: ({body, accessToken}) => ({
        url: `/LeaveRecords/CreateBreakInRequest`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: body,
      }),
    }),

    UpdateBreakOutTimeRequest: builder.mutation({
      query: ({body, accessToken}) => ({
        url: `/LeaveRecords/UpdateBreakOutTimeRequest`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: body,
      }),
    }),

    GetAttendanceInOutDetailsByInOutId: builder.query({
      query: ({data, accessToken}) => ({
        url: `/LeaveRecords/GetAttendanceInOutDetailsByInOutId`,
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
  useGetAllWFHRecordListQuery,
  useGetOngoingWFHDateListQuery,
  useCreateCheckInRequestMutation,
  useUpdateOutTimeRequestMutation,
  useCreateBreakInRequestMutation,
  useUpdateBreakOutTimeRequestMutation,
  useGetAttendanceInOutDetailsByInOutIdQuery,
  useGetTodayRemoteEmpAttendanceQuery
} = workFromHomeApi;
