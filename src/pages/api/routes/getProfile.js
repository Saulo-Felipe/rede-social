import { sequelize } from "../database/connect";

export default async function getProfile(request, response) {
  const { userID } = request.body;

  let [user] = await sequelize.query(`
    SELECT id, username, image_url, created_on 
    FROM "User" 
    WHERE id = '${userID}';
  `);

  if (user.length !== 0) {
    user = user[0];

    const [following] = await sequelize.query(`
      select count(*) as following from "Follower"
      where fk_user_id = '${user.id}';
    `);

    const [followers] = await sequelize.query(`
      select count(*) as followers from "Follower"
      where fk_follower_id = '${user.id}';
    `);

    user.following = following[0].following;
    user.followers = followers[0].followers;

    return response.json({ success: true, userExists: true, user });
  }

  else 
    return response.json({ success: true, userExists: false });

}