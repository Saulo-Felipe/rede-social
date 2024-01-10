import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { GiTank } from "react-icons/gi";
import { useSocket } from '../../../hooks/useSocket';
import { IoChatboxOutline } from "react-icons/io5";
import Link from 'next/link';
import { useAuth } from "../../../hooks/useAuth";

import styles from './OnlineUsers.module.scss';

export function OnlineUsers() {
  const { pathname } = useRouter();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const {allUsers} = useSocket();

  if (isAuthenticated && !isMobile && pathname !== "/chat")
    return (
      <>
        <div className={styles.container}>
          <h2> 
            <div className={styles.title}>
              <HiOutlineStatusOnline /> 
              Usuários 
            </div>

            <button
              onClick={() => router.push("/chat")}
            >Chat <IoChatboxOutline /></button>
            </h2>
          <hr />

          <div className={styles.users}>
            {
              allUsers.map(aUser => 
                <div key={aUser.id} className={styles.user}>
                  <span style={{ backgroundColor: aUser.isOnline ? "var(--online)" : "var(--offline)" }}></span>
    
                  <div>    
                    <div className={styles.imageContainer}>
                      <img
                        alt={"user profile"}
                        src={aUser.image_url}
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

          <a rel="noopener noreferrer" href={"https://tanksfight-server.saulofelipe.tech"} target={"_blank"}>
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
