import { useState } from "react";
import { NewPost } from "../components/templates/Home/NewPost";
import { Feed } from "../components/templates/Home/Feed";

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main id={"home_main_feed"}>

      <NewPost 
        setAllPosts={setAllPosts}
        allPosts={allPosts}
        setIsLoading={setIsLoading}
      />

      <Feed 
        allPosts={allPosts}
        setAllPosts={setAllPosts}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />

    </main>
  );
}
