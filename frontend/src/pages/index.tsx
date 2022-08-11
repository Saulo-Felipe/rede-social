import { useState } from "react";
import { NewPost } from "../components/templates/Home/NewPost";
import { Feed } from "../components/templates/Home/Feed";
import { api } from "../services/api";
import Head from "next/head";
import { PostBody } from "../components/utils/Post/index";



export default function Home() {
  const [allPosts, setAllPosts] = useState<PostBody[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [finishPosts, setFinishPosts] = useState(false);

  async function getRecentPosts(reset: boolean) { // if reset all posts after new post;
    setIsLoading(true);

    let { data } = await api().get(`/posts/recent/${reset ? 0 : pageIndex}`);

    setIsLoading(false);

    if (data.success) {   
      if (reset) {
        setAllPosts([
          ...data.posts
        ]);

        setPageIndex(1);

      } else {
        if (data.posts.length > 0) {
          setAllPosts([
            ...allPosts,
            ...data.posts
          ]);
  
          setPageIndex(pageIndex+1)
        } else {
          setFinishPosts(true);
        }
      }

    } else {
      alert("Erro ao buscar posts");
    }
  }

  return (
    <main id={"home_main_feed"}>
      <Head><title>Página Inicial</title></Head>

      <NewPost 
        setIsLoading={setIsLoading}
        getRecentPosts={getRecentPosts}
      />

      <Feed 
        getRecentPosts={getRecentPosts}
        allPosts={allPosts}
        isLoading={isLoading}
        finishPosts={finishPosts}
      />

    </main>
  );
}