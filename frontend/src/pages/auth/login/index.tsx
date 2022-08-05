import { BsGithub } from "react-icons/bs";
import { GoogleSignIn } from "../../../components/templates/auth/GoogleSignIn";
import { EmailSignIn } from "../../../components/templates/auth/EmailSignIn";
import { useEffect } from "react";

import styles from './login.module.scss';
import { api } from "../../../services/api";


export default function Login() {

  useEffect(() => {
    (async() => {
      const {data} = await api().post("/auth/isAuthenticated");

      console.log("[login data]: ", data);
    })();
  }, []);

  return (
    <main className={styles.Main}>

      <div className={styles.loginContainer}>
        <h2>Entrar</h2>

        <hr />

        <GoogleSignIn />
        

        <div className={styles.authContainer}>
          <div
            className={styles.content}
          >
            <BsGithub /> Github
          </div>
        </div>

        <p><strong>Ou</strong></p>

        <EmailSignIn />

      </div>
    </main>
  );
}