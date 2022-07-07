import { IoMdAddCircle } from "react-icons/io";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { Post } from "../../components/Posts/Post";

import styles from "./styles.module.scss";

export default function Profile() {

  return ( 
    <div className={styles.profileContainer}>
      <header>
        <div className={styles.title}>
          <div className={styles.imageContainer}>
            <img src={"/images/profile-test.webp"} alt="profile" />
          </div>

          <div>
            <div className={styles.username}>Nome de usuário</div>
            <div className={styles.followButton}>
              <button><IoMdAddCircle /> Seguir </button>
            </div>
          </div>
        </div>

        <hr/> 

        <div className={styles.bottomContent}>
          <div className={styles.iconContainer}>
            <AiOutlineUserAdd />
            200 Seguidores
          </div>

          <div className={styles.iconContainer}>
            <AiOutlineUsergroupAdd />
            12 Seguindo
          </div>
        </div>
      </header>

      <section>
        <h2>Publicações de {"<username>"} </h2>

        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </section>
    </div>
  );
}