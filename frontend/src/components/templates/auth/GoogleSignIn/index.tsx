import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../../../hooks/useAuth";

import styles from "./GoogleSignIn.module.scss";
  
export function GoogleSignIn() {
  const { signInGoogle } = useAuth();
  
  return (
    <div className={styles.authContainer}>
      <div
        className={styles.content}
        onClick={() => signInGoogle()}
      >
        <FcGoogle /> Entrar com o Google
      </div>
    </div>
  );
}