import { GoogleSignIn } from "../../../components/templates/auth/GoogleSignIn";
import { EmailSignIn } from "../../../components/templates/auth/EmailSignIn";
import Head from "next/head";
import axios from "axios";
import { GetServerSideProps } from "next";
import { GithubSignIn } from "../../../components/templates/auth/GithubSignIn";

import styles from './login.module.scss';


export default function Login({ token, error }) {

  return (
    <main className={styles.Main}>
      <Head><title>Entrar</title></Head>

      <div className={styles.loginContainer}>
        <h2>Entrar</h2>

        <hr />

        <GoogleSignIn />

        <GithubSignIn 
          token={token}
          error={error}
        />

        <p><strong>Ou</strong></p>

        <EmailSignIn />

      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  if (context.query.code) {
    const {data} = await axios({
      method: "POST",
      url: "https://github.com/login/oauth/access_token",
      params: {
        client_id: "483b40e3d6add2f61d5c",
        client_secret: "62d2b2ab20c6a083de357e4a08290f19d19336fc",
        code: context.query.code
      },
      headers: {
        Accept: "application/json"
      }
    });
    
    if (data.access_token) {
      return { props: { token: data.access_token } }
  
    } else if (data.error) {
      return { props: { error: data.error } }
    }

  } else if (context.query.error) { 
    return { 
      props: { error: context.query.error } 
    }
  }
  
  return {
    props: { }
  }

}