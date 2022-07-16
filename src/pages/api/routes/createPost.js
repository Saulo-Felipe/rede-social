import { sequelize } from "../database/connect";

export default async function createPost(request, response) {
  const { postContent, userID, date } = request.body;

  console.log

  if (postContent && postContent.length > 0 && userID && userID.length > 0) {

    await sequelize.query(`
      INSERT INTO "Post" (content, fk_user_id, created_on)
      VALUES (
        '${postContent}',
        '${userID}',
        '${date}'
      );
    `);

    return response.status(200).json({ success: true });

  } else {
    return response.status(400).json({ error: true, message: "Valor de post ou dado de usuário inválido." });
  }

}