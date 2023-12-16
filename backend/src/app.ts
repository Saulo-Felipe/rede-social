import "dotenv/config";
import express from "express";
import cors from "cors";

import { createServer } from "http";

import { useRoutes } from "./startup/routes";
import { useSocket } from "./listeners/socket";


const app = express();
const httpServer = createServer(app);


// Middlewares
app.use(express.json());

app.use(cors());


// Routes 
useRoutes(app);

// Listeners
useSocket(app, httpServer);

app.get("/", (request, response) => {
  response.json({ success: true });
});


httpServer.listen(process.env.PORT || 8081, () => console.log("Server is running"));