import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/routes`
});

export const apiSocket = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/socket`,
  headers: {
    "Content-Type": "application/json"
  }
});