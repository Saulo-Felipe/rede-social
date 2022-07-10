import axios from "axios";

export const api = axios.create({
  baseURL: "https://3000-saulofelipe-umasimplesr-ceu0lv1z6k6.ws-us53.gitpod.io/api/routes"
});