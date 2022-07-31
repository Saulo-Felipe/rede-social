import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

import styles from './register.module.scss';
import { MdAlternateEmail, MdOutlineMailOutline } from "react-icons/md";
import { BsGithub } from "react-icons/bs";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Link from "next/link";
import { api } from "../../services/api";
import { ImSpinner9 } from "react-icons/im";
import { useRouter } from "next/router";


export interface userEmailRegister {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface userRegiserValidation {
  name: boolean;
  email: boolean;
  password: boolean;
  passwordConfirm: boolean;
}

export default function Register() {
  const [isEmailAuth, setIsEmailAuth] = useState(false);
  const [registerInfo, setRegisterInfo] = useState<userEmailRegister>({
    email: "",
    name: "",
    password: "",
    passwordConfirm: ""
  });
  const [validation, setValidation] = useState<userRegiserValidation>({
    email: true,
    name: true,
    password: true,
    passwordConfirm: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function auth() {
    signIn("google", { callbackUrl: "/" });
  }

  async function register() {
    if (!isLoading) {
      for (let c = 0; c < Object.keys(validation).length; c++) {
        if (!Object.keys(validation)[c]) {
          return;
        }
  
        if (registerInfo['password'] !== registerInfo['passwordConfirm']) {
          setValidation({
            ...validation,
            password: false,
            passwordConfirm: false
          });
  
          return;
        }
      }
      
      setIsLoading(true);

      const { data } = await api.put("/user/email", { ...registerInfo });

      setIsLoading(false);
  
      if (data.success) {
        alert("Cadastrado com sucesso!");

        router.push("/login");
      } else {
        alert("Erro ao criar usuário")
      }
  
    }
  }

  useEffect(() => {
    let newValidation: userRegiserValidation = {} as userRegiserValidation;

    for (let c = 0; c < Object.keys(registerInfo).length; c++) {
      if (registerInfo[Object.keys(registerInfo)[c]].length == 0) {
        newValidation[Object.keys(registerInfo)[c]] = false;
      } else {
        newValidation[Object.keys(registerInfo)[c]] = true;
      }
    }
    if (JSON.stringify(newValidation) != JSON.stringify(validation)) {
      setValidation({ ...newValidation });
    }
  }, [registerInfo])

  return (
    <main className={styles.Main}>
      <div className={styles.registerContainer}>
        {
          !isEmailAuth
          ? (
            <>
              <h2>Registre-se</h2>

              <hr />

              <div className={styles.authContainer}>
                <div
                  className={styles.content}
                  onClick={auth}
                >
                  <FcGoogle /> Entrar com o Google
                </div>
              </div>

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
                  <Link href={"/login"}>
                    <a>Entre</a>
                  </Link>
                </small>
              </footer>
            </>
          ) : (
            <div className={styles.emailRegisterContainer}>

              <header>
                <div className={styles.title}>
                  <MdAlternateEmail /> Registre-se com email
                </div>

                <div className={styles.back} onClick={() => setIsEmailAuth(false)}>
                  <AiOutlineArrowLeft />
                </div>
              </header>

              <hr />

              <div className={styles.formControl}>
                <label htmlFor={"username"}>Nome de usuário</label>
                <input
                  id={"username"}
                  type={"text"}
                  placeholder={"Nome de usuário"}
                  value={registerInfo.name}
                  onChange={({target}) => setRegisterInfo({ ...registerInfo, name: target.value })}
                  style={!validation.name ? { borderColor: "red" }:{}}
                />
              </div>

              <div className={styles.formControl}>
                <label htmlFor={"email"}>Email</label>
                <input
                  id={"email"}
                  type={"email"}
                  placeholder={"Seu endereço de E-mail"}
                  value={registerInfo.email}
                  onChange={({target}) => setRegisterInfo({ ...registerInfo, email: target.value })}
                  style={!validation.email ? { borderColor: "red" }:{}}
                />
              </div>

              <div className={styles.formControl}>
                <label htmlFor={"password"}>Senha</label>
                <input
                  id={"password"}
                  type={"password"}
                  placeholder={"Senha de acesso"}
                  value={registerInfo.password}
                  onChange={({target}) => setRegisterInfo({ ...registerInfo, password: target.value })}
                  style={!validation.password ? { borderColor: "red" }:{}}
                />
              </div>

              <div className={styles.formControl}>
                <label htmlFor={"repeat-password"}>Comfirme a senha novamente</label>
                <input
                  id={"repeat-password"}
                  type={"password"}
                  placeholder={"Digite sua senha outra vez"}
                  value={registerInfo.passwordConfirm}
                  onChange={({target}) => setRegisterInfo({ ...registerInfo, passwordConfirm: target.value })}
                  style={!validation.passwordConfirm ? { borderColor: "red" }:{}}
                />
              </div>
              
              {
                isLoading
                ? 
                  <div className={`loadingContainer ${styles.loading}`}>
                    <ImSpinner9 />
                  </div>
                : <></>
              }

              <button
                className={styles.btnRegister}
                onClick={register}
                disabled={isLoading}
              >Finalizar</button>

            </div>
          )
        }

      </div>
    </main>
  );
}