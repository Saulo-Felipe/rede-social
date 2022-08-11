import { api } from "../../../../services/api";
import { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";

import { IoCloseCircleSharp } from "react-icons/io5";
import { RiImageAddFill } from "react-icons/ri";

import styles from "./NewPost.module.scss";
import { useAuth } from "../../../../hooks/useAuth";

interface SelectedImages {
  id: string;
  file: File;
}

export function getCurrentDate() {
  let date = new Date().toLocaleString().split(" ")
  let fullHours = date[1].substring(0, 5);
  
  return date[0]+" às "+fullHours;
}

export function NewPost({ setIsLoading, getRecentPosts }) {
  const [inputIsOpen, setInputIsOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<SelectedImages[]>([]);
  const inputImagesRef = useRef(null);
  const [previewFile, setPreviewFile] = useState(null);
  const { user } = useAuth();

  async function handlerNewPost() {
    if (postContent.length > 0 || selectedImages.length > 0) {
      setPostContent("");
      setSelectedImages([]);
      setIsLoading(true);

      const dataForm = new FormData();

      for (let obj of selectedImages) {
        dataForm.append("picture", obj.file);
      }
      
      dataForm.append("body", JSON.stringify({
        createdOn: getCurrentDate(),
        postContent, 
        userID: user?.id
      }));

      const { data } = await api().put("/posts/create", 
        dataForm, {
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
        file
      });
    }

    setSelectedImages([ ...selectedImages, ...updatePreviewImages]);
  }

  function deletePreview(id: string) {
    let newPreview = [];

    for (let c = 0; c < selectedImages.length; c++) {
      if (selectedImages[c].id !== id) {
        newPreview.push(selectedImages[c]);
      }
    }

    setSelectedImages([ ...newPreview ]);
  }

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (previewFile)
        document.body.style.overflow = "hidden";
      else 
        document.body.style.overflow = "auto";
    }
  }, [previewFile]);

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
          placeholder={"Escreva algo ou publique uma imagem..."} 
        />
      }

      { selectedImages.length > 0 ? <hr /> : null }

      <div className={styles.previewFiles}>

        {
          selectedImages.map(item => 
            <div 
              className={styles.SelectedImageContainer}
              key={item.id}
            >
              <div 
                className={styles.setPreviewBg} 
                onClick={() => setPreviewFile(item)}
              ></div>

              <IoCloseCircleSharp onClick={() => deletePreview(item.id)} />

              <img 
                src={URL.createObjectURL(item.file)} 
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
        </div>

        <button
          disabled={postContent.length == 0 && inputImagesRef.current?.files?.length == 0}
          onClick={handlerNewPost}
        >Publicar</button>
      </div>

      {
        previewFile !== null
        ? 
          <div className={styles.previewContainer}>
            <div className={styles.bg} onClick={() => setPreviewFile(null)}>
            </div>

            <div className={styles.content}>
              <div className={styles.closeIconContainer} onClick={() => setPreviewFile(null)}>
                <IoCloseCircleSharp />
              </div>
              
              <div className={styles.imageContainer}>
                <img 
                  alt={"preview"} 
                  src={URL.createObjectURL(previewFile.file)}
                />
              </div>

              <div className={styles.options}>
                {
                  selectedImages.map((item) => 
                    <div 
                      className={styles.aOption} 
                      onClick={() => setPreviewFile(item)}
                      key={item.id}
                      style={
                        previewFile.id === item.id 
                        ? { transform: "scale(0.8)", border: "solid 1px var(--default-blue)" } 
                        : {}
                      }
                    >
                      <img src={URL.createObjectURL(item.file)} alt={"select option to view"} />
                    </div>
                  )
                }
              </div>

            </div>
          </div>
        : <></>
      }

    </div>    
  );
}