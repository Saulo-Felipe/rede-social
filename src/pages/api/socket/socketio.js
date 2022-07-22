import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, response) => {
  console.log("entrei")
  if (!response.socket.server.io) {
    console.log("[server]: new Connection");

    const httpServer = response.socket.server;

    const io = new ServerIO(httpServer, {
      path: "/api/socket/socketio"
    });
    
    io.on("connection", (socket) => {
      console.log(socket)
    })

    response.socket.server.io = io;
  }

  response.end();
};
