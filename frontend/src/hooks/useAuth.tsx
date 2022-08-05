import { createContext, useContext, useEffect, useState } from "react";
import { Id, ToastContent, ToastOptions } from "react-toastify/dist/types";
import Router from "next/router";
import { setCookie, parseCookies } from "nookies"
import { api } from "../services/api";


interface AuthContextType {
  isAuthenticated: boolean;
  registerWithEmail: (args: EmailSignUpData) => Promise<void>;
  user: User;
}

interface User {
  email: string;
  username: string;
  password: string;
  image_url?: string;
}

interface EmailSignUpData extends User {
  toast: (content: ToastContent, options?: ToastOptions) => Id;
  passwordConfirm: string;
}

interface ApiEmailSignUpData {
  success: boolean;
  message?: string;
  token: string;
  user: User;
}

const AuthContext = createContext({} as AuthContextType);


export function AuthProvider({ children }) {
  const [user, setUser] = useState<User>(null);

  const isAuthenticated = !!user;


  useEffect(() => {
    api().post("/auth/recover-user-information").then(response => {
      console.log("your resp: ", response);
      if (!!response.data.user) {
        setUser(response.data.user);
      }
    })
  }, []);

  async function registerWithEmail({email, username, password, passwordConfirm, toast}: EmailSignUpData) {
    const { data }= await api().put<ApiEmailSignUpData>("/auth/register/email", {
      email, name: username, password, passwordConfirm
    });

    if (data.message) toast(data.message, { type: "warning" });

    else {
      toast("Usuário registrado com sucesso", { type: "success" });

      setCookie(undefined, "app-token", data.token, {
        maxAge: 60 * 60 * 1, // 1 hour
      });

      setUser(data.user);
      
      setTimeout(() => {
        Router.push("/auth/login");
      }, 1500);
    }
  }



  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      registerWithEmail,
      user 
    }}>
      { children }
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}