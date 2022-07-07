import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa"; 
 
import styles from "./styles.module.scss";

export function Header() {

  return (
    <header className={styles.Header}>
      <div id={styles.firstContainer}>

        <Link href={"/Home"}>
          <a>
            <img
              src={"/images/temporary-logo.svg"} 
              className={styles.logotipoImg}
            />        
          </a>
        </Link>

        <div className={styles.searchContainer}>
          <BiSearch />
          <input type={"text"} placeholder={"Pesquise um usuário..."} />
        </div>
      
      </div>

      <div id={styles.secondContainer}>
        <Link href={"/Profile"}>
          <a>
            <div>Nome de usuario</div>

            <FaUserCircle />
          </a>
        </Link>
      </div>
    </header>
  );
}