import Image from "next/image";
import { useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { isMobile } from "react-device-detect";
import { IoMdClose, IoIosArrowForward } from "react-icons/io";

import styles from "./chat.module.scss";
import { HiStatusOnline } from "react-icons/hi";
import { MdSensorsOff } from "react-icons/md";
import { AiOutlineGlobal } from "react-icons/ai";
import Link from "next/link";


export interface Message {
  googleID: string;
  image: string;
  content: string;
  createdOn: string;
  isMy: boolean;
}

export default function Chat() {
  const { allUsers, sendMessage, allMessages } = useSocket();
  const [newMessage, setNewMessage] = useState("");
  const [menuMobileIsOpen, setMenuMobileIsOpen] = useState(false);

  function verifyMessage() {
    if (newMessage.length > 0) {
      sendMessage(newMessage);

      setNewMessage("");
    }
  }

  return (
    <main className={styles.chat}>

      { 
        isMobile 
        ? <div 
          className={styles.openMobileMenu} 
          onClick={() => setMenuMobileIsOpen(true)}
        ><IoIosArrowForward /></div> 
        : null 
      }
      <section 
        className={styles.firstContainer}
        style={{ left: menuMobileIsOpen ? "0" : "-100%"}}
      >

        <h2 className={styles.firstTitle}>
          { isMobile ? <IoMdClose onClick={() => setMenuMobileIsOpen(false)} /> : null}
        </h2>
      
        <div className={styles.containerTitle}>Onlines agora <HiStatusOnline /></div>
        <div className={styles.usersContainer}>
          {
            allUsers.map(user => user.isOnline 
              ? <div key={user.id} className={styles.aUser}>
                <Link href={`/profile/${user.id}`}>
                  <a>
                    <div className={styles.imageContainer}>
                      <img
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
                  </a>
                </Link>
              </div>
              : <></>
            )
          }
        </div>

        <div className={styles.containerTitle}>Outros usuários (Offline) <MdSensorsOff style={{color: "red"}} /></div>
        <div className={styles.usersContainer}>
          {
            allUsers.map(user => !user.isOnline 
              ? <div key={user.id} className={styles.aUser}>
                <div className={styles.imageContainer}>
                  <img
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
              : <></>
            )
          }
        </div>

        <div className={styles.optionGlobalChat}
          onClick={() => document.querySelector("textarea").focus()}
        >
          <AiOutlineGlobal />
          <div>
            <span> Chat global</span>
            <small>({allUsers.filter(aUser => aUser.isOnline).length} Online agora)</small>
          </div>
        </div>

      </section>

      { 
        isMobile && menuMobileIsOpen 
        ? <div className={styles.menuBg} onClick={() => setMenuMobileIsOpen(false)}></div> 
        : null 
      }


      <section className={styles.secondContainer}>
        <div className={styles.newMessageContainer}>
          <textarea
            value={newMessage}
            onChange={({target}) => setNewMessage(target.value)}
            placeholder={"Envie uma mensagem"}
            onKeyDown={e => e.key === "Enter" ? (verifyMessage(), e.preventDefault()) : null}
          >
          </textarea>

          <button
            onClick={verifyMessage}
            disabled={newMessage.length === 0}
          >Enviar</button>
        </div>

        <div className={styles.messages}>
          {
            allMessages.map((message, index) =>
              <div 
                key={index} 
                className={styles.aMessage}
                style={message.isMy ? {alignSelf: "flex-end"} : null}
              >
                <div 
                  className={styles.info}
                  style={message.isMy ? {flexDirection: "row-reverse"} : null}
                >
                  <div 
                    style={message.isMy ? {marginLeft: "0.5rem"} : {marginRight: "0.5rem"} } 
                    className={styles.imageContainer}
                  >

                    <img
                      src={message.image}
                      width={"100%"}
                      height={"100%"}
                    />
                  </div>

                  <div 
                    className={styles.content}
                    style={!message.isMy ? {background: "#e3e3e3", color: "black"} : null}
                  >{message.content}</div>
                </div>

                <div 
                  className={styles.createdOn}
                  style={message.isMy ? {alignSelf: "flex-end", paddingRight: "2.5rem"} : {paddingLeft: "2.5rem"}}
                >{message.createdOn}</div>
              </div>
            )
          }
        </div>
      </section>
    </main>
  );
}