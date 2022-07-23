import { Router } from "express";

const post = Router();

post.put("/", (request, response) => {
  try {

  } catch(e) {
    console.log("----| Error |-----: ", e);
    return response.status(400).json({ error: true, message: "Error ao criar post" });
  }

  try
});