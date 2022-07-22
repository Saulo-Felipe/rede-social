import { sequelize } from "../database/connect";

export default async function createPost(request, response) {
  try {
    const { postContent: content, userId: userId, date: createdOn } = request.body;

    if (content && content.length > 0 && userId && userId.length > 0) {

      await sequelize.query(`
        INSERT INTO "Post" (content, fk_user_id, created_on)
        VALUES (
          '${postContent}',
          '${userId}',
          '${createdOn}'
        );
      `);

      return response.status(200).json({ success: true });

    } else {
      throw "Error";
    }

  } catch(e) {
      return response.json({ error: true, message: "Valor de post ou dado de usuário inválido." });
  }

}