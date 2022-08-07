import ReactModal from "react-modal";
import { CgColorBucket } from "react-icons/cg";
import { User } from "../[userID]";
import { IoClose } from "react-icons/io5";
import { MdAddPhotoAlternate, MdOutlineColorLens } from "react-icons/md";
import { useAuth } from "../../../hooks/useAuth";
import { BiRightArrowAlt } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { useForm } from "react-hook-form";


import styles from "./styles.module.scss";
import { FaCheckCircle } from "react-icons/fa";
import { BsPatchCheck, BsPatchCheckFill } from "react-icons/bs";


interface EditProps {
  user: User;
  useModalIsOpen: {
    modalIsOpen: boolean;
    setModalIsOpen: (args: boolean) => void;
  }
}

interface FinishChangesProps {
  bio: string;
  name: string;
  picture: null | File;
  cover_color: string | null;
  currentPassword: string;
  newPassword: string;
}

export function Edit({ user, useModalIsOpen }: EditProps) {
  const { modalIsOpen, setModalIsOpen } = useModalIsOpen;
  const { user: currentUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [changeUserInfo, setChangesUserInfo] = useState<FinishChangesProps>({
    bio: user?.bio,
    cover_color: user?.cover_color,
    currentPassword: "",
    newPassword: "",
    name: user?.username,
    picture: null as File
  });
  const colors = ["#009688", "#607d8b", "#2F5BAC", "#795548", "#2196f3", "#9900ef", "#ff9800", "#ff5722", "#8bc34a", "#9c27b0", "#4db6ac"]
  const [selectedColor, setSelectedColor] = useState(user?.cover_color);


  return (
    <ReactModal
      isOpen={modalIsOpen}
      onAfterOpen={() => document.body.style.overflow = "hidden"}
      onRequestClose={() => {setModalIsOpen(false); document.body.style.overflow = "auto"}}
      overlayClassName={"modalOverlay"}
      className={"modal-content"}
    >
      <IoClose
        className="close-modal-icon"
        onClick={() => setModalIsOpen(false)}
      />

      <form onSubmit={e => e.preventDefault()}>
        <section className={styles.customization}>
          <h2 className={styles.title}>
            <div>Customização</div>
            <hr />
          </h2>

          <h3 className={styles.subTitle}>
            <div>Foto de perfil</div>
            <hr />
          </h3>

          <div className={styles.imageChangeContainer}>
            <div className={`${styles.currentProfileImage} ${styles.profileImage}`}>
              <div className={styles.imageContainer}>
                <img src={currentUser?.picture} alt={"user profile"}/>
              </div>

              <div className={styles.previewTitle}>Antes</div>
            </div>

            <BiRightArrowAlt className={styles.arrowAfterIcon} />

            <div className={`${styles.afterProfileImage} ${styles.profileImage}`}>
              <label htmlFor="select-image" className={styles.imageContainer}>
                {
                  !changeUserInfo.picture
                  ? <>
                    <MdAddPhotoAlternate />
                    <span>Nenhuma foto selecionada</span>                  
                  </>
                  : <img src={URL.createObjectURL(changeUserInfo.picture)} alt={"preview user picture"} />
                }
              </label>
              
              { 
                changeUserInfo.picture 
                ? <div 
                    className={styles.deletePreview} 
                    onClick={() => {
                      setChangesUserInfo({ ...changeUserInfo, picture: null });
                      (document.getElementById("select-image") as HTMLInputElement).value = null
                    }
                    }>
                      Remover</div> 
                : <div className={styles.previewTitle}>Depois</div>
              }

              <input
                id={"select-image"}
                type={"file"}
                onChange={({target}) =>
                  setChangesUserInfo({
                    ...changeUserInfo,
                    picture: target.files[0]
                  })
                }
              />

            </div>
          </div>

          <h3 className={styles.subTitle}>
            <div>Cor da capa</div>
            <hr />
          </h3>

          <div className={styles.changeCoverContainer}>
            {
              colors.map((item) => 
                <div 
                  key={item}
                  className={styles.optionContainer} 
                > 
                  <div 
                    style={{ background: item }} 
                    className={`${styles.optionColor} ${selectedColor == item ? styles.selected : null}`}
                    onClick={() => setSelectedColor(item)}
                  >
                    {selectedColor == item ? <BsPatchCheckFill /> : null}
                  </div>
                  <div className={styles.colorName}>{item}</div>
                </div>
              )
            }
          </div>
        </section>

        <section className={styles.personalData}>
          <h2 className={styles.title}>
            <div>Dados pessoais</div>
            <hr />
          </h2>

          <div className={styles.formControl}>
            <label>Nome</label>
            <input
              placeholder={"Seu novo nome"}
              defaultValue={user?.username}
            />
          </div>

          <div className={styles.formControl}>
            <label>Bio (biográfia)</label>
            <input
              defaultValue={user?.bio}
            />
          </div>

          <div className={`${styles.formControl} ${styles.disabled}`}>
            <label>Email <span className={styles.obs}> (Não editável)</span></label>
            <input disabled={true} defaultValue={currentUser?.email}/>
          </div>

          <h3 className={styles.subTitle}>
            <div>Alteração de senha <span className={styles.obs}>(Deixe em branco se não deseja alterar)</span></div>
            <hr />
          </h3>          

          <div className={styles.formControl}>
            <label>Senha atual</label>
            <input
              placeholder={"Sem alterações"}
              type={showPassword ? "text" : "password"}
            />
          </div>

          <div className={styles.formControl}>
            <label>Nova senha</label>
            <input
              placeholder={"Sem alterações"}
              type={showPassword ? "text" : "password"}
            />
          </div>

          <div className={styles.showPassword}>
            <input
              id={"show-password"}
              type={"checkbox"}
              defaultValue={currentUser?.name}
              onChange={({target}) => setShowPassword(target.checked)}
            />
            <label htmlFor="show-password">Mostrar senha</label>
          </div>  

          <div className={styles.actionBtnsContainer}>
            <button className={styles.cancel}>Cancelar</button>
            <button type={"submit"} className={styles.submit}>Alterar Senha</button>          
          </div>

        </section>
      </form>

    </ReactModal>
  );
}