import { sequelize } from "../database/connect";


export default async function newAction(request, response) {
  const { userID, postID, action, deleteOthers } = request.body;
  
  const Add_type = action == "Like" ? "likes_amount" : "dislikes_amount";
  const Remove_type = action == "Like" ? "dislikes_amount" : "likes_amount" ;
  
  if (deleteOthers) {
    console.log("Deletando others");

    await sequelize.query(`
      DELETE FROM "LikeAndDislike" 
      WHERE fk_user_id = '${userID}' 
      AND fk_post_id = ${postID} 
      AND type = ${action == "Like" ? 1 : 0};
    `);

    await sequelize.query(`
      UPDATE "Post"
      SET ${Remove_type} = ((select ${Remove_type} from "Post" where id = ${postID}) - 1)
      WHERE id = ${postID}
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
    
  // Add new action 
  await sequelize.query(`
    UPDATE "Post"
    SET ${Add_type} = ((select ${Add_type} from "Post" where id = ${postID}) + 1)
    WHERE id = ${postID}
  `);

  return response.json({ success: true });

}