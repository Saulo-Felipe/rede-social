import Link from "next/link";
import { MdOutlineClose, MdExitToApp } from "react-icons/md";
import { AiOutlineHome, AiOutlineMessage } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import { GiTank } from "react-icons/gi";
import { useAuth } from "../../../hooks/useAuth";

import styles from "./MobileMenu.module.scss";

export function MobileMenu(props) {
  const { user, logOut } = useAuth();
  const { setMenuMobileIsOpen } = props;

  return (
    <section className={styles.section} onClick={() => setMenuMobileIsOpen(false)}>
      <div className={styles.content}>
        <header>
          <div>
            <div className={styles.imgContainer}>
              <img 
                alt={"user profile"}
                src={user?.picture} 
                width={"100%"}
                height={"100%"}
              />
            </div>

            <div className={styles.username}>{user?.name}</div>
          </div>

          <div>
            <MdOutlineClose onClick={() => setMenuMobileIsOpen(false)} />
          </div>
        </header>

        <hr />

        <nav>
          <div className={styles.link}>
            <Link href="/">
              <a><AiOutlineHome /> Página inicial</a>
            </Link>
          </div>

          <div className={styles.link}>
            <Link href={`/profile/${user?.id}`}>
              <a><CgProfile /> Meu Perfil</a>
            </Link>
          </div>

          <div className={styles.link}>
            <Link href={"/chat"}>
              <a><AiOutlineMessage /> Mensagens</a>
            </Link>
          </div>

          <div
            className={styles.link}
            onClick={() => logOut()}
          >
              <a><MdExitToApp /> Sair</a>
          </div>

          <h2><GiTank /> Multiplayer Games</h2>
          <hr />

          <a href={"https://multiplayer-game-saulo.herokuapp.com"} target={"_blank"}>
            <div className={styles.game}>
              <div className={styles.gameTitle}>Jogue com seus amigos :D</div>
            </div>
          </a>
        </nav>

      </div>
    </section>
  );
}