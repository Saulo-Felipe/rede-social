import ReactModal from "react-modal";
import { IoClose } from "react-icons/io5";
import { MdAddPhotoAlternate } from "react-icons/md";
import { BiRightArrowAlt } from "react-icons/bi";
import { useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import { toast } from "react-toastify";
import { BsPatchCheckFill } from "react-icons/bs";
import { User } from "../../../../pages/profile/[userID]";
import { useAuth } from "../../../../hooks/useAuth";
import { api } from "../../../../services/api";


import styles from "./styles.module.scss";


interface EditProps {
  user: User;
  setUser: (newState: User) => void;
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
  id: string;
}

export function Edit({ user, setUser, useModalIsOpen }: EditProps) {
  const { modalIsOpen, setModalIsOpen } = useModalIsOpen;
  const { user: currentUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [changeUserInfo, setChangesUserInfo] = useState<FinishChangesProps>({
    bio: user?.bio,
    cover_color: user?.cover_color,
    currentPassword: "",
    newPassword: "",
    name: user?.username,
    picture: null,
    id: user?.id
  });
  const colors = ["#009688", "#607d8b", "#2F5BAC", "#795548", "#2196f3", "#9900ef", "#ff9800", "#ff5722", "#8bc34a", "#9c27b0", "#4db6ac"]
  const [haveChanges, setHaveChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    if (
      (changeUserInfo.bio !== user.bio || 
      changeUserInfo.cover_color !== user.cover_color ||
      changeUserInfo.name !== user.username ||
      changeUserInfo.picture !== null ||
      changeUserInfo.newPassword !== "" ||
      changeUserInfo.currentPassword !== "") 
      && !haveChanges
    )
      setHaveChanges(true);
    else if (
      (changeUserInfo.bio === user.bio && 
        changeUserInfo.cover_color === user.cover_color &&
        changeUserInfo.name === user.username &&
        changeUserInfo.picture === null &&
        changeUserInfo.newPassword === "" &&
        changeUserInfo.currentPassword === "") 
        && haveChanges
    )
        setHaveChanges(false);
  }, [changeUserInfo]);


  async function submitChanges() {
    const dataForm = new FormData();

    if (changeUserInfo.picture) {
      dataForm.append("picture", changeUserInfo.picture);
    }

    dataForm.append("body", JSON.stringify({ ...changeUserInfo }));

    setIsLoading(true);

    const { data } = await api().post("/user/update-info", 
    dataForm, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    setIsLoading(false);

    if (data.success) {
      toast.success("Alteração salva.");

      setUser({
        ...user,
        bio: changeUserInfo.bio,
        cover_color: changeUserInfo.cover_color,
        image_url: changeUserInfo.picture ? URL.createObjectURL(changeUserInfo.picture) : user.image_url,
        username: changeUserInfo.name
      });
      
      setChangesUserInfo({
        ...changeUserInfo,
        newPassword: "",
        currentPassword: "",
        picture: null
      });

      updateUser();

      setModalIsOpen(false);
    } else {
      toast.warn(data.message);
    }
  }

  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [modalIsOpen]);

  return (
    <ReactModal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
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
                    className={`${styles.optionColor} ${changeUserInfo.cover_color == item ? styles.selected : null}`}
                    onClick={() => setChangesUserInfo({ ...changeUserInfo, cover_color: item })}
                  >
                    {changeUserInfo.cover_color == item ? <BsPatchCheckFill /> : null}
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
              onChange={({target}) => setChangesUserInfo({ ...changeUserInfo, name: target.value })}
              value={changeUserInfo.name}
              placeholder={"Seu novo nome"}
            />
          </div>

          <div className={styles.formControl}>
            <label>Bio (biográfia)</label>
            <input
              onChange={({target}) => setChangesUserInfo({ ...changeUserInfo, bio: target.value })}
              value={changeUserInfo.bio}
              placeholder={"Sua bio"}
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
          
          {
            user.havePassword
            ? <div className={styles.formControl}>
              <label>Senha atual</label>
              <input
                onChange={({target}) => setChangesUserInfo({ ...changeUserInfo, currentPassword: target.value })}
                value={changeUserInfo.currentPassword}
                placeholder={"Sem alterações"}
                type={showPassword ? "text" : "password"}
              />
            </div>
            : <></>
          }

          <div className={styles.formControl}>
            <label>Nova senha</label>
            <input
              onChange={({target}) => setChangesUserInfo({ ...changeUserInfo, newPassword: target.value })}
              value={changeUserInfo.newPassword}
              placeholder={"Sem alterações"}
              type={showPassword ? "text" : "password"}
            />
          </div>

          <div className={styles.showPassword}>
            <input
              id={"show-password"}
              type={"checkbox"}
              onChange={({target}) => setShowPassword(target.checked)}
            />
            <label htmlFor="show-password">Mostrar senha</label>
          </div>  
          
          {
            isLoading
            ? <div className={`${styles.loading} loadingContainer`}>
              <ImSpinner10 />
            </div>
            : <></>
          }
            
          <div className={styles.actionBtnsContainer}>
            <button 
              className={styles.cancel}
              onClick={() => {
                setChangesUserInfo({
                  bio: user?.bio,
                  cover_color: user?.cover_color,
                  currentPassword: "",
                  newPassword: "",
                  name: user?.username,
                  picture: null,
                  id: user?.id                 
                });
                setModalIsOpen(false);
              }}
            >Cancelar</button>
            <button 
              type={"submit"} 
              className={styles.submit} 
              onClick={submitChanges}
              disabled={!haveChanges || isLoading}
            >
              Salvar alterações</button>          
          </div>

        </section>
      </form>

    </ReactModal>
  );
}