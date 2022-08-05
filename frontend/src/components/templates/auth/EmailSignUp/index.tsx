import { MdAlternateEmail } from "react-icons/md";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useEffect, useState } from "react";
import { userEmailRegister } from "../../../../pages/auth/register";
import { toast } from "react-toastify";
import { ImSpinner9 } from "react-icons/im";
import { useAuth } from "../../../../hooks/useAuth";

import styles from "./EmailSignUp.module.scss";


interface userRegiserValidation {
  name: boolean;
  email: boolean;
  password: boolean;
  passwordConfirm: boolean;
}

interface EmailSignUpProps {
  setIsEmailAuth: (args: boolean) => void;
}

export function EmailSignUp({ setIsEmailAuth }: EmailSignUpProps) {
  const [registerInfo, setRegisterInfo] = useState<userEmailRegister>({
    email: "",
    username: "",
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
  const { registerWithEmail, user } = useAuth();


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
  }, [registerInfo]);

  async function registerEmail() {
    if (!isLoading) {
      for (let c = 0; c < Object.keys(validation).length; c++) {
        if (!validation[Object.keys(validation)[c]]) {
          toast("Verifique todos os campos.", { type: "warning" });
          return;
        }
  
        if (registerInfo['password'] !== registerInfo['passwordConfirm']) {
          setValidation({
            ...validation,
            password: false,
            passwordConfirm: false
          });

          toast("As senhas não estão iguais.", { type: "warning" });
  
          return;
        }
      }
      
      setIsLoading(true);

      await registerWithEmail({ ...registerInfo, toast });

      setIsLoading(false);

    }
  }

  console.log("test: ", user);


  return (
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
          value={registerInfo.username}
          onChange={({target}) => setRegisterInfo({ ...registerInfo, username: target.value })}
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
        onClick={registerEmail}
        disabled={isLoading}
      >Finalizar</button>

    </div>
  );
}