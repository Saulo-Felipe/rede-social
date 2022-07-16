import { IoMdAddCircle } from "react-icons/io";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { Post } from "../../components/utils/Post";
import { api } from "../../services/api";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

import styles from "./profile.module.scss";

export default function Profile({ user, isMyProfile }) {
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
            {
              !isMyProfile 
              ? (
                <div className={styles.followButton}>
                  <button><IoMdAddCircle /> Seguir </button>
                </div>
              ) : <></>
            }
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

        <h2>
        {
          isMyProfile 
          ? 'Minhas publicações'
          : `Publicações de ${user.username.split(" ")[0]}`
        }
        </h2>

        <hr />

        {
          loading
            ? <div className={"loadingContainer"}><CgSpinnerTwoAlt className={styles.loadingIcon} /></div>
            : <></>
          }

        {
          posts.length === 0 && !loading
          ? (
            <div className={styles.notHavePosts}>Nenhuma publicação ainda :(</div>
          ) : (
            posts.map(post =>
              <Post
                key={post.id}
                data={post}
                currentUserId={user.id}
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

  const {user} = await getSession(context);

  if (data.userExists) {
    return {
      props: {
        user: data.user,
        isMyProfile: user.id === data.user.id
      }
    }
  }

  return {
    notFound: true
  }
}