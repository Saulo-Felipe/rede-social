import { Express } from "express";
import { Server } from "socket.io";
import { sequelize } from "../services/databse";
import { getCurrentDate } from "../utils/date";

interface allUsers {
  [key: string]: string;
}

interface Message {
  message: string;
  created_on: string;
  user_id: string;
}

export function useSocket(app: Express, httpServer: any) {
  const io = new Server(httpServer);
  let allUsers: allUsers = {};

  io.on("connection", (socket) => {
    console.log("[new connection] -> ", socket.id);

    socket.on("new-user", (googleID, callback) => {
      newUser(googleID, socket.id);

      socket.broadcast.emit("new-user", socket.id, googleID);

      callback({ allUsers });
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("delete-user", allUsers[socket.id]);
      
      deleteUser(socket.id);
    });



    // ---------------- Chat -----------

    socket.on("new-message", async (googleID, message, callback) => {
      let date = getCurrentDate();
      await saveMessage({ user_id: googleID, message, created_on: date });

      io.sockets.emit("received-message", googleID, message, date);
      callback(true);
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

  async function saveMessage(data: Message) {
    await sequelize.query(`
      INSERT INTO global_messages (user_id, message, created_on)
      VALUES ('${data.user_id}', '${data.message}', '${data.created_on}')
    `);

    console.log("[saved message]");
  }
}
