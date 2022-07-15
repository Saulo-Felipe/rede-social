import { Post } from "../../../utils/Post";
import { AiOutlineLoading } from "react-icons/ai";
import { useEffect, useState } from "react"; 
import { v4 as uuid } from 'uuid';

import styles from "./Feed.module.scss";

export function Feed({ allPosts, isLoading, getRecentPosts }) {
  let delayTime = 0;

  useEffect(() => {
    console.log("[Feed] renderizou")
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
        allPosts.map((post) => {
          delayTime == 5 ? delayTime = 0 : delayTime++;
          console.log("[renderizou post] ");

          return (
            <Post
              key={post.id}
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