import cookie from "cookie";
import { useState } from "react"
import { toast } from "react-toastify";
import { api } from "../../../../services/api";
import Link from "next/link";

import styles from "./EmailSignIn.module.scss";


interface LoginInfo {
  password: string;
  email: string;
}

export function EmailSignIn() {
  const [emailLoginInfo, setEmailLoginInfo] = useState<LoginInfo>({
    password: "",
    email: ""
  });

  const [loading, setLoading] = useState(false)

  async function emailLogin() {

    if (emailLoginInfo.email.length == 0 || emailLoginInfo.email.indexOf("@") == -1)
      return toast("Email inválido", { type: "warning" });

    if (emailLoginInfo.password.length == 0)
      return toast("Senha inválida", { type: "warning" });

    toast.loading("Carregando", { autoClose: false });
    setLoading(true);

    const { data } = await api.post("/auth/login", emailLoginInfo);

    setLoading(false);
    toast.dismiss();

    if (data.success) {
      toast(data.message, {
        type: data.failed ? "warning" : "success",
        autoClose: 7000
      });

      if (!data.failed)
        document.cookie = cookie.serialize("app-token", data.token, {
          maxAge: 60 * 60 * 24 * 365
        });;

    } else {
      toast(data.message, { type: "error" });
    }

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