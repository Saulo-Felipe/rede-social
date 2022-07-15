import { IoMdAddCircle } from "react-icons/io";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd, AiOutlineLoading } from "react-icons/ai";
import { Post } from "../../components/utils/Post";
import { api } from "../../services/api";

import styles from "./profile.module.scss";
import { useEffect, useState } from "react";

export default function Profile({ user }) {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async() => {
      setLoading(true);

      const { data } = await api.post("/userPosts", {userID: user.id});

      setLoading(false);

      if (data.success) {
        setPosts(data.posts);
      }

    })();
  }, []);

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
            {user.followers} Seguidores
          </div>

          <div className={styles.iconContainer}>
            <AiOutlineUsergroupAdd />
            {user.following} Seguindo
          </div>
        </div>
      </header>

      <section>
        <h2>Publicações de {user.username.split(" ")[0]} </h2>
        {
          loading
            ? <div className={"loadingContainer"}><AiOutlineLoading /></div>
            : <></>
          }

        {
          posts.length === 0 && !loading
          ? (
            <div className={styles.notHavePosts}>Nenhuma publicação ainda :(</div>
          ) : (
            posts.map((post, index) =>
              <Post
                  key={index}
                  data={post}
              />
            )
          )
        }
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { data } = await api.post("/getProfile", {userID: params.userID });

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