import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { CgSpinnerTwo } from "react-icons/cg";
import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./Post.module.scss";
import { api } from "../../../services/api";

export function Post({ data, time }) {
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [likedOrDisliked, setLikedOrDisliked] = useState(0);
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

  useEffect(() => {
    setLoadingLike(true);
    setTimeout(async () => {
      const {data} = await api.post("/userLikedPost", { postID: id, userID: fk_user_id });

      setLoadingLike(false);
      
      if (data.type === "like") {
        console.log(fk_user_id + " liked " + id);
      } else if (data.type === "disliked") {
        console.log(fk_user_id + " disliked " + id);
      } else {
        //console.log("No action for "+id);
      }      
    }, time);
  }, [])
  
  function handleLike(type) {
    if (type === "mouseEnter" && (likedOrDisliked == 0 || likedOrDisliked == 2)) {
      setLike(true);
    } 
    else if (likedOrDisliked != 1) {
      setLike(false);
    }
  }

  function handleDislike(type) {
    if (type === "mouseEnter" && (likedOrDisliked == 0 || likedOrDisliked == 1)) {
      setDislike(true);
    } 
    else if (likedOrDisliked != 2) {
      setDislike(false);
    }
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
          >
            { like ? <AiFillLike /> : <AiOutlineLike /> }
            { 
              loadingLike
              ? <div className="loadingContainer color-blue"><CgSpinnerTwo /></div> 
              : likes_amount 
            }
          </div>

          <div 
            className={styles.dislike}
            onMouseEnter={() => handleDislike("mouseEnter")}
            onMouseLeave={() => handleDislike("mouseLeave")}
          >
            { dislike ? <AiFillDislike /> : <AiOutlineDislike /> }
            
            { 
              loadingLike  
              ? <div className="loadingContainer color-red"><CgSpinnerTwo /></div> 
              : dislikes_amount
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