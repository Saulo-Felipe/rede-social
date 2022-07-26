import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";

import styles from "./chat.module.scss";


interface Message {
  username: string;
  image: string;
  content: string;
  isOnline: boolean;
}

export default function Chat() {
  const { allUsers, sendMessage } = useSocket();
  const { data: session } = useSession();
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState<Message[]>([])

  function verifyMessage() {
    if (newMessage.length > 0) {
      console.log("Enviando: ", newMessage)
      sendMessage(newMessage);

      setAllMessages([ ...allMessages, {
        content: newMessage,
        image: session.user.image,
        isOnline: true,
        username: session.user.name
      }]);

      setNewMessage("");
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
            <div key={user.id} className={styles.aUser}>
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

        <div className={styles.newMessageContainer}>
          <textarea 
            value={newMessage}
            onChange={({target}) => setNewMessage(target.value)}
            placeholder={"Envie uma mensagem"}
          >
          </textarea>

          <button 
            onClick={verifyMessage}
            disabled={newMessage.length === 0}
          >Enviar</button>
        </div>
      </section>
    </main>
  );
}