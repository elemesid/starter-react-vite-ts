import type { BaseResponse, Pagination } from "~/@types";
import { axiosInstance } from "~/libs/axios";
import qs from "qs";

interface BaseRecord {
  [key: string]: unknown;
}

export interface GetManyResponse<TData extends Record<string, any>> extends BaseResponse {
  data: {
    list: TData[];
    paging: Pagination;
  };
}

export interface GetOneResponse<TData extends Record<string, any>> extends BaseResponse {
  data: TData;
}

export interface CreateResponse<TData extends Record<string, any>> extends BaseResponse {
  data: TData;
}

export interface DataProvider {
  getList: <TData extends Record<string, any>>(params: {
    resource: string;
    query?: BaseRecord;
  }) => Promise<GetManyResponse<TData>>;
  getOne: <TData extends Record<string, any>>(params: {
    resource: string;
    id: string;
  }) => Promise<GetOneResponse<TData>>;

  create: <TData extends Record<string, any>, TVariables extends BaseRecord = BaseRecord>(params: {
    resource: string;
    variables: TVariables;
  }) => Promise<CreateResponse<TData>>;
  update: <TData extends Record<string, any>, TVariables extends BaseRecord = BaseRecord>(params: {
    resource: string;
    variables: TVariables;
  }) => Promise<CreateResponse<TData>>;
  delete: <TData extends Record<string, any>>(params: {
    resource: string;
    id: string;
  }) => Promise<CreateResponse<TData>>;
}

export const defaultServices: DataProvider = {
  getList: async ({ resource, query }) => {
    const q = qs.stringify(query);
    const { data } = await axiosInstance.get(`${resource}?${q}`);

    return data;
  },
  getOne: async ({ id, resource }) => {
    const url = `${resource}/${id}`;
    const { data } = await axiosInstance.get(url);

    return data;
  },
  create: async ({ resource, variables }) => {
    const url = `${resource}`;

    const { data } = await axiosInstance.post(url, variables);

    return data;
  },
  update: async ({ resource, variables }) => {
    const { data } = await axiosInstance.put(resource, variables);

    return data;
  },
  delete: async ({ resource, id }) => {
    const url = `${resource}/${id}`;

    const { data } = await axiosInstance.delete(url);

    return data;
  },
};
