import { BiSearch } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa"; 
 
import styles from "./styles.module.scss";

export function Header() {
  console.log(styles.logotipoImg);
  return (
    <header className={styles.Header}>
      <div id={styles.firstContainer}>

        <img
          src={"/images/temporary-logo.svg"} 
          className={styles.logotipoImg}
        />

        <div className={styles.searchContainer}>
          <BiSearch />
          <input type={"text"} placeholder={"Pesquise um usuário..."} />
        </div>
      
      </div>

      <div id={styles.secondContainer}>
        <div>Nome de usuario</div>

        <FaUserCircle />
      </div>
    </header>
  );
}