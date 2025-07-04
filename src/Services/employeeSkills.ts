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

export const employeeSkillsApi = createApi({
  reducerPath: 'employeeSkillsApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://solzitessapi-dev.azurewebsites.net/api/V1', //dev
    // baseUrl: 'https://solzitessapi.azurewebsites.net/api/V1', //pro
  }),
  tagTypes: ['Skill'],

  endpoints: builder => ({
    GetAllMasterSkills: builder.query({
      query: ({accessToken}) => ({
        url: `/EmployeeSkill/GetAllMasterSkills`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ['Skill'],
    }),

    GetOptionSetTypeOfCertificate: builder.query({
      query: ({TypeOfCertification, accessToken}) => ({
        url: `/Master/GetOptionSet?DropDownName=${TypeOfCertification}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ['Skill'],
    }),

    GetOptionSetHasCertificate: builder.query({
      query: ({HasCertification, accessToken}) => ({
        url: `/Master/GetOptionSet?DropDownName=${HasCertification}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    GetOptionSetLevelOfSkill: builder.query({
      query: ({LevelOfSkill, accessToken}) => ({
        url: `/Master/GetOptionSet?DropDownName=${LevelOfSkill}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    GetEmployeeSkills: builder.query({
      query: ({accessToken}) => ({
        url: `/Dashboard/GetEmployeeSkills`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    GetAllMySkillsListApproved: builder.query({
      query: ({approved, accessToken}) => ({
        url: `/EmployeeSkill/GetAllMySkillsList?StatusType=${approved}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
         providesTags: ['Skill'],
    }),

    GetAllMySkillsListApplied: builder.query({
      query: ({applied, accessToken}) => ({
        url: `/EmployeeSkill/GetAllMySkillsList?StatusType=${applied}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
          providesTags: ['Skill'],
    }),

    GetMySkillBySkillId: builder.query({
      query: ({skillId, accessToken}) => ({
        url: `/EmployeeSkill/GetMySkillBySkillId?SkillId=${skillId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    AddMyNewSkill: builder.mutation({
      query: ({data, accessToken}) => ({
        url: `/EmployeeSkill/AddMyNewSkill`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
      invalidatesTags: ['Skill'],
    }),

     EditMySkill: builder.mutation({
      query: ({data, accessToken}) => ({
        url: `/EmployeeSkill/EditMySkill`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
      invalidatesTags: ['Skill'],
    }),

    GetOptionSetStatusReason: builder.query({
      query: ({statusReason, accessToken}) => ({
        url: `/Master/GetOptionSet?DropDownName=${statusReason}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }), 
});

export const {
  useGetAllMasterSkillsQuery,
  useGetOptionSetTypeOfCertificateQuery,
  useGetOptionSetHasCertificateQuery,
  useGetOptionSetLevelOfSkillQuery,
  useGetEmployeeSkillsQuery,
  useGetAllMySkillsListAppliedQuery,
  useGetAllMySkillsListApprovedQuery,
  useGetMySkillBySkillIdQuery,
  useAddMyNewSkillMutation,
  useEditMySkillMutation,
  useGetOptionSetStatusReasonQuery,
} = employeeSkillsApi;
