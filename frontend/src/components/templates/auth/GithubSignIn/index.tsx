import { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { toast } from "react-toastify";
import { BsGithub } from "react-icons/bs";

import styles from "./GithubSignIn.module.scss";


interface GithubSignInProps {
  error?: any;
  token?: any;
}

export function GithubSignIn({ error, token }: GithubSignInProps) {
  const { signInGithub } = useAuth();

  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (token) {
      signInGithub(setLoading, token);
    } else if (error) {
      onFailureGithubSignIn();
    }
  }, []);

  function onFailureGithubSignIn() {
    toast.error(error);
  }

  return (
    <div className={`${styles.authContainer} ${loading ? styles.disabled : null}`}>
      <div
        className={styles.content}
        onClick={() => 
          window.location.href = "https://github.com/login/oauth/authorize?client_id=483b40e3d6add2f61d5c&scope=user"}
      >
        { loading ? <div className="loadingContainer"><BsGithub /></div> : <BsGithub /> }
        Github 
      </div>
    </div>
  );
}