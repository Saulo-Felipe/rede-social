import { Express } from "express";
import { Server } from "socket.io";

interface allUsers {
  [key: string]: string;
}

export function useSocket(app: Express, httpServer: any) {
  const io = new Server(httpServer);
  let allUsers: allUsers = {};

  io.on("connection", (socket) => {
    console.log("[new connection] -> ", socket.id);

    socket.on("new-user", (googleID, callback) => {
      newUser(googleID, socket.id);

      socket.broadcast.emit("new-user", socket.id, googleID);

      callback({
        allUsers
      });
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("delete-user", allUsers[socket.id]);
      
      deleteUser(socket.id);
    });

    // Chat
    socket.on("new-message", (googleID, message) => {
      io.sockets.emit("received-message", googleID, message);
    });
  });

  function newUser(googleID: string, socketID: string) {
    console.log("[new-user]: ", googleID);
    
    allUsers[socketID] = googleID;
  }

  function deleteUser(socketID: string) {
    console.log("[delete user]: ", allUsers[socketID]);
    delete allUsers[socketID];
  }
}
