import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { CgSpinnerTwo } from "react-icons/cg";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../../services/api";


import styles from "./Post.module.scss";

export function Post({ data, time }) {
  const [loadingLike, setLoadingLike] = useState(true);
  const {
    id,
    content,
    created_on,
    fk_user_id,
    image_url,
    dislikes_amount,
    likes_amount,
    username
  } = data;

  const [action, setAction] = useState({
    isLike: false,
    isDislike: false,
    userAction: 0,
    likeAmount: Number(likes_amount),
    dislikeAmount: Number(dislikes_amount)
  });

  useEffect(() => {
    setLoadingLike(true);

    setTimeout(async () => {
      const {data} = await api.post("/userLikedPost", { postID: id, userID: fk_user_id });

      setLoadingLike(false);

      if (data.type === "like") {
        setAction({ ...action, isLike: true, userAction: 1 });
      } else if (data.type === "disliked") {
        setAction({ ...action, isDislike: true, userAction: 2 });
      }

    }, time);
  }, [])

  function handleLike(type) {
    if (type === "mouseEnter") {
      setAction({ ...action, isLike: true });
    }
    else if (action.userAction !== 1) {
      setAction({ ...action, isLike: false });
    }
  }

  function handleDislike(type) {
    if (type === "mouseEnter") {
      setAction({ ...action, isDislike: true });
    }
    else if (action.userAction != 2) {
      setAction({ ...action, isDislike: false });
    }
  }

  async function handleNewLike() {
    console.log("New like")

    if (action.userAction == 1) {
      const { data } = await api.post("/deleteAction", {
        userID: fk_user_id,
        postID: id,
      });
      
      if (data.success) {
        setAction({ ...action, likeAmount: action.likeAmount-1, isLike: false, userAction: 0 });
      } else {
        alert("Ocorreu um erro ao remover curtida")
      }

    } else {
      const { data } = await api.post(`/newAction`, {
        userID: fk_user_id,
        postID: id,
        action: "Like",
        deleteOthers: action.userAction == 2
      });

      if (data.success) {
        setAction({ ...action , isLike: true, userAction: 1, likeAmount: action.likeAmount+1 })
      } else {
        alert("Erro ao adicionar curtida")
      }
    }
  }

  function handleNewDislike() {
    console.log("New dislike")
  }


  return (
    <div className={styles.post}>
      <header>
        <div className={styles.profilePictureContainer}>
          <img
            className={styles.profilePicture}
            src={image_url}
          />
        </div>

        <div className={styles.username}>
          <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${fk_user_id}`}>
            <a>
              {username}
            </a>
          </Link>
        </div>
      </header>

      <hr />

      <section className={styles.postContainer}>
        { content }
      </section>

      <footer>
        <div>
          <div className={styles.like}
            onMouseEnter={() => handleLike("mouseEnter")}
            onMouseLeave={() => handleLike("mouseLeave")}
            onClick={handleNewLike}
          >
            {
              loadingLike
              ? (
                <div style={{ color: "gray" }}>
                  <AiOutlineLike style={{ color: "gray" }} /> 0
                </div>
              ) : (
                <>
                  { action.isLike ? <AiFillLike  /> : <AiOutlineLike /> }
                  { action.likeAmount }
                  {/* // ? <div className="loadingContainer color-blue"><CgSpinnerTwo /></div>  */}
                </>
              )
            }
          </div>

          <div
            className={styles.dislike}
            onMouseEnter={() => handleDislike("mouseEnter")}
            onMouseLeave={() => handleDislike("mouseLeave")}
            onClick={handleNewDislike}
          >
            {
              loadingLike
              ? (
                <div style={{ color: "gray" }}>
                  <AiFillDislike style={{ color: "gray" }} /> 0
                </div>
              ) : (
                <>
                  { action.isDislike ? <AiFillDislike  /> : <AiOutlineDislike /> }
                  { action.dislikeAmount }
                  {/* // ? <div className="loadingContainer color-blue"><CgSpinnerTwo /></div>  */}
                </>
              )
            }
          </div>
        </div>

        <div className={styles.publicationDate}>
          {
            created_on.replace(",", "/").replace(",", "/").replace(",", " às " )
          }
        </div>
      </footer>
    </div>
  );
}