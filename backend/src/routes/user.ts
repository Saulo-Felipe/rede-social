import { Router } from "express";
import { sequelize } from "../services/databse";

const user = Router();


interface newFollowBody {
  userID: string;
  followerID: string;
}

user.put("new-follow", async (request, response) => {
  try {
    const { userID, followerID }: newFollowBody = request.body;

    await sequelize.query(`
      INSERT INTO "Follower" (fk_user_id, fk_follower_id)
      VALUES ('${userID}', '${followerID}')
    `);

    return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(203).json({ error: true, message: "Erro ao seguir o usuário." });
  }
});


export { user };