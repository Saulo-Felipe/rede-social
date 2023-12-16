"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSocket = void 0;
const socket_io_1 = require("socket.io");
const date_1 = require("../utils/date");
const prismaClient_1 = require("../../prisma/prismaClient");
function useSocket(app, httpServer) {
    const io = new socket_io_1.Server(httpServer);
    let allUsers = {};
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
        socket.on("new-message", (googleID, message, callback) => __awaiter(this, void 0, void 0, function* () {
            let date = (0, date_1.getCurrentDate)();
            const id = yield saveMessage({ user_id: googleID, message, created_on: date });
            io.sockets.emit("received-message", {
                googleID,
                message,
                createdOn: date,
                messageID: id
            });
            callback(true);
        }));
    });
    function newUser(googleID, socketID) {
        console.log("[new-user]: ", googleID);
        allUsers[socketID] = googleID;
    }
    function deleteUser(socketID) {
        console.log("[delete user]: ", allUsers[socketID]);
        delete allUsers[socketID];
    }
    function saveMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prismaClient_1.prisma.$queryRawUnsafe(`
      INSERT INTO global_messages (user_id, message, created_on)
      VALUES ('${data.user_id}', '${data.message}', '${data.created_on}')
      RETURNING id
    `);
            console.log("[saved message]");
            return result[0].id;
        });
    }
}
exports.useSocket = useSocket;
