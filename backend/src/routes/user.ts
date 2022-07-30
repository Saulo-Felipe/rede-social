import { request, Router } from "express";
import { sequelize } from "../services/databse";

const user = Router();


interface getProfileParams {
  userID: string;
  currentUserID: string;
}

user.get("/profile/:userID/:currentUserID", async (request, response) => {
  try {
    const { currentUserID, userID }: getProfileParams = request.params;

    let [user]: any = await sequelize.query(`
      SELECT id, username, image_url, created_on 
      FROM "User" 
      WHERE id = '${userID}';
    `);

    if (user.length !== 0) { // Get followers and followings
      user = user[0];

      const [following]: any = await sequelize.query(`
        select count(*) as following from "Follower"
        where fk_user_id = '${user.id}';
      `);

      const [followers]: any = await sequelize.query(`
        select count(*) as followers from "Follower"
        where fk_follower_id = '${user.id}';
      `);

      user.following = following[0].following;
      user.followers = followers[0].followers;

      // Is follower?
      const [isFollowing]: any = await sequelize.query(`
        SELECT id FROM "Follower"
        WHERE fk_user_id = '${currentUserID}' 
        AND fk_follower_id = '${userID}'
      `);

      return response.json({ 
        success: true, 
        userExists: true, 
        user,
        isFollowing: isFollowing.length !== 0 
      });
    }

    return response.json({ success: true, userExists: false });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(203).json({ error: true, message: "Erro ao buscar profile." });
  }
});


interface postsParams {
  userID: string;
}

user.get("/posts/:userID", async (request, response) => {
  try {
    const { userID }: postsParams = request.params;

    const [posts]: any = await sequelize.query(`
      SELECT content, "Post".images, fk_user_id, likes_amount, dislikes_amount, username, image_url, "Post".created_on, "Post".id FROM "Post"
      INNER JOIN "User" ON "User".id = "Post".fk_user_id
      WHERE "Post".fk_user_id = '${userID}'
      ORDER BY "Post".id DESC;
    `);

    return response.json({ success: true, posts });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(203).json({ error: true, message: "Erro ao selecionar posts do usuário." });
  }
});


interface newFollowBody {
  userID: string;
  followerID: string;
}

user.put("/new-follow", async (request, response) => {
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


interface unfollowBody {
  userID: string; 
  followerID: string;
}

user.delete("/unfollow/:userID/:followerID", async (request, response) => {
  try {
    const { userID, followerID }: unfollowBody = request.params;

		await sequelize.query(`
			DELETE FROM "Follower" 
			WHERE fk_user_id = '${userID}' 
			AND fk_follower_id = '${followerID}'
		`);

		return response.json({ success: true });		

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(203).json({ error: true, message: "Erro ao parar de seguir usuário." });
  }
});

user.get("/all", async (request, response) => {
  try {

    const [result] = await sequelize.query(`
      SELECT id, username, image_url FROM "User"
    `);

    return response.json({ success: true, users: result });
    
  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(203).json({ error: true, message: "Erro ao buscar usuários." });
  }
});


export { user };