import { signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import cookie from "cookie";
import { api } from "../../services/api";
import { getSession } from "../../services/getSession";
import Head from "next/head";


import styles from './login.module.scss';
import { GetServerSideProps } from "next";
import { getUser } from "../../services/getUser";


interface LoginInfo {
  password: string;
  email: string;
}

export default function Login() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    password: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(false)
  const loginContainerRef = useRef(null);
  const [loginContainerWidth, setLoginContainerWidth] = useState(0);

  function auth() {
    signIn("google", { callbackUrl: "/" });
  }

  useEffect(() => {
    setLoginContainerWidth(loginContainerRef.current?.clientWidth);
  }, [loginContainerRef.current]);

  async function login() {

    if (loginInfo.email.length == 0 || loginInfo.email.indexOf("@") == -1)
      return toast("Email inválido", { type: "warning" });

    if (loginInfo.password.length == 0)
      return toast("Senha inválida", { type: "warning" });

    toast.loading("Carregando", { autoClose: false });
    setIsLoading(true);

    const { data } = await api.post("/auth/login", loginInfo);

    setIsLoading(false);
    toast.dismiss();

    if (data.success) {
      toast(data.message, {
        type: data.failed ? "warning" : "success",
        autoClose: 7000
      });

      if (!data.failed)
        document.cookie = cookie.serialize("app-token", data.token, {
          maxAge: 60 * 60 * 24 * 365
        });;

    } else {
      toast(data.message, { type: "error" });
    }


  }

  function sucessLogin(test) {
    console.log(test)
  }

  function failureLogin(test) {
    console.log(test)
  }

  return (
    <main className={styles.Main}>
      <Head>
        <title>Entre na sua conta</title>
        {
          typeof window !== 'undefined'
          ? <script src="https://accounts.google.com/gsi/client" async defer></script>
          : <></>
        }
        
      </Head>

      <ToastContainer />

      <div className={styles.loginContainer} ref={loginContainerRef} >
        <h2>Entrar</h2>

        <hr />

        <div
          id="g_id_onload"
          data-client_id="459985926193-fqp9kuvbjhc2tda2ererqkb740rjtuj0.apps.googleusercontent.com"
          data-login_uri="https://3000-accounttest11-blankrepo-npvrglnlm9l.ws-us54.gitpod.io/login"
          data-auto_prompt="false"          
        ></div>

        <div
          className="g_id_signin"
          data-type="standard"
          data-size="large"
          data-theme="outline"
          data-text="sign_in_with"
          data-shape="rectangular"
          data-logo_alignment="left"
          data-width={loginContainerWidth}
        ></div>

        <div className={styles.authContainer}>
          <div
            className={styles.content}
            onClick={auth}
          >
            <FcGoogle /> Entrar com o Google
          </div>
        </div>

        <div className={styles.authContainer}>
          <div
            className={styles.content}
          >
            <BsGithub /> Github
          </div>
        </div>

        <p><strong>Ou</strong></p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required={true}
          placeholder="Email"
          value={loginInfo.email}
          onChange={({target}) => setLoginInfo({ ...loginInfo, email: target.value })}
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          placeholder="Digite sua senha de acesso"
          value={loginInfo.password}
          required={true}
          onChange={({target}) => setLoginInfo({ ...loginInfo, password: target.value })}
        />

        <button disabled={isLoading} onClick={login} type="button" className={styles.enter}>
          Entrar
        </button>

        <small>
          Ainda não tem conta?
          <Link href={"/register"}>
            <a>Registre-se</a>
          </Link>
        </small>

      </div>
    </main>
  );
}