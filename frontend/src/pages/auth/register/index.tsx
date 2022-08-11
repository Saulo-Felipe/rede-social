import { MdOutlineMailOutline } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { GoogleSignIn } from "../../../components/templates/auth/GoogleSignIn";
import { EmailSignUp } from '../../../components/templates/auth/EmailSignUp';
import { GithubSignIn } from "../../../components/templates/auth/GithubSignIn";

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

              <GithubSignIn />

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