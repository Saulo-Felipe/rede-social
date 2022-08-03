import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import cookie from "cookie";
import { Service } from "axios-middleware";


export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  headers: {
    "Access-Control-Allow-Origin": String(process.env.NEXT_PUBLIC_SERVER_URL),
  }
});

const service = new Service(api);

service.register({
  onRequest(config: AxiosRequestConfig) {
    config.headers["app-token"] = typeof document !== "undefined" ? cookie.parse(document.cookie)["app-token"] : "";
    
    return config;
  },
  onResponse(response: AxiosResponse) {
    let resp = JSON.parse(response.data);

    if (resp?.logout) {
      console.log("redirecionando")
      return window.location.pathname = "/auth/login";
    }

    return response;
  }
});



export function customAPI(token: string) { // For server side
  if (!token || typeof token === 'undefined' || token === null) {
    token = "";
  }
  
  const localApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    headers: {
      "app-token": token 
    }
  });

  return localApi;
}