import { useEffect, useRef } from "react";
import socketClient from "socket.io-client";
import { api } from "../../../services/api";


export function SocketClient({ setOnlineUsers, onlineUsers, user, setAllMessages, allMessages, socketRef }) {

  let onlineUsersRef = useRef([]);
  let allMessageRef = useRef([]);

  useEffect(() => {
    onlineUsersRef.current = onlineUsers;
  }, [onlineUsers])

  useEffect(() => {
    allMessageRef.current = allMessages;
  }, [allMessages])

  function organizeUsers(newData) {
    let firstPart = [];
    let secondPart = [];

    for (let c = 0; c < newData.length; c++) {
      if (newData[c].isOnline) {
        firstPart.push(newData[c]);
      } else {
        secondPart.push(newData[c]);
      }
    }

    setOnlineUsers([ ...firstPart, ...secondPart ]);
  }

  function organizeMessages(newData) {
    for (let c = 0; c < newData.length; c++) {
      if (newData[c].googleID === user.id)
        newData[c].isMy = true;
    }

    setAllMessages([ ...newData ]);
  }

  useEffect(() => {
    if (user) {
      const socket = socketClient.connect(process.env.NEXT_PUBLIC_SERVER_URL, {
        path: "/api/socket/socketio"
      });

      socketRef.current = socket;
      
      socket.on("connect", async () => {
        console.log("[new user]: ", socket.id);

        let {data: { users }} = await api.post("/getAllUsers");

        if (users) {
          socket.emit("new-user", user.id, ({clients, messages}) => {
            console.log("[Initial state]", clients);

            for (let i = 0; i < users.length; i++) {
              for (let c = 0; c < clients.length; c++) {
                if (users[i].id === clients[c].googleID)
                  users[i].isOnline = true;
              }
            }
            organizeUsers([ ...users ]);
            organizeMessages(messages);
          });
  
        } else {
          alert("Erro ao buscar usuários");
        }

      });

      socket.on("new-user", ({ googleID, socketID }) => {
        console.log("[reiceved new-user]: ", googleID);

        let currentUsers = onlineUsersRef.current;

        for (let c = 0; c < currentUsers.length; c++) {
          if (currentUsers[c].id === googleID) {
            currentUsers[c].isOnline = true;
            organizeUsers([ ...currentUsers ]);
            break;
          }
        }
      });
      
      socket.on("offline-user", (googleID) => {
        console.log("[offline user]: ", googleID);

        let currentUsers = onlineUsersRef.current;

        for (let c = 0; c < currentUsers.length; c++) {
          if (currentUsers[c].id === googleID) {
            currentUsers[c].isOnline = false;
            organizeUsers([ ...currentUsers ]);
            break;
          }
        }
      });

      socket.on("new-message", (message) => {
        message.isMy = false;

        setAllMessages([ message, ...allMessageRef.current ]);
      })

      /*
        isMy: false,
        content: "olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1olaaa teste 1",
        horario: "12:21",
        userPicture: session?.user?.image
        
      */

      


      if (socket) return () => socket.disconnect();
    }
  }, [user]);

  return <></>
}