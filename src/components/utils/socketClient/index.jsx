import { useEffect } from "react";
import socketClient from "socket.io-client";
import { apiSocket, api } from "../../../services/api";

export function SocketClient({ onlineUsers, setOnlineUsers, user }) {
  
  const socket = socketClient.connect(process.env.NEXT_PUBLIC_SERVER_URL, {
    path: "/api/socket/socketio"
  });

  useEffect(() => {
    socket.on("connect", async () => {
      console.log("Conectado! [id]: ", socket.id);
  
      // Enviar uma request
      const { data } = await apiSocket.post("/chatMessage", { 
        type: "new-user",  
        data: {
          user: {
            id: user?.id
          }
        }
      });

      const { data: response } = await api.post("/getAllUsers");

      if (response.success) {
        let allUsers = response.users;

        allUsers.forEach((user, index) => {
          data.IDs.forEach((id) => {
            allUsers[index].isOnline = user.id === id;  
          })
        });
  
        setOnlineUsers(allUsers);
  
      } else {
        alert("Erro ao buscar usuários.");
      }

      console.log("[frontend] initial data: ", data);
    });

    
  }, []);

  return <></>
}