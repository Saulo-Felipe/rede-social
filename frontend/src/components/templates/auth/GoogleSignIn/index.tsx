import { useState } from "react";
import { useRouter } from "next/router";
import cookie from "cookie";
import { useGoogleLogin } from "@react-oauth/google";
import { api } from "../../../../services/api";
import axios from "axios";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

import styles from "./GoogleSignIn.module.scss";


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

export function GoogleSignIn() {
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const router = useRouter();

  const customGoogleLogin = useGoogleLogin({
    onSuccess: async response => {
      if (!googleLoginLoading) {
        setGoogleLoginLoading(true);

        const { data }: GoogleOAuthUserInfo = await axios.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}
        `);
  
        const res = await api().post("/auth/signin/Google", {
          email: data.email,
          name: data.name,
          password: null,
          id: data.sub,
          image_url: data.picture
        });

        setGoogleLoginLoading(false);
  
        if (res.data.success) {
          document.cookie = cookie.serialize("app-token", res.data.token, {
            maxAge: 60 * 60 * 24 * 365
          });;

          toast("Conectado!", {
            type: "success",
          });

          setTimeout(() => {
            router.push("/");
          }, 1500)
        }
      }
    }
  });

  return (
    <div className={`${styles.authContainer} ${googleLoginLoading ? styles.disabled : null}`}>
      <div
        className={styles.content}
        onClick={() => customGoogleLogin()}
      >
        <FcGoogle /> Entrar com o Google
      </div>
    </div>
  );
}