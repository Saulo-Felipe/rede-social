import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Service } from "axios-middleware";
import { parseCookies } from "nookies";


export function api(token?: string) { // For server side
  if (!token) {
    const { "app-token": getToken } = parseCookies();
    token = getToken;
  }

  const createConnection = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    headers: {
      "Access-Control-Allow-Origin": String(process.env.NEXT_PUBLIC_SERVER_URL),
      "app-token": token
    }
  });

  return createConnection;
}


const service = new Service(api());

service.register({
  onRequest(config: AxiosRequestConfig) {    
    return config;
  },
  onResponse(response: AxiosResponse) {
    try {
      let resp = JSON.parse(response.data);
  
      if (resp?.logout) {
        console.log("redirecionando")
        return window.location.pathname = "/auth/login";
      }
  
      return response;

    } catch(e) {
      alert("Erro no servidor.");
      console.log(e);
    }
  }
});


