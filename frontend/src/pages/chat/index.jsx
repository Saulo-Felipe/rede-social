import Image from "next/image";
import { useSession } from "next-auth/react";
import { AiOutlineGlobal } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { isMobile } from "react-device-detect";
import { SocketClient } from "../../components/utils/socketClient";

import styles from "./chat.module.scss";


export default function Chat() {
  const { data: session } = useSession();
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [mobileOptionsIsOpen, setMobileOptionsIsOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);
  const sectionRef = useRef(null);


  useEffect(() => {
    if (sectionRef.current !== null)
      sectionRef.current.scrollTo(0, 9999);
  }, []);


  function handleChangeTextArea(element) {
    let count = 1;
    for (let i = 0; i < element.value.length; i++) {
      if (element.value[i] === "\n") count ++
    }

    element.style.height = count*1.5+"rem";
    sectionRef.current.scrollTo(0, 9999);

    setNewMessage(element.value);
  }

  async function handleNewMessage() {
    if (newMessage.length > 0) {
      if (socketRef.current) {
        let date = new Date();
        const newMessageObj = {
          googleID: session?.user?.id,
          message: newMessage,
          createdOn: date.getHours() + ":" + date.getMinutes(),
          userPicture: session?.user?.image
        }

        socketRef.current.emit("new-message", newMessageObj);

        setAllMessages([{...newMessageObj, isMy: true}, ...allMessages]);
        setNewMessage("");

        setTimeout(() => sectionRef.current.scrollTo(0, 9999), 50);

      } else {
        alert("[error] O Websocket não foi iniciado");
      }
    }
  }


  return (
    <main className={styles.chat}>
      <SocketClient 
        user={session?.user} 
        setOnlineUsers={setOnlineUsers}
        onlineUsers={onlineUsers}
        allMessages={allMessages}
        setAllMessages={setAllMessages}
        socketRef={socketRef}
      />

      {
        isMobile 
        ? (
          <div 
            className={styles.menuBackground}
            style={{ display: mobileOptionsIsOpen ? "block" : "none" }}
          ></div>
        ) : <></>
      }
      <section
        style={isMobile ? { left: mobileOptionsIsOpen ? 0 : "-100%" } : null}
        className={styles.users}
      >
        { isMobile
          ? (
            <div
                className={styles.optionsMobileClose}
                onClick={() => setMobileOptionsIsOpen(mobileOptionsIsOpen === false)}
              >
                <IoMdClose />
            </div>
          ) : <></>
        }

        <h4>Usuários online</h4>

        <div className={styles.onlineUsers}>

          {
            onlineUsers.map(user => {
              // console. log("renderizei: ", user);

              return <div key={user.id} className={styles.aUser}>
                <div className={styles.imageContainer}>
                  <Image
                    src={user.image_url}
                    width={"100%"}
                    height={"100%"}
                  />
                </div>

                <div 
                  className={styles.currentState}
                  style={{ backgroundColor: user.isOnline ? "var(--online)" : "var(--offline)" }}
                ></div>


                <div className={styles.username}>{user.username.split(" ")[0] ?? ""}</div>
              </div>
            })
          }
        </div>

        <h4>Mensagens</h4>

        <div className={styles.chatMessageOption}>
          <AiOutlineGlobal />
          <div>Bate-Papo Global</div>
        </div>
      </section>

      {
        isMobile
        ? (
          <div
            className={styles.showMobileOptions}
            onClick={() => setMobileOptionsIsOpen(mobileOptionsIsOpen == false)}
          ><IoIosArrowForward />
          </div>
        ) : <></>
      }

      <section className={styles.content} ref={sectionRef}>
        <div className={styles.messages}>

          {
            allMessages.map((item, index) =>
              item.isMy
              ? (
                <div key={index} className={styles.myMessage}>
                  <div>
                    <div className={styles.msgTxt}>
                      {item.message}
                    </div>

                    <div className={styles.imageContainer}>
                      <Image
                        src={session?.user?.image || "/hpsp"}
                        width={"100%"}
                        height={"100%"}
                      />
                    </div>
                  </div>

                  <small className={styles.date}>{item.createdOn}</small>
                </div>
              ) : (
                <div key={index} className={styles.otherMessage}>
                  <div>
                    <div className={styles.imageContainer}>
                      <Image
                        src={item.userPicture}
                        width={"100%"}
                        height={"100%"}
                      />
                    </div>

                    <div className={styles.msgTxt}>
                      {item.message}
                    </div>
                  </div>

                  <small className={styles.date}>{item.createdOn}</small>
                </div>
              )
            )
          }
        </div>

        <div className={styles.sendMessage}>
          <label htmlFor={"newMessage"} className={styles.inputContainer}>
            <textarea
              id={"newMessage"}
              placeholder="Envie uma mensagem"
              onChange={({target}) => handleChangeTextArea(target)}
              value={newMessage}
            >
            </textarea>
          </label>

          <div className={styles.btnContainer}>
            <button
              disabled={newMessage.length === 0}
              onClick={handleNewMessage}
            >Enviar</button>
          </div>
        </div>
      </section>
    </main>
  );
}