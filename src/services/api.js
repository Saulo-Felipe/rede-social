import axios from "axios";

export const api = axios.create({
  baseURL: "https://3000-saulofelipe-umasimplesr-ceu0lv1z6k6.ws-us54.gitpod.io/api/routes"
});