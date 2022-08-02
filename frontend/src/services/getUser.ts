import cookie from "cookie";
import { GetServerSidePropsContext } from "next";
import { customAPI } from "./api";

/*
* -> this function is limited to server side
*/

export interface GetUserReturn {
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      image_url: string;
      created_on: string;
    };
    isAuthenticated: boolean;
  }
}

export async function getUser(context: GetServerSidePropsContext) {
  const sessionCookie = cookie.parse(context.req.headers.cookie)["app-token"];
  
  const api = customAPI(sessionCookie);

  const { data }: GetUserReturn = await api.post("/auth/current-session");

  return data;
}