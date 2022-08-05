import cookie from "cookie";
import { useState } from "react"
import { toast } from "react-toastify";
import { api } from "../../../../services/api";
import Link from "next/link";
import { useAuth } from "../../../../hooks/useAuth";

import styles from "./EmailSignIn.module.scss";


export interface LoginEmailInfo {
  password: string;
  email: string;
}

export function EmailSignIn() {
  const [emailLoginInfo, setEmailLoginInfo] = useState<LoginEmailInfo>({
    password: "",
    email: ""
  });

  const [loading, setLoading] = useState(false)

  const { signInEmail } = useAuth();

  async function emailLogin() {

    if (emailLoginInfo.email.length == 0 || emailLoginInfo.email.indexOf("@") == -1)
      return toast.warning("Email inválido");

    if (emailLoginInfo.password.length == 0)
      return toast.warning("Senha inválida");

    setLoading(true);

    await signInEmail({ ...emailLoginInfo });

    setLoading(false);
  }


  return (
    <div className={styles.emailAuthContainer}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        required={true}
        placeholder="Email"
        value={emailLoginInfo.email}
        onChange={({target}) => setEmailLoginInfo({ ...emailLoginInfo, email: target.value })}
      />

      <label htmlFor="password">Senha</label>
      <input
        id="password"
        type="password"
        placeholder="Digite sua senha de acesso"
        value={emailLoginInfo.password}
        required={true}
        onChange={({target}) => setEmailLoginInfo({ ...emailLoginInfo, password: target.value })}
      />

      <button disabled={loading} onClick={emailLogin} type="button" className={styles.enter}>
        Entrar
      </button>

      <small>
        Ainda não tem conta?
        <Link href={"/auth/register"}>
          <a>Registre-se</a>
        </Link>
      </small>
    </div>
  )
}