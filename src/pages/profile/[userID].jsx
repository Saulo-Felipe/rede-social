import { IoMdAddCircle } from "react-icons/io";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { Post } from "../../components/utils/Post";
import { useRouter } from "next/router";
import { api } from "../../services/api";

import styles from "./profile.module.scss";

export default function Profile({ user }) {

  return ( 
    <div className={styles.profileContainer}>
      <header>
        <div className={styles.title}>
          <div className={styles.imageContainer}>
            <img src={user.image_url} alt="profile" />
          </div>

          <div className={styles.userInfo}>
            <div className={styles.username}>{user.username}</div>
            <div className={styles.followButton}>
              <button><IoMdAddCircle /> Seguir </button>
            </div>
          </div>
        </div>

        <hr/> 

        <div className={styles.bottomContent}>
          <div className={styles.iconContainer}>
            <AiOutlineUserAdd />
            184 Seguidores
          </div>

          <div className={styles.iconContainer}>
            <AiOutlineUsergroupAdd />
            12 Seguindo
          </div>
        </div>
      </header>

      <section>
        <h2>Publicações de {"<username>"} </h2>
        
        <Post 
            key={1}
            userName={"post.username"}
            userPicture={"post.user_picture"}
            content={"post.post.content"}
            createdOn={"post.post.created_on"}        
        />
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { data } = await api.post("/verifyUser", {userID: params.userID });


  if (data.userExists) {
    return {
      props: {
        user: data.user
      }
    }
  }

  return {
    notFound: true
  }
}