import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import Router from "next/router";
import { IoMdExit } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscSettingsGear } from "react-icons/vsc";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { MobileMenu } from "../MobileMenu";
import { useAuth } from "../../../hooks/useAuth";


import styles from "./Header.module.scss";

export function Header() {
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [menuMobileIsOpen, setMenuMobileIsOpen] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const { isAuthenticated, user, logOut } = useAuth();
  const inputSearchRef = useRef(null);

  useEffect(() => {
    if (menuMobileIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuMobileIsOpen]);

  useEffect(() => {
    if (inputSearchRef.current && typeof document !== "undefined")
      inputSearchRef.current.value = "";
  }, [Router.pathname]);

  function goToSearch() {
    if (searchContent.length > 0) {
      Router.push(`/search/${searchContent}`);
    }
  }

  if (isAuthenticated)
    return (
      <header className={styles.Header}>
        <div id={styles.firstContainer}>

          <Link href={"/"}>
            <a>
              <div className={styles.logoContainer}>
                <img
                  src={"/images/logo.png"}
                  className={styles.logotipoImg}
                  alt={"profile"}
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
              ref={inputSearchRef}
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
                          <Link href={`/profile/${user?.id}`}>
                            <a><FaUserCircle /> Meu Perfil</a>
                          </Link>
                        </div>

                        <div onClick={() => logOut()}>
                          <IoMdExit /> Sair
                        </div>
                      </div>
                      :<></>
                    }
                  </div>

                  <div className={styles.username}>{user?.name}</div>

                  <div className={styles.userPicture}>
                    <img
                      alt={"user: "+user.name}
                      src={user?.picture}
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
