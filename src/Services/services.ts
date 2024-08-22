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
export const services = createApi({
  reducerPath: 'parsApi',
  baseQuery: axiosBaseQuery({baseUrl: 'https://devportalapi.solzit.com/api'}),
  tagTypes: ['Hello', 'Hello1'],

  endpoints: builder => ({
    userAuthenticationlogin: builder.mutation({
      query: data => ({
        url: `/EmployeeAuthorization/AuthorizeEmployee`,
        method: 'POST',
        body: data,
      }),
    }),

    EmployeeAppliedLeaves: builder.query({
      query: data => ({
        url: `/EmployeeLeaveRecords/AppliedLeaveRecordList/${data?.ids}`,
        method: 'GET',
      }),
      providesTags: ['Hello'],
    }),

    EmployeeLeaveApply: builder.mutation({
      query: data => ({
        url: `/EmployeeLeaveRecords/NewLeaveRequest/?${data?.id}&${data.module}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Hello'],
    }),

    ProcessedLeaves: builder.query({
      query: data => ({
        url: `/EmployeeLeaveRecords/AcceptedLeaveRecordList/${data.Id}`,
        method: 'GET',
        body: data,
      }),
      providesTags: ['Hello1'],
    }),

    EmployeeCancelLeaves: builder.mutation({
      query: data => ({
        url: `/EmployeeLeaveRecords/CancelLeave`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Hello1'],
    }),

    Forgetpassword: builder.mutation({
      query: data => ({
        url: `EmployeeAuthorization/ForgotPassword`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useUserAuthenticationloginMutation,
  useEmployeeLeaveApplyMutation,
  useEmployeeAppliedLeavesQuery,
  useEmployeeCancelLeavesMutation,
  useProcessedLeavesQuery,
  useForgetpasswordMutation,
} = services;
