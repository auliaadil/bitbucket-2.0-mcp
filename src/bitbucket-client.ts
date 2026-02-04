import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface BitbucketConfig {
  workspace: string;
  email: string;
  apiToken: string;
}

export class BitbucketClient {
  private client: AxiosInstance;
  private workspace: string;

  constructor(config: BitbucketConfig) {
    this.workspace = config.workspace;

    this.client = axios.create({
      baseURL: 'https://api.bitbucket.org/2.0',
      auth: {
        username: config.email,
        password: config.apiToken
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  async get<T = any>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(path, config);
    return response.data;
  }

  async post<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(path, data, config);
    return response.data;
  }

  async put<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(path, data, config);
    return response.data;
  }

  async delete<T = any>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(path, config);
    return response.data;
  }

  getWorkspace(): string {
    return this.workspace;
  }
}
