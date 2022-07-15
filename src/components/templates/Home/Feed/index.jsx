import { Post } from "../../../utils/Post";
import { AiOutlineLoading } from "react-icons/ai";
import { useEffect, useState } from "react"; 

import styles from "./Feed.module.scss";

export function Feed({ allPosts, isLoading, getRecentPosts }) {
  let delayTime = 0;

  useEffect(() => {
    getRecentPosts(true);
  }, [])

  return (
    <div className={styles.feed}>

      {
        isLoading
        ? <div className={"loadingContainer"}><AiOutlineLoading /></div>
        : <></>
      }

      <h1 className={styles.title}>Últimas postagens</h1>
      {
        allPosts.map((post, index) => {
          delayTime == 5 ? delayTime = 0 : delayTime++

          return (
            <Post
              key={index}
              data={post}
              time={750*delayTime}
            />
          )
        })
      }
      {
        !isLoading 
        ? (
          <div className={styles.loadMorePosts}>
            <button onClick={() => getRecentPosts(false)}>Carregar mais posts</button>
          </div>
        ) : ( <></> )
      }

    </div>
  );
}