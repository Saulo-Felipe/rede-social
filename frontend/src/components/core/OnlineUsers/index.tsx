import { useSession } from 'next-auth/react';
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { GiTank } from "react-icons/gi";
import { useSocket } from '../../../hooks/useSocket';
import Image from "next/image";
import Link from 'next/link';

import styles from './OnlineUsers.module.scss';

export function OnlineUsers() {
  const { status } = useSession();
  const { pathname } = useRouter();
  
  const {allUsers} = useSocket();

  if (status === "authenticated" && !isMobile && pathname !== "/chat")
    return (
      <>
        <div className={styles.container}>
          <h2><HiOutlineStatusOnline /> Usuários online agora</h2>
          <hr />

          <div className={styles.users}>
            {
              allUsers.map(aUser => 
                <div key={aUser.id} className={styles.user}>
                  <span style={{ backgroundColor: aUser.isOnline ? "var(--online)" : "var(--offline)" }}></span>
    
                  <div>    
                    <div className={styles.imageContainer}>
                      <Image
                        alt={"user profile"}
                        src={aUser.image_url}
                        width={"100%"}
                        height={"100%"}
                      />
                    </div>

                    <div>
                      <Link href={`/profile/${aUser.id}`}>
                        <a>
                          {aUser.username}
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>   
              )
            }
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