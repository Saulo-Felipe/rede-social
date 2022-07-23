import { Router } from "express";
import { sequelize } from "../services/databse";

const post = Router();

interface recentPostsParams {
  index: string;
}

post.get("/recent/:index", async (request, response) => {
  try {
    const { index }: recentPostsParams = request.params;

    const [posts] = await sequelize.query(`
      SELECT "Post".id, content, fk_user_id, likes_amount, dislikes_amount, username, image_url, "Post".created_on FROM "Post"
      INNER JOIN "User" ON "User".id = "Post".fk_user_id
      ORDER BY "Post".id DESC
      OFFSET 5*${Number(index)} LIMIT 5;
    `);

    return response.json({ success: true, posts });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(400).json({ error: true, message: "Erro ao buscar postagens recentes." });
  }
});

interface createPostBody {
  postContent: string;
  userID: string;
  createdOn: string;
}

post.put("/create", async (request, response) => {
  try {
    const { createdOn, postContent, userID }: createPostBody = request.body;

    if (createdOn && postContent && userID) {

      await sequelize.query(`
        INSERT INTO "Post" (content, fk_user_id, created_on)
        VALUES (
          '${postContent}',
          '${userID}',
          '${createdOn}'
        );
      `);

      return response.json({ success: true });

    } else throw true;

  } catch(e) {
    console.log('----| Error |-----: ', e)
    return response.status(400).json({ error: true, message: "Erro ao criar post" });
  }
});

interface getPostsFromUser {
  userID: string;
}

post.get("/get-by-user/:userID", async (request, response) => {
  try {
    const { userID }: getPostsFromUser = request.params;

    console.log("type: ", typeof userID);

    const [posts] = await sequelize.query(`
      SELECT content, fk_user_id, likes_amount, dislikes_amount, username, image_url, "Post".created_on, "Post".id FROM "Post"
      INNER JOIN "User" ON "User".id = "Post".fk_user_id
      WHERE "Post".fk_user_id = '${userID}'
      ORDER BY "Post".id DESC;    
    `);
    
    return response.json({ success: true, posts });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(400).json({ error: true, message: "Erro ao buscar posts de usuário" });
  }
});




export { post };