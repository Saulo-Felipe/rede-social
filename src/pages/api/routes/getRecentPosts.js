import { sequelize } from "../database/connect"

export default async function getRecentPosts(request, response) {
  try {
    const { paginationIndex } = request.body;

    console.log("index: ", paginationIndex);

    const [posts] = await sequelize.query(`
      SELECT "Post".id, content, fk_user_id, likes_amount, dislikes_amount, username, image_url, "Post".created_on FROM "Post"
      INNER JOIN "User" ON "User".id = "Post".fk_user_id
      ORDER BY "Post".id DESC
      offset 5*${paginationIndex} limit 5;
    `);

    return response.status(200).json({ posts, success: true });
  }
  catch(e) {
    console.log("Erro interno: ", e);
    return response.status(500).json({ error: true, message: "Erro desconhecido ao selecionar posts." });
  }
}