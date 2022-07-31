import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

import styles from './login.module.scss';
import Link from "next/link";
import { BsGithub } from "react-icons/bs";

export default function Login() {
  
  function auth() {
    signIn("google", { callbackUrl: "/" });
  }

  return (
    <main className={styles.Main}>
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
        <input id="email" type="email" placeholder="Email "/>

        <label htmlFor="password">Senha</label>
        <input id="password" type="password" placeholder="Digite sua senha de acesso"/>
        
        <small>
          Ainda não tem conta? 
          <Link href={"/register"}>
            <a>Registre-se</a>
          </Link>
        </small>

        <button type="button" className={styles.enter}>
          Entrar
        </button>

      </div>
    </main>
  );
}