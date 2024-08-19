import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BackendURL } from "../configs";

export interface APIResponse<T> {
  data?: T | null;
  httpStatus: string;
  message: string;
  timestamp: string;
}

export interface PageableResponse<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

const axiosInstance = axios.create({
  baseURL: BackendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  private handleResponse = <R>(
    response: AxiosResponse<APIResponse<R>>
  ): R | null => {
    if (response.data.httpStatus !== "OK") {
      throw new Error(response.data.message || "An error occurred.");
    }
    return response.data.data || null;
  };

  private handleError = (error: any) => {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          `Request failed with status ${error.response.status}`
      );
    }
    throw new Error(error.message || "Network error occurred.");
  };

  getAll = (config?: AxiosRequestConfig) => {
    return axiosInstance
      .get<APIResponse<PageableResponse<T>>>(this.endpoint, config)
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };

  get = (urlParams: string) => {
    return axiosInstance
      .get<APIResponse<T>>(`${this.endpoint}/${urlParams}`)
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };

  create = (data: T, config?: AxiosRequestConfig) => {
    return axiosInstance
      .post<APIResponse<T>>(this.endpoint, data, config)
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };

  update = (
    urlParams: string,
    data: Partial<T>,
    config?: AxiosRequestConfig
  ) => {
    return axiosInstance
      .patch<APIResponse<T>>(`${this.endpoint}/${urlParams}`, data, config)
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };

  delete = (urlParams: string, config?: AxiosRequestConfig) => {
    return axiosInstance
      .delete<APIResponse<T>>(`${this.endpoint}/${urlParams}`, config)
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };

  bulkDelete = (data: number[], config?: AxiosRequestConfig) => {
    return axiosInstance
      .delete<APIResponse<null>>(this.endpoint, { ...config, data })
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };

  updateStatus = (
    urlParams: string,
    status: boolean,
    config?: AxiosRequestConfig
  ) => {
    return axiosInstance
      .patch<APIResponse<T>>(
        `${this.endpoint}/${urlParams}?isActive=${status}`,
        null,
        config
      )
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };
}

export default APIClient;
