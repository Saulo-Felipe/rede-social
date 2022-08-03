import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { isMobile } from "react-device-detect";
import { MobileMenu } from "../MobileMenu";
import { useRouter } from "next/router";
import { getClientUser } from "../../../hooks/useSession";

import { IoMdExit } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscSettingsGear } from "react-icons/vsc";
import { FaUserCircle } from "react-icons/fa";

import Image from "next/image";
import Link from "next/link";


import styles from "./Header.module.scss";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated } = getClientUser();
  

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [menuMobileIsOpen, setMenuMobileIsOpen] = useState(false);
  const [searchContent, setSearchContent] = useState("");

  function goToSearch() {
    if (searchContent.length > 0) {
      router.push(`/search/${searchContent}`);
    }
  }
  
  if (isAuthenticated === true)
    return (
      <header className={styles.Header}>
        <div id={styles.firstContainer}>

          <Link href={"/"}>
            <a>
              <div className={styles.logoContainer}>
                <Image
                  src={"/images/temporary-logo.svg"}
                  className={styles.logotipoImg}
                  alt={"profile"}
                  width={"100%"}
                  height={"100%"}
                />                
              </div>
            </a>
          </Link>

          <div className={styles.searchContainer}>
            <label htmlFor="search_user">
              <BiSearch />
            </label>

            <input 
              id="search_user" 
              value={searchContent}
              type={"text"} 
              placeholder={"Pesquise um usuário..."} 
              onChange={({target}) => setSearchContent(target.value)}
              onKeyPress={event => event.key === "Enter" ? goToSearch() : null}
            />

            <div className={styles.searchIconContainer}>
              <button 
                disabled={searchContent.length === 0} 
                onClick={goToSearch}
              >Pesquisar</button>
            </div>
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
                >
                  <div
                    className={styles.dropdownContainer}
                    onClick={() => setDropdownIsOpen(dropdownIsOpen == false)}
                  >
                    <VscSettingsGear />
                    {
                      dropdownIsOpen
                      ? <div className={styles.dropdown}>
                        <div>
                          <Link href={`/profile/${user.id}`}>
                            <a><FaUserCircle /> Meu Perfil</a>
                          </Link>
                        </div>

                        <div onClick={() => signOut({ callbackUrl: "/login" })}>
                          <IoMdExit /> Sair
                        </div>
                      </div>
                      :<></>
                    }                    
                  </div>

                  <div className={styles.username}>{user.username}</div>

                  <div className={styles.userPicture}>
                    <Image 
                      alt={"user"}
                      src={"/images/user.image_url"} 
                      width={"100%"}
                      height={"100%"}
                    />
                  </div>
                </div>
              </>
            )
          }
        </div>
      </header>
    );

  else
    return <></>;
}
