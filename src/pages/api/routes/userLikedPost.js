import { sequelize } from "../database/connect";

export default async function userLikedPost(request, response) {
  const { postID, userID } = request.body;

  const [result] = await sequelize.query(`
    SELECT type FROM "LikeAndDislike"
    WHERE fk_user_id = '${userID}' and fk_post_id = ${Number(postID)}
  `);

  if (result.length !== 0) {
    if (result[0].type == 0)
      return response.json({ success: true, type: "like" });
    else if (result[0] == 1)
      return response.json({ success: true, type: "dislike" });
  }

  return response.json({ success: true, type: "noAction" });

}