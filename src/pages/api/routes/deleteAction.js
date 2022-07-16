import { sequelize } from "../database/connect";

export default async function deleteAction(request, response) {

  const { userID, postID, action } = request.body;

  await sequelize.query(`
    DELETE FROM "LikeAndDislike"
    WHERE fk_user_id = '${userID}' 
    AND fk_post_id = ${postID}
  `);

  if (action === "Like") {
    await sequelize.query(`
      UPDATE "Post"
      SET likes_amount = ((SELECT likes_amount FROM "Post" WHERE id = ${postID}) - 1)
      WHERE id = ${postID}
    `);    
  } else {
    await sequelize.query(`
      UPDATE "Post"
      SET dislikes_amount = ((SELECT dislikes_amount FROM "Post" WHERE id = ${postID}) - 1)
      WHERE id = ${postID}
    `);        
  }


  return response.json({ success: true });
}