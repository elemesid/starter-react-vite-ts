import type { AxiosRequestConfig } from "axios";
import axios from "axios";

import type { BaseResponse, HttpError } from "~/@types";
import nookies from "nookies";
// import { client } from "~/stores";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = nookies.get().token;
    const setToken = config;
    if (token) {
      setToken.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  async (error) => {
    if (error?.response?.status === 401) {
      nookies.destroy(null, "token", {
        path: "/",
      });

      window.location.href = "/login";
    } else if (error?.response?.status == 404) {
      // throw notFound();
    }

    const customError: HttpError = {
      ...error,
      message: error.response?.data?.error?.message,
    };

    return Promise.reject(customError);
  },
);

export { axiosInstance };

type Method = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

export const http = async <T>(method: Method, config: AxiosRequestConfig): Promise<BaseResponse & T> => {
  try {
    const { data } = await axiosInstance({ ...config, method });
    return await Promise.resolve(data as BaseResponse & T);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) || error instanceof Error) {
      return Promise.reject(error.message);
    }
    return Promise.reject(error);
  }
};
