import { Post } from "../../components/utils/Post";
import { api } from "../../services/api";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { Edit } from "../../components/templates/Profile/Edit";
import { RiAddFill } from "react-icons/ri";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { TbEdit } from "react-icons/tb";
import { useAuth } from "../../hooks/useAuth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Router, { useRouter } from "next/router";

import styles from "./profile.module.scss";

ReactModal.setAppElement("#__next")

export interface User {
  id: string;
  image_url: string;
  username: string;
  followers: number;
  following: number;
  created_on: string;
  bio: string;
  cover_color: string;
  havePassword: boolean;
} 

interface ProfileProps {
  user: User;
  isMyProfile: boolean;
  isFollowing: boolean;
}

export default function Profile({ user: serverUSer, isMyProfile, isFollowing }: ProfileProps) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const [loadingAction, setLoadingAction] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { user: myUser } = useAuth();
  const [user, setUser] = useState({ ...serverUSer });
  const [followerAmount, setFollowerAmount] = useState(Number(serverUSer.followers));

  console.log("following: ", following);

  useEffect(() => {
    setUser({ ...serverUSer });
  }, [serverUSer])
  
  useEffect(() => {
    (async() => {
      setLoading(true);

      const { data } = await api().get(`/user/posts/${user.id}`);

      setLoading(false);

      if (data.success) {
        setPosts(data.posts);
      }

    })();
  }, [user.id]);

  async function follow() {
    if (!loadingAction) {
      console.log("follow");

      setLoadingAction(true);

      const { data } = await api().put("/user/new-follow", { 
        userID: myUser?.id, 
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

      const { data } = await api().delete(`/user/unfollow/${myUser?.id}/${user.id}`);

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
      <Head><title>{user.username} - Perfil</title></Head>

      {
        isMyProfile
        ? <Edit 
          user={user} 
          setUser={setUser}
          useModalIsOpen={{ modalIsOpen, setModalIsOpen }}
        />
        : <></>
      }

      <header className={styles.userHeader}>
        <div className={styles.cover} style={{ background: user.cover_color }}>
          {
            isMyProfile 
            ? <div 
              className={styles.editIconContainer}
              onClick={() => setModalIsOpen(true)}
            ><TbEdit /></div>
            : <></>
          }

          <h2 className={styles.username}>
            { user.username }
          </h2>
        </div>

        <div className={styles.profileInfo}>

          <div className={styles.firstContainer}>

            <div className={styles.containInfo}>
              <div className={styles.userPicture}>
                <div className={styles.profileImageContainer}>
                  <img src={user.image_url} alt={"profile"} />
                </div>  
              </div>

            </div>

            <div className={`${styles.action} ${styles.columnOption}`}>
              <strong>{user.following}</strong> 
              <span>Seguindo</span>
            </div>

            <div className={`${styles.action} ${styles.columnOption}`}>
              <strong>{followerAmount}</strong>
              <span>{followerAmount > 1 || followerAmount == 0 ? "Seguidores" : "Seguidor"}</span>
            </div>

            <div className={`${styles.bio} ${styles.columnOption}`}>{user.bio}</div>

            <div className={`${styles.userCreatedOn} ${styles.columnOption}`}>Usuário desde {user.created_on}</div>
          </div>

          {
            !isMyProfile 
            ? (
              <div 
                className={styles.secondContainer}>
                <button 
                  className={`${styles.actionBtn} ${following ? styles.unFollowBtn : styles.followBtn}`}
                  disabled={loadingAction}
                  onClick={following ? unFollow : follow}
                >
                  { following ? "Seguindo" : <>Seguir <RiAddFill /></> }
                </button>
              </div>
            ) : <></>
          }


        </div>

      </header>

      <section>

        <h2>
        {
          isMyProfile 
          ? `Minhas publicações (${posts.length})`
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
                currentUserId={myUser?.id}
              />
            )
          )
        }
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const { data: { user } } = await api(context).get("/user/current");

  if (user) {
    const { data } = await api(context).get(`/user/profile/${params.userID}/${user.id}`);

    console.log("following: ", data.isFollowing)

    if (data.userExists) {
      return {
        props: {
          key: params.userID,
          user: data.user,
          isMyProfile: user.id === data.user.id,
          isFollowing: data.isFollowing
        }
      }
    }

    return {
      notFound: true
    }


  } else {
    return {
      props: {},
      redirect: "/auth/login"
    }
  }
}