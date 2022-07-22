export const users = [];

export default (request, response) => {
  if (request.method === "POST") {
    const { type, data } = request.body;

    if (type === "new-user") {
      users.push(data.user.id);
      
      response.socket.server.io.emit("new-user", data.user.id)

      return response.json({ IDs: users });

    } else if (type === "message") {
      response.socket.server.io.emit("message", data);

    } else if (type === "disconnect") {
      users.forEach((usr, index) => {
        if (usr.id === data.user.id) {
          users.splice(index, 1);
        }
      });

      // dispatch
      response.socket.server.io.emit("")


    }

    //return response.json(data);
  }
}