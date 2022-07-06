import styles from './styles.module.scss';

export function OnlineUsers() {

  return (
    <div className={styles.container}>
      <h2>Usuários online agora</h2>

      <hr />

      <div className={styles.users}>

        <div className={styles.user}>
          <span></span>

          <div>
            <div>Saulo Felipe</div>

            <img src='/images/temporary-logo.svg' />
          </div>

        </div>

      </div>
        

    </div>
  );
}