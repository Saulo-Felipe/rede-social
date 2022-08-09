import { response, Router } from "express";
import { sequelize } from "../services/databse";
import path from "path";

const index = Router();


interface searchParams {
  searchQuery: string;
}

index.get("/test", async (request, response) => {
  try {
    const [result] = await sequelize.query(`
      select * from "User"
    `);

    return response.json({ success: true, teste: result });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "ErroR: "+e });
  }
});

index.get("/search/:searchQuery", async (request, response) => {
  try {
    const { searchQuery }: searchParams = request.params;

    let [users] = await sequelize.query(`
      SELECT id, username, email, COALESCE(image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url FROM "User" 
      WHERE username ILIKE '%${searchQuery}%';
    `);

    return response.json({ success: true, users });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao pesquisar usuários" });
  }
});


interface getImageParams {
  image: string;
}

index.get("/images/user/:image", (request, response) => {
  try {
    const { image }: getImageParams = request.params;

    return response.sendFile(path.join(__dirname, "../public/images/user/"+image));

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro. Arquivo inválido." });
  }
});


index.get("/images/post/:image", (request, response) => {
  try {
    const { image }: getImageParams = request.params;

    return response.sendFile(path.join(__dirname, "../public/images/posts/"+image));

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro. Arquivo inválido." });
  }
});


interface AllMessagesBody {
  index: boolean;
}

index.post("/all-messages", async (request, response) => {
  try {
    const { index }: AllMessagesBody = request.body;

    const [messages] = await sequelize.query(`
      SELECT * FROM global_messages
      LIMIT 20 OFFSET 20*${index}
    `);

    return response.json({ success: true, messages });
    
  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Eror ao buscar mensagens." });
  }
});

export { index }