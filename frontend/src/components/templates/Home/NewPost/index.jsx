import { RiImageAddFill } from "react-icons/ri";
import { BiVideoPlus } from "react-icons/bi";
import { api } from "../../../../services/api";
import { useState } from "react";
import { useSession } from "next-auth/react";

import styles from "./NewPost.module.scss";

export function NewPost({ setIsLoading, getRecentPosts }) {
  const [inputIsOpen, setInputIsOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const {data: session} = useSession();

  function getCurrentDate() {
    let date = String(new Date()).split(" ");
    date = date[2] + "," + date[1] + "," + date[3] + "," + date[4];
    
    return date;
  }

  async function handlerNewPost() {
    if (postContent.length > 0) {
      setPostContent("");
      setIsLoading(true);
      
      const { data } = await api.post("/createPost", { 
        postContent, 
        userID: session.user.id,
        date: getCurrentDate()
      });

      setIsLoading(false);
      setInputIsOpen(false);

  
      if (data.success) {
        getRecentPosts(true);

      } else {
        alert("Erro ao criar post");
      }
    }
  }

  return (
    <div className={styles.postContainer}>
      <h2>Criar um novo posts</h2>

      <hr />

      {
        inputIsOpen
        ? <textarea 
          type={"text"} 
          placeholder={"Coloque aqui seu texto :)"}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)} 
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
          disabled={postContent.length == 0}
          onClick={handlerNewPost}
        >Publicar</button>
      </div>
    </div>    
  );
}