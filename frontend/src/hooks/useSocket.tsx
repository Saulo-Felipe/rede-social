import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { api } from "../services/api";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { Message } from "../pages/chat";

export const SocketContext = createContext<ReturnValue>({} as ReturnValue);

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
  sendMessage: (content: string) => void;
  allMessages: Message[];
}

interface serverUserObj {
  allUsers: {
    [key: string]: string;
  }
}


export function SocketProvider({ children }) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { data: session } = useSession();
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const allUsersRef = useRef(allUsers);
  const socketRef = useRef(null);
  const allMessagesRef = useRef(allMessages);


  async function initialState(initialValue: any) {
    const { data } = await api.get("user/all",);

    if (data.success) {
      let newUsers: User[] = data.users;

      for (let i in initialValue) {
        for (let j = 0; j < newUsers.length; j++) {
          if (initialValue[i] === newUsers[j].id) {
            newUsers[j].isOnline = true;

            setAllUsers([ ...newUsers ]);

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

        setAllUsers([ ...newUsers ]);
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

        setAllUsers([ ...newUsers ]);
        break;
      }
    }

  }


  // ------------| Reiceved Message |-------------

  function sendMessage(content: string) {
    console.log("[sending] :", content);

    socketRef.current.emit("new-message", session.user.id, content);
  }

  function receivedMessage(googleID: string, message: string) {
    for (let c = 0; c < allUsersRef.current.length; c++) {
      if (allUsersRef.current[c].id === googleID) {
        let date = new Date().toLocaleString().split(" ")
        let fullHours = date[1].substring(0, 5);

        setAllMessages([
          ...allMessagesRef.current, {
            content: message,
            image: allUsersRef.current[c].image_url,
            createdOn: date[0]+" às "+fullHours,
            googleID,
            isMy: googleID === session.user.id
          }]);
      }
    }
  }



  useEffect(() => {
    if (session?.user) {
      const socket = io(process.env.NEXT_PUBLIC_SERVER_URL, { transports: ["websocket"] })
      socketRef.current = socket;

      const user = session.user;

      socket.on("connect", () => {
        socket.emit("new-user", user.id, (response: serverUserObj) => {
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

      socket.on("received-message", (googleID, message) => {
        receivedMessage(googleID, message);
      });

    }
  }, [session]);

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
      allMessages
    }}>
      { children }

    </SocketContext.Provider>
  );
}


export function useSocket() {
  const context: ReturnValue = useContext(SocketContext);

  return { ...context };
}
