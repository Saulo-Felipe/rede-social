import { Server as ServerIO } from "socket.io";
import { sequelize } from "../database/connect";

var clients = [];
var messages = [];

export default async function socketio(req, response) {
  if (!response.socket.server.io) {
    console.log("[server]: init server");

    const httpServer = response.socket.server;

    const io = new ServerIO(httpServer, {
      path: "/api/socket/socketio"
    });
    
    io.on("connection", (socket) => {
      console.log("[server] new connection: ", socket.id);

      socket.on("disconnect", () => {
        for (let c = 0; c < clients.length; c++) {
          if (clients[c].socketID === socket.id) {
            socket.broadcast.emit("offline-user", clients[c].googleID);

            clients.splice(c, 1);
          }
        }
      });

      socket.on("new-user", (googleID, callback) => {
        console.log("[new user]: ", googleID);
        clients.push({ googleID, socketID: socket.id });

        socket.broadcast.emit("new-user", { googleID, socketID: socket.id });

        callback({
          clients,
          messages
        });
      });

      socket.on("new-message", (message) => {
        // Insert message on database sequelize.query("");
        console.log("[new message]: ", message);
        messages = [message, ...messages];
        socket.broadcast.emit("new-message", message);
      });
    });

    response.socket.server.io = io;
  }

  response.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};