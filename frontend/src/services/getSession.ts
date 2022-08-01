import cookie from "cookie";
import { customAPI } from "./api";
import { GetUserReturn } from "./getUser";

/*
* -> this function is limited to client side
*/

export async function getSession() {
  let token = cookie.parse(document.cookie)["@rede-social/token"];

  if (!token || typeof token == "undefined" || token == null)
    token = "";

  const api = customAPI(token);

  const { data }: GetUserReturn = await api.post("/auth/current-session");

  return data;
}