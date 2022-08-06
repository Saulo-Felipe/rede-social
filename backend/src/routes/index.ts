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
      SELECT id, username, email, COALESCE(image_url, '${process.env.SERVER_URL}/images/profile-user.png') as image_url FROM "User" 
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

index.get("/images/:image", (request, response) => {
  try {
    const { image }: getImageParams = request.params;

    return response.sendFile(path.join(__dirname, "../images/"+image));

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro. Arquivo inválido." });
  }
});

export { index }