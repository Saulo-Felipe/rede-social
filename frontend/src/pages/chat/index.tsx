import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { isMobile } from "react-device-detect";
import { IoMdClose, IoIosArrowForward } from "react-icons/io";
import { HiStatusOnline } from "react-icons/hi";
import { MdSensorsOff, MdUpdate } from "react-icons/md";
import { AiOutlineGlobal } from "react-icons/ai";
import Link from "next/link";
import { BiSend } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";
import Head from "next/head";

import styles from "./chat.module.scss";


export default function Chat() {
  const { allUsers, sendMessage, allMessages, getIndexOfMessage, isLoadingMessages, waitNewMessage } = useSocket();
  const [newMessage, setNewMessage] = useState("");
  const [menuMobileIsOpen, setMenuMobileIsOpen] = useState(false);
  const messagesContainerRef = useRef(null);

  function verifyMessage() {
    if (newMessage.length > 0) {
      sendMessage(newMessage);

      setNewMessage("");
    }
  }

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (menuMobileIsOpen) {
        window.scrollTo(0, 0);
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      } 
    }
  }, [menuMobileIsOpen]);

  return (
    <main className={styles.chat}>
      <Head><title>Chat global</title></Head>
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
          Chat em tempo real
          { isMobile ? <IoMdClose onClick={() => setMenuMobileIsOpen(false)} /> : null}
        </h2>

        <div className={styles.containerTitle}>Onlines agora <HiStatusOnline /></div>
        <div className={styles.usersContainer}>
          {
            allUsers.map((user, index) => user.isOnline
              ? <div key={index} className={styles.aUser}>
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
              : ""
            )
          }
        </div>

        <div className={styles.containerTitle}>Outros usuários (Offline) <MdSensorsOff style={{color: "red"}} /></div>
        <div className={styles.usersContainer}>
          {
            allUsers.map((user, index) => !user.isOnline
              ? <div key={index} className={styles.aUser}>
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
              : ""
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
          <div className={`${styles.sendMessageAction} ${waitNewMessage ? styles.disabled : null}`}>
            <textarea
              value={newMessage}
              onChange={({target}) => setNewMessage(target.value)}
              placeholder={"Envie uma mensagem"}
              onKeyDown={e => e.key === "Enter" ? (verifyMessage(), e.preventDefault()) : null}
              disabled={waitNewMessage}
            >
            </textarea>

            <button
              onClick={verifyMessage}
              disabled={waitNewMessage || newMessage.length === 0}
            >
              {waitNewMessage ? <div className="loadingContainer"><BiSend /></div> : <BiSend />}
            </button>
          </div>
        </div>

        <div className={styles.messages} ref={messagesContainerRef}>
          {
            allMessages.map((message, index) =>
              <div
                key={index}
                className={`${styles.aMessage} ${message.isMy ? styles.isMy : styles.notIsMy}`}
              >
                <div className={`${styles.info}`}>

                  <div className={styles.content}>
                    {message.content}
                    <div className={styles.detail}></div>
                  </div>

                  <div className={styles.createdOn}>
                    {message.createdOn}
                  </div>

                </div>

                <div className={styles.imageContainer}>
                  <img src={message.image} width={"100%"} height={"100%"} />
                </div>

              </div>
            )
          }

          { isLoadingMessages ? <div className={`loadingContainer`}><ImSpinner2 /></div> : "" }          

          {
            allMessages.length > 0
            ? <div onClick={() => getIndexOfMessage()} className={styles.loadMoreMessages}>Carregar mais messages <MdUpdate /></div>
            : <></>
          }
          
        </div>
      </section>
    </main>
  );
}