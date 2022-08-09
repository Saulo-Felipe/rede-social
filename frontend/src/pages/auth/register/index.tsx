import { MdOutlineMailOutline } from "react-icons/md";
import { BsGithub } from "react-icons/bs";
import { useState } from "react";
import Link from "next/link";
import { GoogleSignIn } from "../../../components/templates/auth/GoogleSignIn";
import { EmailSignUp } from '../../../components/templates/auth/EmailSignUp';
import Head from "next/head";

import styles from './register.module.scss';


export default function Register() {
  const [isEmailAuth, setIsEmailAuth] = useState(false);
 
  return (
    <main className={styles.Main}>
      <Head><title>Cadastre-se</title></Head>

      <div className={styles.registerContainer}>
        {
          !isEmailAuth
          ? (
            <>
              <h2>Registre-se</h2>

              <hr />

              <GoogleSignIn />

              <div className={styles.authContainer}>
                <div
                  className={styles.content}
                >
                  <BsGithub /> Github
                </div>
              </div>

              <div className={styles.authContainer}>
                <div
                  className={styles.content}
                  onClick={() => setIsEmailAuth(true)}
                >
                  <MdOutlineMailOutline /> Cadastre-se via Email
                </div>
              </div>

              <footer>
                <small>
                  Já possui uma conta?
                  <Link href={"/auth/login"}>
                    <a>Entre</a>
                  </Link>
                </small>
              </footer>
            </>
          ) : (
            <EmailSignUp 
              setIsEmailAuth={setIsEmailAuth}
            />
          )
        }

      </div>
    </main>
  );
}