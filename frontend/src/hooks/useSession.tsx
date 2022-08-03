import { useContext, useState, useEffect, createContext } from "react";
import { customAPI, api } from "../services/api";
import cookie from "cookie";
import { GetServerSidePropsContext } from "next";



interface User {
  user: {
    id: string;
    username: string;
    email: string;
    image_url: string;
    created_on: string;
  };
  isAuthenticated: boolean | string;
}

interface GetUserReturn {
  data: User;
}

interface SessionContext {
  getServerUser: (args: GetServerSidePropsContext) => void;
  getClientUser: () => void;
  user: User;
}

const SessionContext = createContext({
  getServerUser: function() {},
  getClientUser: function() {},
  user: {
    isAuthenticated: "loading",
    user: { created_on: "", email: "", id: "", image_url: "/images/profile-user.png", username: "" }
  }
} as SessionContext);

export function SSessionProvider({ children }) {
  const [user, setUser] = useState<User>({
    isAuthenticated: "loading",
    user: { created_on: "", email: "", id: "", image_url: "/images/profile-user.png", username: "" }
  });

  async function getServerUser(context: GetServerSidePropsContext) {
    console.log("[get server]")

    const sessionCookie = cookie.parse(context.req.headers.cookie)["app-token"];

    const api = customAPI(sessionCookie);

    setUser({
      isAuthenticated: "loading",
      user: { ...user.user }
    });

    const { data }: GetUserReturn = await api.post("/auth/current-session");

    NotifyAll(data);
  }

  function NotifyAll(data: User) {
    setUser({ ...data });
  }

  async function getClientUser() {
    console.log("[get client]")
    setUser({
      isAuthenticated: "loading",
      user: { ...user.user }
    });

    const { data }: GetUserReturn = await api.post("/auth/current-session");

    NotifyAll(data)
  }

  return (
    <SessionContext.Provider value={{
      getServerUser,
      getClientUser,
      user,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function getClientUser() {
  const { user, getClientUser }: SessionContext = useContext(SessionContext);

  useEffect(() => {
    getClientUser();
  }, []);

  return { ...user };
}

export function getServerUser(context: GetServerSidePropsContext) {
  const { user, getServerUser }: SessionContext = useContext(SessionContext);

  useEffect(() => {
    getServerUser(context);
  }, []);

  return { ...user };
}