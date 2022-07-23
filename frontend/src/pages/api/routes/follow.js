import { sequelize } from "../database/connect";

export default async function follow(request, response) {
	try {
		const { userID, followerID } = request.body;

		await sequelize.query(`
			INSERT INTO "Follower" (fk_user_id, fk_follower_id)
			VALUES ('${userID}', '${followerID}')
		`);

		return response.json({ success: true });

	} catch(e) {
		return response.json({ error: true, message: "Erro ao seguir usuário." });
	}
}