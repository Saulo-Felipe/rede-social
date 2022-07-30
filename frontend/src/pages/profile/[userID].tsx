import { IoMdAddCircle } from "react-icons/io";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { Post } from "../../components/utils/Post";
import { api } from "../../services/api";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./profile.module.scss";

export default function Profile({ user, isMyProfile, isFollowing }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const [followerAmount, setFollowerAmount] = useState(Number(user.followers));
  const [loadingAction, setLoadingAction] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    (async() => {
      setLoading(true);
      console.log("renderizou posts");

      const { data } = await api.get(`/user/posts/${user.id}`);

      setLoading(false);

      if (data.success) {
        setPosts(data.posts);
      }

    })();
  }, [user]);

  async function follow() {
    if (!loadingAction) {
      console.log("follow");

      setLoadingAction(true);

      const { data } = await api.put("/user/new-follow", { 
        userID: session?.user?.id, 
        followerID: user.id 
      });
      
      setLoadingAction(false);

      if (data.success) {
        setFollowing(true);
        setFollowerAmount(followerAmount+1);

      } else {
        alert("Erro ao seguir usuário");
      }      
    }

  }

  async function unFollow() {
    if (!loadingAction) {
      console.log("unFollow");

      setLoadingAction(true);

      const { data } = await api.delete(`/user/unfollow/${session?.user?.id}/${user.id}`);

      setLoadingAction(false);

      if (data.success) {
        setFollowing(false);
        setFollowerAmount(followerAmount-1)
      } else {
        alert("Erro ao parar de seguir usuário.");
      }

    }
  }

  return (
    <div className={styles.profileContainer}>
      <header>
        <div className={styles.title}>
          <div className={styles.imageContainer}>
            <Image 
              src={user.image_url} 
              alt={"profile"}
              width={"100%"}
              height={"100%"}
            />
          </div>

          <div className={styles.userInfo}>
            <div className={styles.username}>{user.username}</div>
            {

              isMyProfile ? <></>
              : following 
                ? (
                  <div className={styles.unFollowButton}>
                    <button
                      onClick={unFollow}
                      disabled={loadingAction}

                    > Seguindo </button>
                  </div>
                ) : (
                  <div className={styles.followButton}>
                    <button 
                      disabled={loadingAction} 
                      onClick={follow}
                    >
                      <IoMdAddCircle /> Seguir 
                    </button>
                  </div>                  
                )
            }
          </div>
        </div>

        {/* <hr/>

        <div className={styles.bottomContent}>
          <div className={styles.iconContainer}>
            <AiOutlineUserAdd />
            {followerAmount} Seguidores
          </div>

          <div className={styles.iconContainer}>
            <AiOutlineUsergroupAdd />
            {user.following} Seguindo
          </div>
        </div> */}
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
                currentUserId={session?.user?.id}
                time={100}
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
  const {user} = await getSession(context);

  const { data } = await api.get(`/user/profile/${params.userID}/${user.id}`);

  if (data.userExists) {
    return {
      props: {
        user: data.user,
        isMyProfile: user.id === data.user.id,
        isFollowing: data.isFollowing
      }
    }
  }

  return {
    notFound: true
  }
}