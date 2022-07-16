import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { isMobile } from "react-device-detect";
import { MobileMenu } from "../MobileMenu";

import styles from "./Header.module.scss";

export function Header() {
  const { data, status } = useSession();

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [menuMobileIsOpen, setMenuMobileIsOpen] = useState(false);

  
  if (status === "authenticated")
    return (
      <header className={styles.Header}>
        <div id={styles.firstContainer}>

          <Link href={"/"}>
            <a>
              <img
                src={"/images/temporary-logo.svg"}
                className={styles.logotipoImg}
                alt={"profile"}
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
        >
          {
            isMobile ? ( // Mobile version
              <>
                <div className={styles.menuMobile}>
                  <GiHamburgerMenu onClick={() => setMenuMobileIsOpen(menuMobileIsOpen == false)}/>
                </div>
                {
                  menuMobileIsOpen
                  ? (
                    <MobileMenu
                      menuMobileIsOpen={menuMobileIsOpen}
                      setMenuMobileIsOpen={setMenuMobileIsOpen}
                    />
                  ) : <></>
                }
              </>
            ) : ( // Desktop version
              <>
                <div 
                  className={styles.userData}
                  onClick={() => setDropdownIsOpen(dropdownIsOpen == false)}
                >
                  <div className={styles.username}>{data?.user.name}</div>

                  <div className={styles.userPicture}>
                    <img src={data?.user.image} />
                  </div>
                </div>
                {
                  dropdownIsOpen
                  ? <div className={styles.dropdown}>
                    <div>
                      <Link href={`/profile/${data.user.id}`}>
                        <a>Meu Perfil</a>
                      </Link>
                    </div>
                    <div onClick={() => signOut({ callbackUrl: "/login" })}>Sair</div>
                  </div>
                  :<></>
                }
              </>
            )
          }
        </div>
      </header>
    );

  else
    return <></>;
}
