import { RiImageAddFill } from "react-icons/ri";
import { BiVideoPlus } from "react-icons/bi";
import { api } from "../../../../services/api";
import { useState } from "react";
import { useSession } from "next-auth/react";

import styles from "./NewPost.module.scss";

export function NewPost({ setAllPosts, allPosts, setIsLoading }) {
  const [inputIsOpen, setInputIsOpen] = useState(false);
  const [postTxt, setPostTxt] = useState("");
  const {data: session} = useSession();


  async function handlerNewPost() {
    if (postTxt.length > 0) {
      setPostTxt("");
      setIsLoading(true);

      const { data } = await api.post("/newPost", { post: postTxt, userEmail: session.user.email });

      setIsLoading(false);
  
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
        >Publicarr</button>
      </div>
    </div>    
  );
}