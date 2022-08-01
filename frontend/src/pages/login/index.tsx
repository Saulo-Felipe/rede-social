import { signIn } from "next-auth/react";
import { useEffect, useState } from "react"; 
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import cookie from "cookie";
import { api } from "../../services/api";
import { getSession } from "../../services/getSession";


import styles from './login.module.scss';


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

  function auth() {
    signIn("google", { callbackUrl: "/" });
  }

  useEffect(() => {
    (async () => {
      const user = await getSession();
      
      console.log(user);
    })();
  }, []);

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
        document.cookie = cookie.serialize("@rede-social/token", data.token, {
          maxAge: 60 * 60 * 24 * 365
        });;

    } else {
      toast(data.message, { type: "error" });
    }

    
  }

  return (
    <main className={styles.Main}>
      <ToastContainer />

      <div className={styles.loginContainer}>
        <h2>Entrar</h2>

        <hr />

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
