import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";


import styles from "./chat.module.scss";

export default function Chat() {
  const { allUsers } = useSocket();
  const { data: session } = useSession();
  const [isInputFocus, setIsInputFocus] = useState(false);
  
  function blurOrFocusInput(e) {
    let element = e.target;

    if (element.classList[0].indexOf("newMessageContainer") === -1) {
      if (isInputFocus) setIsInputFocus(false);
    } else {
      if (!isInputFocus) setIsInputFocus(true);
    }
  }

  return (
    <main className={styles.chat}>

      <section className={styles.firstContainer}>

        <h2>Usuários</h2>
        <hr />

        <div className={styles.usersContainer}>        
          {
            allUsers.map(user => 
            <div className={styles.aUser}>
              <div className={styles.imageContainer}>
                <Image 
                  src={user.image_url}
                  width={"100%"}
                  height={"100%"}
                />

                <span 
                  className={styles.isOnline}
                  style={{ backgroundColor: user.isOnline ? "var(--online)" : "var(--offline)" }}
                ></span>
              </div>

              <div className={styles.name}>{user.username.split(" ")[0]}</div>
            </div>
            )
          }
        </div>

      </section>

      <section className={styles.secondContainer}>

        <label htmlFor={"new-message"} className={styles.newMessageContainer}>

          <input 
            id={"new-message"} 
            type={"hidden"} 
            onChange={(e) => console.log(e)}
          />
        </label>

        <div className={styles.messagesContainer}></div>

      </section>
    </main>
  );
}