import { useState } from "react";
import { Post } from "../components/Post";
import { RiImageAddFill } from "react-icons/ri";
import { BiVideoPlus } from "react-icons/bi";


import styles from "./home.module.scss";

export default function() {
  const [inputIsOpen, setInputIsOpen] = useState(false);
  const [postTxt, setPostTxt] = useState("");

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

          <button>Publicar</button>
        </div>
      </div>

      <div className={styles.feed}>
        <div className={styles.postsContent}>
          <h1 className={styles.title}>Últimas postagens</h1>

          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
      </div>

    </main>
  );
}
