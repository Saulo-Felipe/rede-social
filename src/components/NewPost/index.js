import { useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { BiVideoPlus } from "react-icons/bi";
 
import styles from "./styles.module.scss";

export function NewPost() {
  const [inputIsOpen, setInputIsOpen] = useState(false);
  const [postTxt, setPostTxt] = useState("");

  function verifyInputIsEmpty() {
    if (postTxt.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  return (
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
          onBlur={ () => verifyInputIsEmpty() ? setInputIsOpen(false) : "" }
          
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
  );
}