import axios from "axios";
import { GetServerSidePropsContext } from "next/types";
import { parseCookies, destroyCookie } from "nookies";


export const createConnection = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  headers: {
    "Access-Control-Allow-Origin": String(process.env.NEXT_PUBLIC_SERVER_URL),
  }
});

export function api(ctx?: GetServerSidePropsContext) {
  const token = parseCookies(ctx ? ctx : null)["app-token"];

  createConnection.defaults.headers["app-token"] = token || "";

  return createConnection;
}
