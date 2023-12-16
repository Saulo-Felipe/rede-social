"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const routes_1 = require("./startup/routes");
const socket_1 = require("./listeners/socket");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes 
(0, routes_1.useRoutes)(app);
// Listeners
(0, socket_1.useSocket)(app, httpServer);
app.get("/", (request, response) => {
    response.json({ success: true });
});
httpServer.listen(process.env.PORT || "8081", () => console.log("Server is running"));
