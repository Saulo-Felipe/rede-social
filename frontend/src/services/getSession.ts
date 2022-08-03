import { GetUserReturn } from "./getUser";
import { api } from "./api";
/*
* -> this function is limited to client side
*/

export async function getSession(setUser) {
  const { data }: GetUserReturn = await api.post("/auth/current-session");

  setUser(data);

  return data;    
}