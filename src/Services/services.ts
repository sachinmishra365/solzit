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

export const services = createApi({
  reducerPath: 'parsApi',
  baseQuery: axiosBaseQuery({
    // baseUrl: 'https://solzitessapi.azurewebsites.net/api/V1',
    baseUrl: 'https://solzitessapi-dev.azurewebsites.net/api/V1',
  }),
  tagTypes: ['Hello', 'Hello1', 'attendance'],

  endpoints: builder => ({
    EmployeeAppliedLeaves: builder.query({
      query: ({data, accessToken}) => ({
        url: `/LeaveRecords/AppliedLeaveRecordList`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ['Hello'],
    }),

    EmployeeLeaveApply: builder.mutation({
      query: ({data, accessToken}) => {
        return {
          url: `/LeaveRecords/ApplyNewLeaveRequest`,
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          invalidatesTags: ['Hello1'],
        };
      },
    }),

    ProcessedLeaves: builder.query({
      query: ({accessToken}) => ({
        url: `/LeaveRecords/AcceptedLeaveRecordList`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
      providesTags: ['Hello1'],
    }),

    EmployeeCancelLeaves: builder.mutation({
      query: ({data, accessToken}) => ({
        url: `/LeaveRecords/CancelLeaveRequest`,
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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

    SoluzioneHolidays: builder.query({
      query: ({accessToken}) => {
        return {
          url: `/Dashboard/GetSoluzioneHolidaysDashboard/`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),

    // EmployeeAttendanceList: builder.mutation({
    //   query: data => ({
    //     url: `/EmployeeAttendance/EmployeeAttendanceList`,
    //     method: 'POST',
    //     body: data,
    //   }),
    // }),

    AttendanceList: builder.query({
      query: ({accessToken}) => ({
        url: `/LeaveRecords/LeaveBalanceRecordList`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    AttendanceMonthList: builder.mutation({
      query: ({data, accessToken}) => {
        return {
          url: '/EmployeeAttendance/EmployeeAttendanceList',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
      },
    }),

    EmployeeAttendanceQuery: builder.query({
      query: ({attendanceID, accessToken}) => {
        return {
          url: `/EmployeeAttendance/GetAttendanceQuery?AttendanceRecId=${attendanceID}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          // providesTags: ['attendance'],
        };
      },
    }),

    AskEmployeeAttendanceQuery: builder.mutation({
      query: data => ({
        url: `/EmployeeAttendance/AskQueryForAttendance`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['attendance'],
    }),

    EmployeeLeaveRecords: builder.query({
      query: ({monthID, accessToken}) => {
        return {
          url: `/LeaveRecords/LeaveBalanceMonthlyRecordList?EmpYearRecordId=${monthID}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),
  }),
});

export const {
  useEmployeeLeaveApplyMutation,
  useEmployeeAppliedLeavesQuery,
  useEmployeeCancelLeavesMutation,
  useProcessedLeavesQuery,
  useForgetpasswordMutation,
  useSoluzioneHolidaysQuery,
  // useEmployeeAttendanceListMutation,
  useAttendanceListQuery,
  useAttendanceMonthListMutation,
  useEmployeeAttendanceQueryQuery,
  useAskEmployeeAttendanceQueryMutation,
  useEmployeeLeaveRecordsQuery,
} = services;
