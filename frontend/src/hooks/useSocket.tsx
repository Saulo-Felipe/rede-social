import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { api } from "../services/api";
import { io } from "socket.io-client";
import { useAuth } from "./useAuth";
import { getCurrentDate } from "../components/templates/Home/NewPost";



export interface User {
  id: string;
  username: string;
  image_url: string;
  socketID: string | null;
  isOnline: boolean | null;
}

interface ReturnValue {
  allUsers: User[];
  setAllUsers: (users: User[]) => void;
  sendMessage: (content: string, ref: any) => void;
  allMessages: Message[];
  getIndexOfMessage: (args?: User[]) => void;
  isLoadingMessages: boolean;
  waitNewMessage: boolean;
}

interface serverUserObj {
  allUsers: {
    [key: string]: string;
  }
}

interface Message {
  googleID: string;
  image: string;
  content: string;
  createdOn: string;
  isMy: boolean;
  id: number;
}



export const SocketContext = createContext<ReturnValue>({} as ReturnValue);

export function SocketProvider({ children }) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const { user } = useAuth();
  const [waitNewMessage, setWaitNewMessage] = useState(false);

  const allUsersRef = useRef(allUsers);
  const socketRef = useRef(null);
  const allMessagesRef = useRef(allMessages);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);


  async function initialState(initialValue: any) {
    const { data } = await api().get("user/all",);

    if (data.success) {
      let newUsers: User[] = data.users;

      for (let i in initialValue) {
        for (let j = 0; j < newUsers.length; j++) {
          if (initialValue[i] === newUsers[j].id) {
            newUsers[j].isOnline = true;

            setAndOrganizeAllUsers([ ...newUsers ]);
            getIndexOfMessage(newUsers);

            break;
          }
        }
      }

    } else {
      alert("[socket] Erro ao buscar usuários.");
    }
  }

  function newUser(socketID: string, googleID: string) {
    console.log("[new user]: ", googleID);

    let newUsers = allUsersRef.current;

    for (let i in newUsers) {
      if (newUsers[i].id === googleID) {
        newUsers[i] = { ...newUsers[i], socketID, isOnline: true };

        setAndOrganizeAllUsers([ ...newUsers ]);
        break;
      }
    }

  }

  function deleteUser(googleID: string) {
    console.log("[delete]: ", googleID);

    let newUsers = allUsersRef.current;

    for (let i in newUsers) {
      if (newUsers[i].id === googleID) {
        newUsers[i].isOnline = false;

        setAndOrganizeAllUsers([ ...newUsers ]);
        break;
      }
    }

  }


  // ------------| Reiceved Message |-------------

  function sendMessage(content: string, ref) {
    console.log("[sending] :", content);
    setWaitNewMessage(true);
    
    socketRef.current.emit("new-message", user?.id, content, (response: boolean) => {
      setWaitNewMessage(false);
      ref.current.scrollTo(0, 0);
    });
  }

  function receivedMessage(googleID: string, message: string, createdOn: string, messageID: number) {
    for (let c = 0; c < allUsersRef.current.length; c++) {
      if (allUsersRef.current[c].id === googleID) {

        let newMessageData: Message = {
          content: message,
          image: allUsersRef.current[c].image_url,
          createdOn,
          googleID,
          isMy: googleID === user?.id,
          id: messageID
        }


        setAllMessages([ { ...newMessageData }, ...allMessagesRef.current ]);
      }
    }
  }

  function setAndOrganizeAllUsers(users: User[]) {
    let allUsers = [];

    for (let c = 0; c < users.length; c++) {
      if (users[c].isOnline) {
        allUsers = [users[c], ...allUsers];
      } else {
        allUsers = [...allUsers, users[c]];
      }
    }

    setAllUsers([ ...allUsers ]);
  }

  async function getIndexOfMessage(users?: User[]) {
    if (!isLoadingMessages) {
      setIsLoadingMessages(true);

      const { data } = await api().post("/all-messages", { 
        index: paginationIndex
      });

      if (data.success) {
        let newMessages: Message[] = [];
        let theUsers = users ? users : allUsers;
        
        principalLoop:
        for (let c = 0; c < data.messages.length; c++) {
          let currentMsg = data.messages[c];
  
          for (let j = 0; j < allMessages.length; j++) {
            if (allMessages[j].id === currentMsg.id)
              continue principalLoop;
          }

          for (let i = 0; i < theUsers.length; i++) {
            if (currentMsg.user_id === theUsers[i].id) {
              newMessages.push({
                content: currentMsg.message,
                createdOn: currentMsg.created_on,
                googleID: currentMsg.user_id,
                isMy: currentMsg.user_id === user.id,
                image: theUsers[i].image_url,
                id: currentMsg.id
              });
              break;
            }
          }
        }

        setAllMessages([ ...allMessages, ...newMessages ]);
        setPaginationIndex(paginationIndex+1);
        setIsLoadingMessages(false);
      }
    }
  }

  useEffect(() => {
    if (user) {
      const socket = io(process.env.NEXT_PUBLIC_SERVER_URL, { 
        transports: ["websocket"] 
      })
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("new-user", user?.id, (response: serverUserObj) => {
          initialState(response.allUsers);
        });
      });

      socket.on("new-user", (socketID: string, googleID: string) => {
        newUser(socketID, googleID);
      });

      socket.on("delete-user", (googleID: string) => {
        deleteUser(googleID);
      });

      // --------| Messages |----------

      socket.on("received-message", ({ googleID, message, createdOn, messageID }) => {
        console.log("[reiceved message]: ", message);

        receivedMessage(googleID, message, createdOn, messageID);
      });

    }
  }, [user]);

  useEffect(() => {
    allUsersRef.current = allUsers;
  }, [allUsers]);

  useEffect(() => {
    allMessagesRef.current = allMessages;
  }, [allMessages]);


  return (
    <SocketContext.Provider value={{
      allUsers,
      setAllUsers,
      sendMessage,
      allMessages,
      getIndexOfMessage,
      isLoadingMessages,
      waitNewMessage
    }}>
      { children }

    </SocketContext.Provider>
  );
}


export function useSocket() {
  const context: ReturnValue = useContext(SocketContext);

  return { ...context };
}
