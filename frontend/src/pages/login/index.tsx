import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

import styles from './login.module.scss';

export default function Login() {
  
  function auth() {
    signIn("google", { callbackUrl: "/" });
  }

  return (
    <main className={styles.Main}>
      <div className={styles.loginContainer}>
        <h1>Entrar</h1>

        <hr />

        <div className={styles.authContainer}>
          <div 
            className={styles.google}
            onClick={auth}
          >
            <FcGoogle /> Entrar com o Google
          </div>
        </div>

        <p><strong>Ou</strong></p>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="Email "/>

        <label htmlFor="password">Senha</label>
        <input id="password" type="password" placeholder="Digite sua senha de acesso"/>

        <button type="button" className={styles.enter}>
          Entrar
        </button>

      </div>
    </main>
  );
}