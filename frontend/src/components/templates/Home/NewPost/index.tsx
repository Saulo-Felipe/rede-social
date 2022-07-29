import { api } from "../../../../services/api";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuid } from "uuid";
import Image from "next/image"; 

import { IoCloseCircleSharp } from "react-icons/io5";
import { BsFillTrashFill } from "react-icons/bs";
import { RiImageAddFill } from "react-icons/ri";
import { BiVideoPlus } from "react-icons/bi";

import styles from "./NewPost.module.scss";

export function NewPost({ setIsLoading, getRecentPosts }) {
  const [inputIsOpen, setInputIsOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const {data: session} = useSession();
  
  const [previewImages, setPreviewImages] = useState([]);
  const inputImagesRef = useRef(null);

  function getCurrentDate() {
    let date = new Date().toLocaleString().split(" ")
    let fullHours = date[1].substring(0, 5);
    
    return date[0]+" as "+fullHours;
  }

  async function handlerNewPost() {
    if (postContent.length > 0 || inputImagesRef.current.files.length > 0) {
      const dataForm = new FormData();

      console.log("[FILES]: ", inputImagesRef.current.file);

      for (let file of inputImagesRef.current.files) {
        dataForm.append("file", file);
      }

      dataForm.append("body", postContent);
      dataForm.append("body", JSON.stringify({userID: session.user.id}));
      dataForm.append("body", JSON.stringify({createdOn: getCurrentDate()}))
      
      setPostContent("");
      setIsLoading(true);
      
      const { data } = await api.put("/posts/create", { 
        dataForm
      }, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
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


  async function addImage() {
    let updatePreviewImages = [];
    for (let file of inputImagesRef.current.files) {
      updatePreviewImages.push({
        id: uuid(),
        url: URL.createObjectURL(file)
      });
    }

    setPreviewImages([ ...updatePreviewImages]);
  }

  function adjustPreviewImageSize(image) {
    if (image.width >= image.height) {
      image.style.width = "100%";
      image.style.height = "auto";
    } else {
      image.style.height = "100%";
      image.style.width = "auto";
    }
  }

  function deletePreview(id: string) {
    let newPreview = [];

    for (let c = 0; c < previewImages.length; c++) {
      if (previewImages[c].id !== id) {
        newPreview.push(previewImages[c]);
      }
    }

    setPreviewImages([ ...newPreview ]);
  }

  return (
    <div className={styles.postContainer}>
      <h2>Criar uma nova postagem</h2>

      <hr />

      {
        inputIsOpen
        ? <textarea 
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

      { previewImages.length > 0 ? <hr /> : null }

      <div className={styles.previewFiles}>

        {
          previewImages.map((item, index) => 
            <div 
              className={styles.imageContainer}
              onClick={() => deletePreview(item.id)}
              key={index}
            >
              <IoCloseCircleSharp />
              <div className={styles.onHoverBg}><BsFillTrashFill /></div>
              <img 
                onLoad={({target}) => adjustPreviewImageSize(target)}
                src={item.url} 
              />
            </div>
          )
        }
      </div>      

      <div className={styles.allIcons}>
        <div>
          <label
            htmlFor="newimage"
            id={styles.newImage} 
            className={styles.iconContainer}
          >
            <input 
              id="newimage" 
              type={"file"} 
              multiple 
              ref={inputImagesRef} 
              onChange={addImage}
              accept={"image/*"}
            />

            <RiImageAddFill />
          </label>

          <div className={styles.iconContainer}>
            <BiVideoPlus />
          </div>
        </div>

        <button
          disabled={postContent.length == 0 && inputImagesRef.current?.files?.length == 0}
          onClick={handlerNewPost}
        >Publicar</button>
      </div>

    </div>    
  );
}