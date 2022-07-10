import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

import styles from "./styles.module.scss";

export function Post({ userName, userPicture, content }) {
  return (
  <div className={styles.post}>
    <header>
      <div className={styles.profilePictureContainer}>
        <img 
          className={styles.profilePicture}
          src={userPicture} 
        />
      </div>
      
      <div className={styles.username}>{userName}</div>
    </header>
    
    <hr />

    <section className={styles.postContainer}>
      { content }
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