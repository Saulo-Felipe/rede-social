import { useState, useEffect } from "react";
import { NewPost } from "../components/templates/Home/NewPost";
import { Feed } from "../components/templates/Home/Feed";
import { api } from "../services/api";

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  async function getRecentPosts(reset) {
    console.log("get recent posts")
    setIsLoading(true);

    let { data } = await api.post("/getRecentPosts", { paginationIndex: reset ? 0 : pageIndex });

    setIsLoading(false);

    if (data.success) {   
      if (reset) {
        setAllPosts([
          ...data.posts
        ]);

        setPageIndex(1);

      } else {
        setAllPosts([
          ...allPosts,
          ...data.posts
        ]);

        setPageIndex(pageIndex+1)
      }

    } else {
      alert("Erro ao buscar posts");
    }
  }

  return (
    <main id={"home_main_feed"}>

      <NewPost 
        setIsLoading={setIsLoading}
        getRecentPosts={getRecentPosts}
      />

      <Feed 
        getRecentPosts={getRecentPosts}
        allPosts={allPosts}
        isLoading={isLoading}
      />

    </main>
  );
}
