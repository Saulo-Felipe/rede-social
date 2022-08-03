import axios from "axios";

export const axiosServer = axios.create({
  baseURL: process.env.SERVER_URL
});