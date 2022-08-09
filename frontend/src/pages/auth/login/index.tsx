import { BsGithub } from "react-icons/bs";
import { GoogleSignIn } from "../../../components/templates/auth/GoogleSignIn";
import { EmailSignIn } from "../../../components/templates/auth/EmailSignIn";
import Head from "next/head";

import styles from './login.module.scss';


export default function Login() {

  return (
    <main className={styles.Main}>
      <Head><title>Entrar</title></Head>

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