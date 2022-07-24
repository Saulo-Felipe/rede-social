import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  headers: {
    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SERVER_URL
  }
});

export const apiSocket = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/socket`,
  headers: {
    "Content-Type": "application/json"
  }
});