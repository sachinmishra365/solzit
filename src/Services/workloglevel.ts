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

  endpoints: builder => ({

    GetToDoListBasedOnFilter: builder.mutation({
      query: ({data,filterId,itemTypeId,accessToken}) => ({
        url: `/ToDos/GetToDoListBasedOnFilter?filter=${filterId}&itemType=${itemTypeId}`,
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
   useGetToDoListBasedOnFilterMutation,
} = workloglevelApi;
