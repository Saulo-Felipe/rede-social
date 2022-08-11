import { Post, PostBody } from "../../../utils/Post";
import { useEffect } from "react"; 
import { BsSignpostSplitFill } from "react-icons/bs";
import { MdWallpaper } from "react-icons/md";
import { useAuth } from "../../../../hooks/useAuth";
import { ImSpinner2 } from "react-icons/im";

import styles from "./Feed.module.scss";


interface FeedProps {
  allPosts: PostBody[];
  isLoading: boolean;
  getRecentPosts: (reset: boolean) => void;
  finishPosts: boolean;
}

export function Feed({ allPosts, isLoading, getRecentPosts, finishPosts }: FeedProps) {
  let delayTime = 0;
  const { user } = useAuth();

  useEffect(() => {
    getRecentPosts(true);
  }, [])

  return (
    <div className={styles.feed}>

      {
        isLoading
        ? <div className={"loadingContainer"}><ImSpinner2 className={styles.spin} /></div>
        : <></>
      }

      <h2 className={styles.title}>Últimas postagens</h2>

      <hr className={styles.division} />

      {
        allPosts.length === 0
        ? (
          <div className={styles.notHavePosts}><BsSignpostSplitFill /> Nenhum post encontrado</div>
        ) : (
          allPosts.map(post => {
            delayTime == 5 ? delayTime = 0 : delayTime++;
            
            return (
              <Post
                key={post.id}
                data={post}
                currentUserId={user?.id}
              />
            )
          })
        )
      }

      <div className={styles.loadMorePosts}>
        {
          !finishPosts
          ? (
            <button  
              className="loadingContainer" 
              onClick={() => !isLoading ? getRecentPosts(false) : null}
              disabled={isLoading}
            >
              Carregar mais posts {isLoading ? <ImSpinner2 /> : <></>}
            </button>

          ) : (
            <div className={styles.noHavePosts}>
              <div>
                Você chegou ao fim. Não tem mais posts, crie uma postagem!
              </div>

              <div><MdWallpaper /></div>
            </div>
          )
        }
      </div>

    </div>
  );
}