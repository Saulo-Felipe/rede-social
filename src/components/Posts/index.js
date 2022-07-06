import styles from './styles.module.scss';

export function Posts() {

  return (
    <>
      <h1 className={styles.title}>Últimas postagens</h1>

      <div className={styles.post}>
        <header>
          <img src="/images/temporary-logo.svg" />

          <div className={styles.username}>Nome de usuario</div>
        </header>
        
        <hr />

        <section>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </section>
      </div>

      <div className={styles.post}>
        <header>
          <img src="/images/temporary-logo.svg" />
          
          <div className={styles.username}>Nome de usuario</div>
        </header>
        
        <hr />

        <section>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </section>
      </div>
      <div className={styles.post}>
        <header>
          <img src="/images/temporary-logo.svg" />
          
          <div className={styles.username}>Nome de usuario</div>
        </header>
        
        <hr />

        <section>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </section>
      </div>      

      <div className={styles.post}>
        <header>
          <img src="/images/temporary-logo.svg" />
          
          <div className={styles.username}>Nome de usuario</div>
        </header>
        
        <hr />

        <section>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </section>
      </div>    </>
  );
}