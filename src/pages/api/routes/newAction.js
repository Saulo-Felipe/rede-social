import { sequelize } from "../database/connect";


export default async function newAction(request, response) {
  const { userID, postID, action, deleteOthers } = request.body;
  
  if (deleteOthers) {
    await sequelize.query(`
      DELETE FROM "LikeAndDislike" 
      WHERE fk_user_id = '${userID}' 
      AND fk_post_id = ${postID} 
      AND type = ${action == "Like" ? 1 : 0};
    `);
  } 

  await sequelize.query(`
    INSERT INTO "LikeAndDislike" (fk_user_id, fk_post_id, type)
    VALUES (
      '${userID}',
      ${postID},
      ${action == "Like" ? 0 : 1}
    );
  `);
  
  await sequelize.query(`
    UPDATE "Post"
    SET likes_amount = ((select likes_amount from "Post" where id = ${postID}) + 1)
    WHERE id = ${postID}
  `);

  return response.json({ success: true });

}