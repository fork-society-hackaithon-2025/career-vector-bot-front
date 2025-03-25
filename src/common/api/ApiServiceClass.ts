/* eslint-disable */
import type { AxiosInstance, AxiosResponse, ResponseType } from "axios";

interface IConfigAPI {
  axios: AxiosInstance;
  serviceUrl: string;
  urlPrefix?: string;
}

export class ApiServiceClass {
  private readonly axios: AxiosInstance;
  private readonly serviceUrl: string;
  private readonly urlPrefix: string;
  constructor(config: IConfigAPI) {
    this.axios = config.axios;
    this.serviceUrl = config.serviceUrl;
    if (config.urlPrefix === null || config.urlPrefix === undefined) {
      this.urlPrefix = "api";
    } else this.urlPrefix = config.urlPrefix;
  }

  get servicePath() {
    return `${this.axios.defaults.baseURL}/${this.baseUrl}`;
  }

  get baseUrl() {
    const urls = [this.serviceUrl, this.urlPrefix].filter((v) => v);
    return urls.join("/");
  }

  protected async GET<T>(
    url: string,
    params = {},
    headers = {},
    responseType?: ResponseType,
    serializer?: (params: any) => any
  ): Promise<T> {
    try {
      const response = await this.axios(`${this.baseUrl}${url}`, {
        method: "GET",
        params,
        headers,
        responseType,
        paramsSerializer: serializer
          ? serializer
          : this.axios.defaults.paramsSerializer,
      });
      // @ts-ignore
      return this.compareRequest(response);
    } catch (error) {
      // @ts-ignore
      return {
        success: false,
        data: error,
      };
    }
  }
  protected async POST<T>(
    url: string,
    data = {},
    headers = {},
    params = {},
    responseType?: ResponseType,
    serializer?: (params: any) => any
  ): Promise<T> {
    try {
      const response = await this.axios({
        url: `${this.baseUrl}${url}`,
        method: "POST",
        data,
        headers,
        params,
        responseType,
        paramsSerializer: serializer
          ? serializer
          : this.axios.defaults.paramsSerializer,
      });
      // @ts-ignore
      return this.compareRequest(response);
    } catch (error) {
      // @ts-ignore
      return {
        success: false,
        data: error,
      };
    }
  }
  protected async PUT<T>(
    url: string,
    data = {},
    headers = {},
    params = {},
    serializer?: (params: any) => any
  ): Promise<T> {
    try {
      const response = await this.axios({
        url: `${this.baseUrl}${url}`,
        method: "PUT",
        data,
        headers,
        params,
        paramsSerializer: serializer
          ? serializer
          : this.axios.defaults.paramsSerializer,
      });
      // @ts-ignore
      return this.compareRequest(response);
    } catch (error) {
      // @ts-ignore
      return {
        success: false,
        data: error,
      };
    }
  }
  protected async PATCH<T>(
    url: string,
    data = {},
    headers = {},
    params = {},
    serializer?: (params: any) => any
  ): Promise<T> {
    try {
      const response = await this.axios({
        url: `${this.baseUrl}${url}`,
        method: "PATCH",
        data,
        headers,
        params,
        paramsSerializer: serializer
          ? serializer
          : this.axios.defaults.paramsSerializer,
      });
      // @ts-ignore
      return this.compareRequest(response);
    } catch (error) {
      // @ts-ignore
      return {
        success: false,
        data: error,
      };
    }
  }
  protected async DELETE<T>(
    url: string,
    params = {},
    headers = {},
    serializer?: (params: any) => any
  ): Promise<T> {
    try {
      const response = await this.axios({
        url: `${this.baseUrl}${url}`,
        method: "DELETE",
        headers,
        params,
        paramsSerializer: serializer
          ? serializer
          : this.axios.defaults.paramsSerializer,
      });
      // @ts-ignore
      return this.compareRequest(response);
    } catch (error) {
      // @ts-ignore
      return {
        success: false,
        data: error,
      };
    }
  }
  protected compareRequest(response: AxiosResponse): any {
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        data: response.data,
      };
    }
  }
}
