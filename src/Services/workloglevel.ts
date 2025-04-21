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

export const workloglevelApi = createApi({
  reducerPath: 'workloglevelApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://solzitessapi-dev.azurewebsites.net/api/V1', //dev
    // baseUrl: 'https://solzitessapi-dev.azurewebsites.net/api/V1', //pro
  }),
  tagTypes: ['WorkStatus','DayTaskReports','DeleteDayTaskReports'],

  endpoints: builder => ({
    GetToDoListBasedOnFilter: builder.mutation({
      query: ({data, filterId, itemTypeId, accessToken}) => ({
        url: `/ToDos/GetToDoListBasedOnFilter?filter=${filterId}&itemType=${itemTypeId}`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data,
      }),
    }),
    GetEmployeeProjectsList: builder.query({
      query: ({data, accessToken}) => ({
        url: `/ToDos/GetEmployeeProjectsList?IsManager=${false}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
    GetGeneralTaskListInMyProject: builder.query({
      query: ({data, accessToken}) => ({
        url: `/ToDos/GetGeneralTaskListInMyProject`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
    GetActiveItemsInMyProject: builder.query({
      query: ({data, accessToken}) => ({
        url: `/ToDos/GetActiveItemsInMyProject`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
    GetEmployeePriorityList: builder.query({
      query: ({data, accessToken}) => ({
        url: `/Master/GetOptionSet?DropDownName=UserPriority`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
    GetEmployeeWorkStatusList: builder.query({
      query: ({data, accessToken}) => ({
        url: `/Master/GetOptionSet?DropDownName=SolzStatus`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
    GetAllUserStoriesByProjectId: builder.query({
      query: ({data, projectId, accessToken}) => ({
        url: `/ToDos/GetAllUserStoriesByProjectId?projectId=${projectId}&itemType=task`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
    GetEmployeeByProjectId: builder.query({
      query: ({data, projectId, accessToken}) => ({
        url: `/ToDos/GetEmployeeByProjectId?ProjectId=${projectId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
    GetWorkLogsByEmpIdOnTodo: builder.query({
      query: ({toDoId, accessToken}) => ({
        url: `/ToDos/GetWorkLogsByEmpIdOnTodo?ToDoId=${toDoId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),

    GetWorkLogById: builder.query({
      query: ({workLogId, accessToken}) => ({
        url: `/ToDos/GetWorkLogById?WorkLogId=${workLogId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
      providesTags: ['WorkStatus'],
    }),

    CreateNewTodo: builder.mutation({
      query: ({data, accessToken}) => ({
        url: `/ToDos/CreateNewTodo`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: ['WorkStatus'],
    }),
    EditTodo: builder.mutation({
      query: ({data, accessToken}) => ({
        url: `/ToDos/EditToDo`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: ['WorkStatus'],
    }),
    SaveWorkLog: builder.mutation({
      query: ({data, accessToken}) => ({
        url: `/ToDos/SaveWorkLog`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data,
      }),
    }),

    GetMonthlyReportPlansList: builder.query({
      query: ({accessToken}) => {
        return {
          url: `/DayReport/GetMonthlyReportPlansList`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),

    GetDayTaskReportDetails: builder.query({
      query: ({accessToken, Date}) => {
        return {
          url: `/DayReport/GetDayTaskReportDetails?Date=${Date}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ['DayTaskReports',],
    }),
    

    GetToDoDetailsByToDoId: builder.query({
      query: ({accessToken, ItemId}) => {
        return {
          url: `/ToDos/GetToDoDetailsByToDoId?ItemId=${ItemId}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ['WorkStatus',],
    }),

    GetemployeeProjectAllocation: builder.query({
      query: ({accessToken}) => {
        return {
          url: `/EmployeeRecord/GetemployeeProjectAllocation`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    }),
    DeleteMyDailyTaskReport: builder.mutation({
      query: ({data, accessToken}) => ({
        url: `/DayReport/DeleteMyDailyTaskReport`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: ['DayTaskReports'],
    }),

    CreateMyDailyTaskReport: builder.mutation({
      query: ({data, accessToken}) => ({
        url: `/DayReport/CreateMyDailyTaskReport`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: ['DayTaskReports'],
    }),

    UpdateMyDailyTaskReport: builder.mutation({
      query: ({data, accessToken}) => ({
        url: `/DayReport/UpdateMyDailyTaskReport`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: ['DayTaskReports'],
    }),
    GetAppSettingsValue: builder.query({
      query: ({accessToken,AppSettingName}) => {
        return {
          url: `/Master/GetAppSettingsValue?AppSettingName=${AppSettingName}`,
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
  useGetToDoListBasedOnFilterMutation,
  useGetEmployeeProjectsListQuery,
  useGetAllUserStoriesByProjectIdQuery,
  useGetEmployeePriorityListQuery,
  useGetEmployeeByProjectIdQuery,
  useCreateNewTodoMutation,
  useGetEmployeeWorkStatusListQuery,
  useGetGeneralTaskListInMyProjectQuery,
  useGetActiveItemsInMyProjectQuery,
  useSaveWorkLogMutation,
  useGetWorkLogsByEmpIdOnTodoQuery,
  useGetMonthlyReportPlansListQuery,
  useGetDayTaskReportDetailsQuery,
  useGetToDoDetailsByToDoIdQuery,
  useGetemployeeProjectAllocationQuery,
  useGetWorkLogByIdQuery,
  useDeleteMyDailyTaskReportMutation,
  useCreateMyDailyTaskReportMutation,
  useUpdateMyDailyTaskReportMutation,
  useGetAppSettingsValueQuery,
  useEditTodoMutation,
} = workloglevelApi;
