import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  headers: {
    "Access-Control-Allow-Origin": String(process.env.NEXT_PUBLIC_SERVER_URL)
  }
});

export function customAPI(token: string) {
  if (!token || typeof token === 'undefined' || token === null) {
    token = "";
  }
  
  const localApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    headers: {
      token: token 
    }
  });

  return localApi;
}

export const apiSocket = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/socket`,
  headers: {
    "Content-Type": "application/json"
  }
});