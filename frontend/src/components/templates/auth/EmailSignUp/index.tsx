import { MdAlternateEmail } from "react-icons/md";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useAuth } from "../../../../hooks/useAuth";
import { useForm } from "react-hook-form";

import styles from "./EmailSignUp.module.scss";
import { toast } from "react-toastify";


interface userRegiserValidation {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface EmailSignUpProps {
  setIsEmailAuth: (args: boolean) => void;
}

export function EmailSignUp({ setIsEmailAuth }: EmailSignUpProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { registerWithEmail, user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  async function registerEmail(data: userRegiserValidation) {
    if (!isLoading) {
      if (data.password !== data.passwordConfirm)
        return toast.warning("As senhas não conferem.");

      setIsLoading(true);

      await registerWithEmail({ ...data });

      setIsLoading(false);
    }
  }


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

      <form onSubmit={handleSubmit(registerEmail)}>
        <div className={styles.formControl}>
          <label htmlFor={"username"}>Nome de usuário</label>
          <input
            placeholder={"Nome de usuário"}
            style={errors.username ? { borderColor: "red" }:{}}
            { ...register("username", { required: true }) }
          />
        </div>

        <div className={styles.formControl}>
          <label htmlFor={"email"}>Email</label>
          <input
            type={"email"}
            placeholder={"Seu endereço de E-mail"}
            style={errors.email ? { borderColor: "red" }:{}}
            { ...register("email", { required: true }) }
          />
        </div>

        <div className={styles.formControl}>
          <label htmlFor={"password"}>Senha</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder={"Senha de acesso"}
            style={errors.password ? { borderColor: "red" }:{}}
            { ...register("password", { required: true }) }
          />
        </div>

        <div className={styles.formControl}>
          <label>Digite a senha novamente</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder={"Confirme sua senha"}
            style={errors.passwordConfirm ? { borderColor: "red" }:{}}
            { ...register("passwordConfirm", { required: true }) }
          />
        </div>

        <div className={styles.showPassword}>
          <input 
            id={"showPassword"} 
            type={"checkbox"} 
            onChange={({target}) => setShowPassword(target.checked)}
          />
          <label htmlFor={"showPassword"}>Mostrar senha</label>
        </div>
        
        {
          isLoading
          ? 
            <div className={`loadingContainer ${styles.loading}`}>
              <ImSpinner2 />
            </div>
          : <></>
        }

        <button
          className={styles.btnRegister}
          disabled={isLoading}
          type={"submit"}
        >Finalizar</button>

      </form>

    </div>
  );
}