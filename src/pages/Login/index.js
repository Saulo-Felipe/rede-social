import styles from './styles.module.scss';

export default function Login() {

  return (
    <main className={styles.Main}>
      <div className={styles.loginContainer}>
        <h1>Entrar</h1>

        <hr />

        <div>Entrar com o Google</div>

        <p>Ou</p>

        <label htmlFor="email">Email</label>
        <input id="email" type="text" placeholder="Email "/>

        <label htmlFor="password">Senha</label>
        <input id="password" type="text" placeholder="Digite sua senha de acesso"/>

      </div>
    </main>
  );
}