import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BackendURL } from "../configs";
import { useErrorToast } from "../hooks/useErrorToast";
import { ReportResponse } from "../hooks/useReportsQuery";
import { v4 as uuidv4 } from "uuid";

export interface APIResponse<T> {
  // data?: T | null;
  data: T;
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

axiosInstance.interceptors.request.use(
  (config) => {
    const traceId = uuidv4();
    config.headers["X-Trace-ID"] = traceId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // Handles API responses
  private handleResponse = <R>(response: AxiosResponse<APIResponse<R>>): R => {
    if (
      response.data.httpStatus !== "OK" &&
      response.data.httpStatus !== "CREATED"
    ) {
      useErrorToast()(response.data.message || "An error occurred.");
      throw new Error(response.data.message || "An error occurred.");
    } else {
      return response.data.data;
    }
  };

  // Handles errors from API requests

  private handleError = (error: any) => {
    if (error.response) {
      useErrorToast()(
        error.response.data.message ||
          `Request failed with status ${error.response.status}`
      );
      throw new Error(
        error.response.data.message ||
          `Request failed with status ${error.response.status}`
      );
    } else {
      useErrorToast()(error.response.data.message || "Network error occurred.");
      throw new Error(error.response.data.message || "Network error occurred.");
    }
  };

  // Check if data is empty or contains empty objects
  private isValidBody = (data: any): boolean => {
    if (data && typeof data === "object") {
      return Object.keys(data).some((key) => {
        const value = data[key];
        // Check if value is not an object or if it is an object with keys
        return (
          value !== undefined &&
          (typeof value !== "object" ||
            (value && Object.keys(value).length > 0))
        );
      });
    }
    return false;
  };

  private cleanParams = (params: Record<string, any>) => {
    const cleanedParams = { ...params };

    // // Remove empty fields
    // for (const key in cleanedParams) {
    //   if (
    //     cleanedParams[key] === "" ||
    //     cleanedParams[key] === undefined ||
    //     cleanedParams[key] === null
    //   ) {
    //     delete cleanedParams[key];
    //   }
    // }

    // Specific conditions
    if (cleanedParams.search === "" || cleanedParams.search_by === "") {
      delete cleanedParams.search;
      delete cleanedParams.search_by;
    }

    if (cleanedParams.page === "0") {
      delete cleanedParams.page;
    }

    if (cleanedParams.start_date === "0000-01-01") {
      delete cleanedParams.start_date;
    }

    if (cleanedParams.end_date === "9999-12-31") {
      delete cleanedParams.end_date;
    }

    if (cleanedParams.action === "All") {
      delete cleanedParams.action;
    }

    if (cleanedParams.module === "All") {
      delete cleanedParams.module;
    }

    if (cleanedParams.sort_order === "desc") {
      delete cleanedParams.sort_order;
    }

    return cleanedParams;
  };

  private edgeTrimmer = (data: any): any => {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return Object.keys(data).reduce((acc, key) => {
        let value = data[key];

        // Trim string values
        if (typeof value === "string") {
          value = value.trim();
        }

        // Recursively trim nested objects
        if (typeof value === "object" && value !== null) {
          value = this.edgeTrimmer(value);
        }

        acc[key] = value;

        return acc;
      }, {} as { [key: string]: any });
    }

    return data;
  };

  private InvalidChecker = (data: any): Promise<never> | false => {
    if (data && typeof data === "object") {
      const hasInvalidField = Object.entries(data).some(([key, value]) => {
        // General validation for empty, null, or undefined values
        console.log(key, value);
        if (value === "" || value === null ) {
          return true;
        }

        // Specific validation for 'alias'
        if (key === "alias" && typeof value === "string" && value.length < 3) {
          console.log("key: ", key);

          return true;
        }

        // Specific validation for 'description'
        if (
          key === "description" &&
          typeof value === "string" &&
          value.length < 20
        ) {
          console.log("key: ", key);
          return true;
        }

        return false;
      });

      if (hasInvalidField) {
        return Promise.reject(
          new Error(
            "Please fill in the required fields properly. Ensure 'alias' is at least 3 characters and 'description' is at least 20 characters long."
          )
        );
      }
    }

    return false;
  };

  getAll = (config?: AxiosRequestConfig) => {
    if (config?.params) {
      config.params = this.cleanParams(config.params);
    }
    return axiosInstance
      .get<APIResponse<PageableResponse<T>>>(this.endpoint, config)
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };

  getListAll = (endUrl: string, config?: AxiosRequestConfig) => {
    return axiosInstance
      .get<APIResponse<T[]>>(`${this.endpoint}/${endUrl}`, config)
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };

  get = (urlParams: string) => {
    return axiosInstance
      .get<APIResponse<T>>(`${this.endpoint}/${urlParams}`)
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };

  getAllIds = () => {
    return axiosInstance.get<number[]>(`${this.endpoint}/getAllIds`);
  };

  create = (
    data: T,
    config?: AxiosRequestConfig
  ): Promise<ReportResponse | null> => {
    if (!this.isValidBody(data)) {
      return Promise.resolve(null); // Just return null if the data is invalid
    }

    console.log("data before trim: ", data);
    data = this.edgeTrimmer(data);

    // Check for invalid fields before proceeding
    const validationError = this.InvalidChecker(data);
    if (validationError) {
      return validationError; // Return the rejected promise
    }

    console.log("data after trim: ", data);
    return axiosInstance
      .post<APIResponse<ReportResponse>>(this.endpoint, data, config)
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };

  update = (
    urlParams: string,
    data: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<ReportResponse | null> => {
    if (!this.isValidBody(data)) {
      return Promise.resolve(null); // Just return null if the data is invalid
    }
    data = this.edgeTrimmer(data);

    if (this.InvalidChecker(data)) {
      return Promise.resolve(null);
    }

    return axiosInstance
      .patch<APIResponse<ReportResponse>>(
        `${this.endpoint}/${urlParams}`,
        data,
        config
      )
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
    status: boolean,
    sourceIds: number[],
    config?: AxiosRequestConfig
  ) => {
    return axiosInstance
      .patch<APIResponse<T>>(
        `${this.endpoint}?isActive=${status}`,
        sourceIds,
        config
      )
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };

  upload = (file: File, reportId: number, config?: AxiosRequestConfig) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance
      .post<APIResponse<T>>(`${this.endpoint}/upload/${reportId}`, formData, {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
          ...config?.headers,
        },
      })
      .then((res) => this.handleResponse(res))
      .catch(this.handleError);
  };
}

export default APIClient;
