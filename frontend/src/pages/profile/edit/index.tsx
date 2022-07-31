import Image from "next/image";
import ReactModal from "react-modal";
import { User } from "../[userID]";
import { IoClose } from "react-icons/io5";
import { MdAddAPhoto } from "react-icons/md";

import styles from "./styles.module.scss";


interface EditProps {
  user: User;
  useModalIsOpen: {
    modalIsOpen: boolean;
    setModalIsOpen: (args: boolean) => void;
  }
}

export function Edit({ user, useModalIsOpen }: EditProps) {
  const { modalIsOpen, setModalIsOpen } = useModalIsOpen;

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

      <div className={styles.content}>
        <h3 className={styles.modalTitle}>Edição de perfil</h3>

        
        <div className={styles.imageContainer}>
          <div className={styles.changeBg}><MdAddAPhoto /></div>
          <Image width={"100%"} height={"100%"} src={user.image_url} />
        </div>

        <div className={`${styles.name} ${styles.formContainer}`}>
          <label htmlFor={"new-name"}>Nome</label>
          <input id={"new-name"} defaultValue={user.username}  />
        </div>

        <div className={`${styles.bio} ${styles.formContainer}`}>
        <label htmlFor={"new-name"}>Bio (biografia)</label>
          <input id={"new-name"} defaultValue={user.username}  />
        </div>
      </div>
    </ReactModal>    
  );
}