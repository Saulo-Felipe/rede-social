import { sequelize } from "../database/connect";
 
export default async function getComments(request, response) {
	try {
		const { postID } = request.body;

		const [comments] = await sequelize.query(`
			SELECT
			"User".id as "userID", 
			"Comment".id as "commentID", 
			username, 
			image_url, 
			"Comment".content,
			"Comment".created_on
			FROM "Comment" 
			INNER JOIN "User" ON "User".id = "Comment".fk_user_id
			WHERE fk_post_id = ${postID}
			ORDER BY "commentID" DESC
		`);

		return response.json({ success: true, comments });

	} catch(e) {
		console.log("error: ", e)
		return response.json({ erro: true, message: "Erro ao buscar comentários!" });
	}
}