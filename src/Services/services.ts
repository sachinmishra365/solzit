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
    // baseUrl: 'https://solzitessapi.azurewebsites.net/api/V1', //pro

    baseUrl: 'https://solzitessapi-dev.azurewebsites.net/api/V1', //dev
  }),
  tagTypes: ['Hello', 'Hello1', 'attendance','hi','feedback'],

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

    GetBalanceLeaveDashboard: builder.query({
      query: ({data, accessToken}) => ({
        url: `/Dashboard/GetBalanceLeaveDashboard`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    EmployeeLeaveApply: builder.mutation({
      query: ({data, accessToken}) => ({
        url: `/LeaveRecords/ApplyNewLeaveRequest`,
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Hello'],
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
      query: ({attendanceID, accessToken}) => ({
        url: `/EmployeeAttendance/GetAttendanceQuery?AttendanceRecId=${attendanceID}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
      providesTags: ['attendance'],
    }),

    AskEmployeeAttendanceQuery: builder.mutation({
      query: ({data, accessToken}) => {
        return {
          url: `/EmployeeAttendance/CreateAskQueryForAttendance`,
          method: 'POST',
          body: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        };
      },
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
    EmployeeInventoryAllocation: builder.query({
      query: ({accessToken }) => ({
        url: `/EmployeeRecord/GetEmployeeInventoryAllocation/`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    EmployeeSkills: builder.query({
      query: ({accessToken}) => {
        return {
          url: `/Dashboard/GetEmployeeSkills`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),
    
    CreateMyFeedBacks: builder.mutation({
      query: ({data, accessToken}) => {
        return {
          url: `/Feedbacks/CreateMyFeedBacks`,
          method: 'POST',
          body: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        };
      },
      invalidatesTags: ['feedback'],
    }),
    
    GetMyFeedbacksListByEmpId: builder.query({
      query: ({accessToken}) => {
        return {
          url: `/Feedbacks/GetMyFeedbacksListByEmpId`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ['feedback'],
    }),

    GetMyFeedbacksByFeedBackId: builder.query({
      query: ({FeedBackId,accessToken}) => {
        return {
          url: `/Feedbacks/GetMyFeedbacksByFeedBackId?FeedBackId=${FeedBackId}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),
    
    GetListOfOpenPosition: builder.query({
      query: ({accessToken}) => {
        return {
          url: `/HiringRecruitment/GetListOfOpenPosition`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),
    
    CreateCandidateApplication: builder.mutation({
      query: ({data, accessToken}) => {
        return {
          url: `/HiringRecruitment/CreateCandidateApplication`,
          method: 'POST',
          body: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        };
      },
      invalidatesTags: ['hi'],
    }),

    GetCandidateApplicationByEmployeeId: builder.query({
      query: ({accessToken}) => {
        return {
          url: `/HiringRecruitment/GetCandidateApplicationByEmployeeId`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),

    AttachFileInSharePoint: builder.mutation({
      query: ({data, accessToken}) => {
        return {
          url: `/Sharepoint/AttachFileInSharePoint`,
          method: 'POST',
          body: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        };
      },
      invalidatesTags: ['hi'],
    }),

    GetAttachmentFromSharePoint: builder.query({
      query: ({entityId,entityName,accessToken}) => {
        return {
          url: `/Sharepoint/GetAttachmentFromSharePoint?entityId=${entityId}&entityName=${entityName}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),

    GetSoluzioneUpcomingBirthdays: builder.query({
      query: ({entityId,entityName,accessToken}) => {
        return {
          url: `/Dashboard/GetSoluzioneUpcomingBirthdays`,
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
  useGetBalanceLeaveDashboardQuery,
  useEmployeeAppliedLeavesQuery,
  useEmployeeCancelLeavesMutation,
  useProcessedLeavesQuery,
  useForgetpasswordMutation,
  useSoluzioneHolidaysQuery,
  useAttendanceListQuery,
  useAttendanceMonthListMutation,
  useEmployeeAttendanceQueryQuery,
  useAskEmployeeAttendanceQueryMutation,
  useEmployeeLeaveRecordsQuery,
  useEmployeeInventoryAllocationQuery,
  useEmployeeSkillsQuery,
  useCreateMyFeedBacksMutation,
  useGetMyFeedbacksByFeedBackIdQuery,
  useGetMyFeedbacksListByEmpIdQuery,
  useGetListOfOpenPositionQuery,
  useCreateCandidateApplicationMutation,
  useGetCandidateApplicationByEmployeeIdQuery,
  useAttachFileInSharePointMutation,
  useGetAttachmentFromSharePointQuery,
  useGetSoluzioneUpcomingBirthdaysQuery,

} = services;
