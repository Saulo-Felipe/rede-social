import { sequelize } from "../database/connect";

export default async function unFollow(request, response) {
	try {
		const { userID, followerID } = request.body;

		await sequelize.query(`
			DELETE FROM "Follower" 
			WHERE fk_user_id = '${userID}' 
			AND fk_follower_id = '${followerID}'
		`);

		return response.json({ success: true });		

	} catch(e) {
		return response.json({ error: true, message: "Erro ao parar de seguir usuario." });
	}
}