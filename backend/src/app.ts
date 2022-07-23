import express from "express";
const app = express();


app.get("/", (request, response) => {
  response.json({ success: true });
});



app.listen(process.env.PORT || "8081", () => console.log("Server is running"));