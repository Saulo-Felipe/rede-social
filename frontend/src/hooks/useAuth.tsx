import { createContext, useContext, useEffect, useState } from "react";
import Router from "next/router";
import { setCookie, destroyCookie } from "nookies"
import { toast } from "react-toastify"
import axios from "axios";
import { OverridableTokenClientConfig, useGoogleLogin } from "@react-oauth/google";
import { api } from "../services/api";
import { LoginEmailInfo } from "../components/templates/auth/EmailSignIn";


interface AuthContextType {
  isAuthenticated: boolean;
  registerWithEmail: (args: PropsUserInfo) => Promise<void>;
  user: User;
  signInEmail: (args: LoginEmailInfo) => Promise<void>;
  signInGoogle: (overrideConfig?: OverridableTokenClientConfig) => void;
  logOut: () => void;
}

interface PropsUserInfo {
  email: string;
  username: string;
  password: string;
  passwordConfirm?: string;
  image_url?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  createdOn: string;
}

interface ApiEmailSignUpData {
  success: boolean;
  message?: string;
  token: string;
  user: User;
}

interface GoogleOAuthUserInfo {
  data: {
    email: string;
    email_verified: boolean;
    family_name: string;
    given_name: string;
    locale: string;
    name: string;
    picture: string;
    sub: string;
  }
}


const AuthContext = createContext({} as AuthContextType);


export function AuthProvider({ children }) {
  const [user, setUser] = useState<User>(null);

  const isAuthenticated = !!user;


  useEffect(() => {
    api().post("/auth/recover-user-information").then(response => {
      if (!!response.data.user) { 
        setUser(response.data.user);
      }
    });
  }, []);

  async function registerWithEmail({email, username, password, passwordConfirm}: PropsUserInfo) {
    const { data }= await api().put<ApiEmailSignUpData>("/auth/register/email", {
      email, name: username, password, passwordConfirm
    });

    if (data.message) toast(data.message, { type: "warning" });

    else {
      toast.success("Usuário registrado com sucesso! Redirecionando...");

      setCookie(null, "app-token", data.token, {
        maxAge: 60 * 60 * 1, // 1 hour
        path: "/"
      });

      setUser(data.user);
      
      setTimeout(() => Router.push("/"), 1500);
    }
  }

  async function signInEmail({ email, password }: LoginEmailInfo) {
    toast.loading("Carregando", { autoClose: false });
    
    const { data } = await api().post("/auth/login", {
      email, password
    });

    toast.dismiss();

    if (data.message) {
      toast(data.message, {
        type: "warning",
        autoClose: 6000
      });
    } else {
      setCookie(null, "app-token", data.token, {
        maxAge: 60 * 60 * 1, // 1 hour
        path: "/"
      });

      setUser(data.user);

      toast.success("Login realizado com sucesso! Redirecionando...");

      setTimeout(() => Router.push("/"), 1500);
    }
  }

  const signInGoogle = useGoogleLogin({
    onSuccess: async response => {
      toast.loading("Aguargando solicitação...");

      const { data }: GoogleOAuthUserInfo = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}
      `);

      const res = await api().post("/auth/signin/Google", {
        email: data.email,
        name: data.name,
        password: null,
        id: data.sub,
        image_url: data.picture
      });

      toast.dismiss();

      if (res.data.success) {
        setCookie(null, "app-token", res.data.token, {
          maxAge: 60 * 60 * 3, // 1 hour
          path: "/"
        });

        toast.success("Conectado! redirecionando...", {
          autoClose: 2000
        });

        setUser({ ...res.data.user });

        setTimeout(() => Router.push("/") , 1500);
      }
    }
  });

  function logOut() {
    destroyCookie(null, "app-token", {
      path: "/"
    });

    Router.push("/auth/login");
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      registerWithEmail,
      signInEmail,
      signInGoogle,
      logOut
    }}>
      { children }
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}