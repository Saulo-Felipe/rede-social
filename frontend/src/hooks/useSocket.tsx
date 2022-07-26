import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { api } from "../services/api";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

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
}

interface serverUserObj {
  allUsers: {
    [key: string]: string;
  }
}

export function SocketProvider({ children }) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { data: session } = useSession();
  const allUsersRef = useRef(allUsers);


  function socketConnect() {
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL, { transports: ["websocket"] })
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
    
    async function initialState(initialValue: any) {
      console.log("[initial reiceved]: ", initialValue);

      let newUsers: User[] = await getUsers();

      for (let i in initialValue) {
        for (let j = 0; j < newUsers.length; j++) {
          if (initialValue[i] === newUsers[j].id) {
            newUsers[j].isOnline = true;
            break;
          }
        }
      }

      setAllUsers([ ...newUsers ]);
    }

    function newUser(socketID: string, googleID: string) {
      let newUsers = allUsersRef.current;
      console.log("[new user]: ", googleID);

      for (let i in newUsers) {
        if (newUsers[i].id === googleID) {
          newUsers[i].socketID = socketID;
          newUsers[i].isOnline = true;
          break;
        }
      }

      setAllUsers([ ...newUsers ]);
    }

    function deleteUser(googleID: string) {
      let newUsers = allUsersRef.current;

      for (let i in newUsers) {
        if (newUsers[i].id === googleID) {
          newUsers[i].isOnline = false;

          console.log("[delete]: ", newUsers[i].id);
          break;
        }
      }

      setAllUsers([ ...newUsers ]);
    }
    
    async function getUsers() {
      const { data } = await api.get("user/all",);
  
      if (data.success) { 
        return data.users;
      } else {
        alert("Erro ao buscar usuários.");
      }
    }
  }


  useEffect(() => {
    if (session?.user) {
      socketConnect(); 
    }
  }, [session]);

  useEffect(() => {
    allUsersRef.current = allUsers;
  }, [allUsers])

  return (
    <SocketContext.Provider value={{ 
      allUsers, 
      setAllUsers
    }}>
      <div>{ children }</div>
      
    </SocketContext.Provider>
  );
}


export function useSocket() {
  const context: ReturnValue = useContext(SocketContext);

  return { ...context };
}
