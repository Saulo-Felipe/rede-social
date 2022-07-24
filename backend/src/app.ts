import express from "express";
import { useRoutes } from "./startup/routes";
import cors from "cors";

const app = express();

// Global Middlewares

app.use(express.json());

app.use(cors({
  origin: "https://3000-saulofelipe-redesocial-69ox3rp2t3r.ws-us54.gitpod.io",
  //optionsSuccessStatus: 200
}));


// Routes 
useRoutes(app);

app.get("/", (request, response) => {
  response.json({ success: true });
});


app.listen(process.env.PORT || "8081", () => console.log("Server is running"));