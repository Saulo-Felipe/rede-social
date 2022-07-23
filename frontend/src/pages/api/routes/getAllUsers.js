import { sequelize } from "../database/connect";

export default async function getAllUsers(request, response) {
  try {

    const [result] = await sequelize.query(`
      SELECT * FROM "User";
    `);

    return response.json({ success: true, users: result });

  } catch(e) {
    return response.json({ error: true, message: "Erro ao buscar usuários" });
  }

} 