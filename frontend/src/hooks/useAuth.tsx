import { createContext, useContext, useEffect, useState } from "react";
import Router from "next/router";
import { setCookie, destroyCookie } from "nookies"
import { toast } from "react-toastify"
import axios from "axios";
import { OverridableTokenClientConfig, useGoogleLogin } from "@react-oauth/google";
import { api, createConnection } from "../services/api";
import { LoginEmailInfo } from "../components/templates/auth/EmailSignIn";


interface AuthContextType {
  isAuthenticated: boolean;
  registerWithEmail: (args: PropsUserInfo) => Promise<void>;
  user: User;
  signInEmail: (args: LoginEmailInfo) => Promise<void>;
  signInGoogle: (overrideConfig?: OverridableTokenClientConfig) => Promise<void>;
  signInGithub: (args: (arg: boolean) => void, token: string) => void;
  logOut: () => void;
  updateUser: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  useEffect(() => {
    createConnection.interceptors.response.use(
      response => {
        return response
      },
      error => {
        if (error.response?.data?.logout) {
          toast.warning("Autenticação expirada. Faça login para continuar.");
          destroyCookie(null, "app-token", { path: "/" });
          window.location.pathname = "/auth/login";
          Router.push("/auth/login"); // If the first redirect doest no work
        }
        if (error.response?.data?.error) {
          toast.error(error.response?.data?.message);
        }
      }
    );

    updateUser();
  }, []);

  async function updateUser() {
    const response = await api().post("/auth/recover-user-information");

    if (response && response?.data?.user) {
      setUser(response.data.user);
    }
  }

  async function registerWithEmail({email, username, password, passwordConfirm}: PropsUserInfo) {
    const data = await api().put<ApiEmailSignUpData>("/auth/register/email", {
      email, name: username, password, passwordConfirm
    });

    if (data?.data?.message) toast(data.data.message, { type: "warning" });

    else {
      toast.success("Usuário registrado com sucesso! Redirecionando...");

      setCookie(null, "app-token", data?.data?.token, {
        maxAge: 60 * 60 * 1, // 1 hour
        path: "/"
      });

      setUser(data?.data?.user);

      setTimeout(() => Router.push("/"), 1500);
    }
  }

  async function signInEmail({ email, password }: LoginEmailInfo) {
    toast.loading("Carregando", { autoClose: false });

    const response = await api().post("/auth/login", {
      email, password
    });

    toast.dismiss();

    if (response?.data?.message) {
      toast(response?.data?.message, {
        type: "warning",
        autoClose: 6000
      });
    } else {
      setCookie(null, "app-token", response?.data?.token, {
        maxAge: 60 * 60 * 1, // 1 hour
        path: "/"
      });

      setUser(response?.data?.user);

      toast.success("Login realizado com sucesso! Redirecionando...");

      Router.push("/");
    }
  }


  async function signInGoogle(response) {
    const resp: GoogleOAuthUserInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}
    `);

    const res = await api().post("/auth/signin/Google", {
      email: resp?.data?.email,
      name: resp?.data?.name,
      password: null,
      id: resp?.data?.sub,
      image_url: resp?.data?.picture
    });

    if (res?.data?.success) {
      setCookie(null, "app-token", res.data.token, {
        maxAge: 60 * 60 * 3, // 1 hour
        path: "/"
      });

      toast.success("Conectado! redirecionando...", {
        autoClose: 2000
      });

      setUser({ ...res?.data?.user });

      setTimeout(() => Router.push("/") , 1500);
    }
  }


  async function signInGithub(setLoading: (args: boolean) => void, token: string) {
    setLoading(true);

    try {
      const resp = await axios({
        method: "GET",
        url: "https://api.github.com/user/emails",
        headers: {
          "Authorization": `token ${token}`,
        },
      });

      const { data: userInfo } = await axios({
        method: "GET",
        url: "https://api.github.com/user",
        headers: {
          "Authorization": `token ${token}`,
        },
      });

      const { data: response } = await api().post("/auth/signin/Github", {
        email: resp?.data[0]?.email,
        name: userInfo.login,
        password: null,
        id: userInfo.id,
        image_url: userInfo.avatar_url,
        bio: userInfo.bio
      });

      if (response?.success) {
        setCookie(null, "app-token", response.token, {
          maxAge: 60 * 60 * 3, // 1 hour
          path: "/"
        });

        toast.success("Conectado! redirecionando...", {
          autoClose: 1500
        });

        setUser({ ...response.user });

        setTimeout(() => Router.push("/") , 1500);
      }

    } catch(e) {
      console.log("Err: ", e?.response?.data?.message);
      console.log(e);
      toast.error(e?.response?.data?.message);
    }

    setLoading(false);
  }

  function logOut() {
    destroyCookie(null, "app-token", {
      path: "/"
    });

    window.location.pathname = "/auth/login";
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      registerWithEmail,
      signInEmail,
      signInGoogle,
      signInGithub,
      logOut,
      updateUser
    }}>
      { children }
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}