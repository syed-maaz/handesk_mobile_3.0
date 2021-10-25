import { create } from "apisauce";
import cache from "../utility/cache";
import authStorage from "../auth/storage";
import settings from "../config/settings";

const apiClient = create({
  baseURL: settings.apiUrl,
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["Content-Type"] = "application/json";
  request.headers["Accept"] = "application/json";
  request.headers["Authorization"] = "Bearer " + authToken;
});

const { get, post, put } = apiClient;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};

apiClient.post = async (url, params, axiosConfig) => {
  const response = await post(url, params, axiosConfig);

  return response;
};

apiClient.put = async (url, params, axiosConfig) => {
  const response = await put(url, params, axiosConfig);

  return response;
};

export default apiClient;
