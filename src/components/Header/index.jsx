import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { signOut } from "next-auth/react";
 
import styles from "./styles.module.scss";

export function Header(props) {
  const { data, status } = useSession();

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  
  if (status === "authenticated") 
    return (
      <header className={styles.Header}>
        <div id={styles.firstContainer}>

          <Link href={"/"}>
            <a>
              <img
                src={"/images/temporary-logo.svg"} 
                className={styles.logotipoImg}
              />        
            </a>
          </Link>

          <div className={styles.searchContainer}>
            <label htmlFor="search_user">
              <BiSearch />
            </label>

            <input id="search_user" type={"text"} placeholder={"Pesquise um usuário..."} />
          </div>
        
        </div>

        <div 
          id={styles.secondContainer}
          onClick={() => setDropdownIsOpen(dropdownIsOpen == false)}
          onFocus={() => console.log("focus")}
          onBlur={() => console.log("blur") }
        >
          <div className={styles.userData}>
            <div className={styles.username}>{data?.user.name}</div>

            <div className={styles.userPicture}>
              <img src={data?.user.image} />
            </div>
          </div>

          {
            dropdownIsOpen 
            ? <div className={styles.dropdown}>
              <div>
                <Link href="/Profile">
                  <a>Meu Perfil</a>
                </Link>
              </div>
              <div onClick={() => signOut({ callbackUrl: "/Login" })}>Sair</div>
            </div>
            :<></>
          }
        </div>        
      </header>
    );

  else
    return <></>;
}