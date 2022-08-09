import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../../../hooks/useAuth";

import styles from "./GoogleSignIn.module.scss";
  
export function GoogleSignIn() {
  const { signInGoogle } = useAuth();
  const [isLoading, setLoading] = useState(false);
  
  const signin = useGoogleLogin({
    onSuccess: async (response) => {
      setLoading(true);
      await signInGoogle(response);
      setLoading(false);
    }
  });
  
  return (
    <div className={styles.authContainer}>
      <div
        className={`${styles.content} ${isLoading ? styles.disabled : null}`}
        onClick={() => signin()}
      >
        { isLoading ? <div className={"loadingContainer"}><FcGoogle /></div> : <FcGoogle /> } Entrar com o Google
      </div>
    </div>
  );
}