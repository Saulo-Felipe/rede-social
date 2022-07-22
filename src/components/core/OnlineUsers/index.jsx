import { useSession } from 'next-auth/react';
import Image from "next/image";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router"

import styles from './OnlineUsers.module.scss';

export function OnlineUsers() {
  const { status } = useSession();
  const { pathname } = useRouter();

  
  if (status === "authenticated" && !isMobile && pathname !== "/chat") 
    return (
      <div className={styles.container}>
        <h2>Usuários online agora</h2>

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

        </div>
          

      </div>
    );
    
  else 
    return <></>;
}