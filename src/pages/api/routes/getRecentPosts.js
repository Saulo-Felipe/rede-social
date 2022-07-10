import { sequelize } from "../database/connect"

export default async function getRecentPosts(request, response) {
  try {
    var [result] = await sequelize.query(`
      SELECT "User".username, "Post".content, "User".image_url FROM "Post"
      INNER JOIN "User" ON "User".user_id = "Post".fk_user_id
      ORDER BY post_id DESC;
    `);

    return response.status(200).json({ posts: result, success: true });
  }
  catch(e) {
    console.log("Erro interno: ", e);
    return response.status(500).json({ error: true });
  }
}