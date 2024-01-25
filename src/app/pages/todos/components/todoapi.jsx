import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "http://localhost:5000" }) =>
  async ({ url, method, data, providesTags, invalidatesTags }) => {
    try {
      const config = {
        url: baseUrl + url,
        method,
        data,
        providesTags,
        invalidatesTags,
      };

      const token = localStorage.getItem("signinToken");
      if (token) {
        config.headers = { authorization: token };
      }

      const result = await axios(config);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const todoApi = createApi({
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Todo'],
  endpoints: (build) => ({
    getTodos: build.query({
      query: () => ({ url: '/api/v1/special-bids', method: 'get' }),
      providesTags: ['Todo']
    }),
    getTodoById: build.query({
      query: (id) => ({ url: `/api/v1/special-bids/${id}`, method: 'get' }),
      providesTags: ['Todo']
    }),
    addTodo: build.mutation({
      query: (body) => ({
        url: '/api/v1/special-bids',
        method: 'post',
        data:body,
      }),
      invalidatesTags: ['Todo']
    }),
    editTodo: build.mutation({
      query: (body) => ({
        url: `/api/v1/special-bids/${body.id}`,
        method: 'put',
        data:body,
      }),
      invalidatesTags: ['Todo']
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useAddTodoMutation,
  useEditTodoMutation,
} = todoApi;
