import ReactModal from "react-modal";
import { CgColorBucket } from "react-icons/cg";
import { User } from "../[userID]";
import { IoClose } from "react-icons/io5";
import { MdAddAPhoto } from "react-icons/md";


import styles from "./styles.module.scss";
import { useAuth } from "../../../hooks/useAuth";
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs";


interface EditProps {
  user: User;
  useModalIsOpen: {
    modalIsOpen: boolean;
    setModalIsOpen: (args: boolean) => void;
  }
}

export function Edit({ user, useModalIsOpen }: EditProps) {
  const { modalIsOpen, setModalIsOpen } = useModalIsOpen;
  const { user: currentUser } = useAuth();

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

      <form className={styles.content}>
        <h3 className={styles.modalTitle}>Customização</h3>

        <div className={styles.imageContainer}>
          <div className={styles.changeBg}><MdAddAPhoto /></div>
          <img width={"100%"} height={"100%"} src={user.image_url} />
        </div>


        <section className={styles.changeCover}>
          <div className={styles.customCover}>
            <div className={styles.customCoverTitle}>
              <div >
                Capa customizada
              </div>
              <CgColorBucket />
            </div>
          </div>

          <div className={styles.coverDefaultContainer}>
            <div className={`${styles.nextCover} ${styles.carouselUtil}`}><BsFillArrowLeftCircleFill /></div>
            <div className={`${styles.prevCover} ${styles.carouselUtil}`}><BsFillArrowRightCircleFill /></div>

            <div style={{background: "blue"}} className={styles.coverDefaultOption}>

            </div>
            <div style={{background: "blue"}} className={styles.coverDefaultOption}>

            </div>
            <div style={{background: "blue"}} className={styles.coverDefaultOption}>

            </div>
            <div style={{background: "blue"}} className={styles.coverDefaultOption}>

            </div>
            <div style={{background: "blue"}} className={styles.coverDefaultOption}>

            </div>
            <div style={{background: "blue"}} className={styles.coverDefaultOption}>

            </div>
            <div style={{background: "blue"}} className={styles.coverDefaultOption}>

            </div>
            <div style={{background: "blue"}} className={styles.coverDefaultOption}>

            </div>
          </div>
        </section>

        <h3 className={styles.modalTitle}>Informações pessoais</h3>

        <div className={`${styles.editable} ${styles.formContainer}`}>
          <label htmlFor={"new-name"}>Nome</label>
          <input id={"new-name"} defaultValue={user.username}  />
        </div>

        <div className={`${styles.editable} ${styles.formContainer}`}>
          <label htmlFor={"new-bio"}>Bio (biografia)</label>
          <input id={"new-bio"} defaultValue={user.username}  />
        </div>

        <div className={`${styles.notEditable} ${styles.formContainer}`}>
          <label htmlFor={"new-email"}>Email</label>
          <input disabled={true} id={"new-email"} defaultValue={currentUser.email}  />
        </div>

        <div className={styles.formMiniTitle}>
          Edição de segurança
          <span className={styles.infoObs}> (deixe vazio se não for editar)</span>
          <hr />
        </div>

        <div className={`${styles.editable} ${styles.formContainer}`}>
          <label htmlFor={"current-password"}>Senha atual</label>
          <input type={"password"} id={"current-password"} placeholder={"Sem alterações"} />
        </div>

        <div className={`${styles.editable} ${styles.formContainer}`}>
          <label htmlFor={"new-password"}>Nova Senha</label>
          <input id={"new-password"} placeholder={"Sem alterações"} />
        </div>


        <div className={styles.submitChanges}>
          <button type={"submit"}>
            Salvar alterações
          </button>
        </div>



      </form>
    </ReactModal>
  );
}