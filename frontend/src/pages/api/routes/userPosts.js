import { sequelize } from "../database/connect";

export default async function userPosts(request, response) {
  try {
    const { userID } = request.body;

    let [posts] = await sequelize.query(`
      SELECT content, fk_user_id, likes_amount, dislikes_amount, username, image_url, "Post".created_on, "Post".id FROM "Post"
      INNER JOIN "User" ON "User".id = "Post".fk_user_id
      WHERE "Post".fk_user_id = '${userID}'
      ORDER BY "Post".id DESC;
    `);
    
    return response.json({ success: true, posts })    

  } catch(e) {
    return response.json({ error: true, message: "Erro ao selecionar content." });
  }
}