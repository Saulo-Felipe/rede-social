import { useEffect, useState } from "react";
import { Post } from "../components/Post";
import { RiImageAddFill } from "react-icons/ri";
import { BiVideoPlus } from "react-icons/bi";
import { api } from "../services/api";
import { useSession } from "next-auth/react";

import styles from "./home.module.scss";

export default function() {
  const {data: session} = useSession();
  const [inputIsOpen, setInputIsOpen] = useState(false);
  const [postTxt, setPostTxt] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  
  async function handlerNewPost() {
    if (postTxt.length > 0) {
      const { data } = await api.post("/newPost", { post: postTxt, userEmail: session.user.email });
  
      if (data.success) {
        setAllPosts([
          {
            username: session.user.name,
            user_picture: session.user.image,
            post: {
              content: postTxt
            }
          },
          ...allPosts
        ]);
      } else {
        alert("Erro ao criar post");
      }
    } else {
      alert("Nenhum dado para cadastrar");
    }
  }

  useEffect(() => {
    (async () => {
      let { data } = await api.post("/getRecentPosts");
      console.log(data);
      if (data.success) {
        let posts = [];
  
        for (let i = 0; i < data.posts.length; i++) {
          posts.push({
            username: data.posts[i].username,
            user_picture: data.posts[i].image_url,
            post: {
              content: data.posts[i].content,
            }
          });
        }
  
        setAllPosts(posts);
      }
    })();

  }, [])

  return (
    <main className={styles.homeMain}>
      <div className={styles.postContainer}>
        <h2>Criar um novo post</h2>

        <hr />

        {
          inputIsOpen
          ? <textarea 
            type={"text"} 
            placeholder={"Coloque aqui seu texto :)"}
            value={postTxt}
            onChange={(e) => setPostTxt(e.target.value)} 
            onBlur={ ({ target }) => target.value.length === 0 ? setInputIsOpen(false) : "" }
            autoFocus={true}
          /> 
          : <input 
            onFocus={() => setInputIsOpen(true)} 
            type={"text"} 
            placeholder={"Digite alguma coisa..."} 
          />
        }

        <div className={styles.allIcons}>
          <div>
            <div className={styles.iconContainer}>
              <RiImageAddFill />
            </div>

            <div className={styles.iconContainer}>
              <BiVideoPlus />
            </div>
          </div>

          <button
            disabled={postTxt.length == 0}
            onClick={handlerNewPost}
          >Publicar</button>
        </div>
      </div>

      <div className={styles.feed}>
        <div className={styles.postsContent}>
          <h1 className={styles.title}>Últimas postagens</h1>

          {
            allPosts.map((post, index) =>
              <Post 
                key={index}
                userName={post.username}
                userPicture={post.user_picture}
                content={post.post.content}
              />
            )
          }

        </div>
      </div>

    </main>
  );
}
