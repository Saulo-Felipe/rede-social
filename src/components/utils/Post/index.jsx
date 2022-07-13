import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { useState } from "react";
import Link from "next/link";

import styles from "./Post.module.scss";

export function Post({ userID, userName, userPicture, content, createdOn }) {
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  
  return (
  <div className={styles.post}>
    <header>
      <div className={styles.profilePictureContainer}>
        <img 
          className={styles.profilePicture}
          src={userPicture} 
        />
      </div>
      
      <div className={styles.username}>
        <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${userID}`}>
          <a>
            {userName}
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
          onMouseEnter={() => like ? null : setLike(true)}
          onMouseLeave={() => !like ? null : setLike(false)}
        >
          {
            like ? <AiFillLike /> : <AiOutlineLike />
          }
          100
        </div>

        <div 
          className={styles.dislike}
          onMouseEnter={() => dislike ? null : setDislike(true)}
          onMouseLeave={() => !dislike ? null : setDislike(false)}
        >
          {
            dislike ? <AiFillDislike /> : <AiOutlineDislike /> 
          }
          
          87
        </div>
      </div>

      <div className={styles.publicationDate}>
        {createdOn.replace(",", "/").replace(",", "/").replace(",", " às " )}
      </div>
    </footer>
  </div>  
  );
}