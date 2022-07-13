import { sequelize } from "../database/connect";

export default async function newPost(request, response) {
  try {
    if (request.method === "POST") {
      const { post, userEmail, date } = request.body;
      
      if (post && post.length > 0 && userEmail && userEmail.length > 0) {

        await sequelize.query(`
          INSERT INTO "Post" (content, fk_user_id, created_on)
          VALUES (
            '${post}', 
            ( select user_id from "User" where email = '${userEmail}' ),
            '${date}'
          );        
        `);

        return response.status(200).json({ success: true });

      } else {
        return response.status(400).json({ error: true, message: "Valor de post ou dado de usuário inválido." });
      }  
    }
  } catch(e) {
    console.log("Erro interno: ", e);
    return response.status(500).json({ error: true });
  }
}