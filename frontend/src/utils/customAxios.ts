import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { getAccessToken } from './auth';

const AXIOS_INSTANCE = axios.create({
  baseURL: `http://${import.meta.env.VITE_API_URL}`
});

export const customInstance = async <T = unknown>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const token = getAccessToken()

  try {
    const response = await AXIOS_INSTANCE.request<T>({
      ...config,
      ...options,
      headers: {
        ...config.headers,
        ...options?.headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
      withCredentials: false
    });

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.response) {
      const { data, status } = err.response;
      let errorMessage = data?.message || data?.detail || err.response.statusText;

      if (status === 422 && Array.isArray(data?.detail)) {
        errorMessage = data.detail[0]?.msg || errorMessage;
      }

      throw new Error(errorMessage);
    }

    throw err;
  }
};
