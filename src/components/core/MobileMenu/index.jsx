import { useSession,signOut } from "next-auth/react";
import Link from "next/link";
import { MdOutlineClose, MdExitToApp } from "react-icons/md";
import { AiOutlineHome, AiOutlineMessage } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";

import styles from "./MobileMenu.module.scss";

export function MobileMenu(props) {
  const { data, status } = useSession();
  const { setMenuMobileIsOpen } = props;

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <header>
          <div>
            <div className={styles.imgContainer}>
              <Image 
                alt={"user profile"}
                src={data?.user.image} 
                width={"100%"}
                height={"100%"}
              />
            </div>

            <div className={styles.username}>{data?.user.name}</div>
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
            <Link href="/profile">
              <a><CgProfile /> Meu Perfil</a>
            </Link>
          </div>

          <div className={styles.link}>
              <a><AiOutlineMessage /> Mensagens</a>
          </div>

          <div
            className={styles.link}
            onClick={() => signOut()}
          >
              <a><MdExitToApp /> Sair</a>
          </div>
        </nav>

      </div>
    </section>
  );
}