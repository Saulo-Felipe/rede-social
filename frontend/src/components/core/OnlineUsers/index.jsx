import { useSession } from 'next-auth/react';
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { GiTank } from "react-icons/gi";
import Image from "next/image";
import { useSocket } from '../../../hooks/useSocket';

import styles from './OnlineUsers.module.scss';

export function OnlineUsers() {
  const { status } = useSession();
  const { pathname } = useRouter();
  

  if (status === "authenticated" && !isMobile && pathname !== "/chat")
    return (
      <>
        <div className={styles.container}>
          <h2><HiOutlineStatusOnline /> Usuários online agora</h2>
          <hr />

          <div className={styles.users}>

            <div className={styles.user}>
              <span></span>

              <div>
                <div>Saulo Felipe</div>

                <div className={styles.imageContainer}>
                  <Image
                    alt={"user profile"}
                    src={"/images/temporary-logo.svg"}
                    width={"100%"}
                    height={"100%"}
                  />
                </div>
              </div>

            </div>

            <div className={styles.user}>
              <span></span>

              <div>
                <div>Saulo Felipe</div>

                <div className={styles.imageContainer}>
                  <Image
                    alt={"user profile"}
                    src={"/images/temporary-logo.svg"}
                    width={"100%"}
                    height={"100%"}
                  />
                </div>
              </div>

            </div>

            <div className={styles.user}>
              <span></span>

              <div>
                <div>Saulo Felipe</div>

                <div className={styles.imageContainer}>
                  <Image
                    alt={"user profile"}
                    src={"/images/temporary-logo.svg"}
                    width={"100%"}
                    height={"100%"}
                  />
                </div>
              </div>

            </div>

            <div className={styles.user}>
              <span></span>

              <div>
                <div>Saulo Felipe</div>

                <div className={styles.imageContainer}>
                  <Image
                    alt={"user profile"}
                    src={"/images/temporary-logo.svg"}
                    width={"100%"}
                    height={"100%"}
                  />
                </div>
              </div>

            </div>


            <div className={styles.user}>
              <span></span>

              <div>
                <div>Saulo Felipe</div>

                <div className={styles.imageContainer}>
                  <Image
                    alt={"user profile"}
                    src={"/images/temporary-logo.svg"}
                    width={"100%"}
                    height={"100%"}
                  />
                </div>
              </div>

            </div>
          </div>

          <h2><GiTank /> Multiplayer Games</h2>
          <hr />

          <a href={"https://multiplayer-game-saulo.herokuapp.com"} target={"_blank"}>
            <div className={styles.game}>
              <div className={styles.gameTitle}>Jogue com seus amigos :D</div>
            </div>
          </a>

        </div>
        <hr className={styles.globalDivision} />
      </>
    );

  else
    return <></>;
}