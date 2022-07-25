import { Router } from "express";
import { sequelize } from "../services/databse";

const index = Router();


interface searchParams {
  searchQuery: string;
}

index.get("/search/:searchQuery", async (request, response) => {
  try {
    const { searchQuery }: searchParams = request.params;

    const [users] = await sequelize.query(`
      SELECT * FROM "User" 
      WHERE username ILIKE '%${searchQuery}%';
    `);

    return response.json({ success: true, users });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(203).json({ error: true, message: "Erro ao pesquisar usuários" });
  }
})

export { index }