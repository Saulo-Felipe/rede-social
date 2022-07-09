import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

import styles from "./styles.module.scss";

export function Post() {
  return (
  <div className={styles.post}>
    <header>
      <div className={styles.profilePictureContainer}>
        <img 
          className={styles.profilePicture}
          src="/images/profile-test.webp" 
        />
      </div>
      
      <div className={styles.username}>Nome de usuario</div>
    </header>
    
    <hr />

    <section className={styles.postContainer}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    </section>

    <footer>
      <div>
        <AiOutlineLike className={styles.like} />
        100
      </div>

      <div className={styles.dislike}>
        <AiOutlineDislike />
        87
      </div>
    </footer>
  </div>  
  );
}