import { sequelize } from "../database/connect";

export default async function follow(request, response) {
	const { userID, followerID } = request.body;

	await sequelize.query(`
		INSERT INTO "Follower" (fk_user_id, fk_follower_id)
		VALUES ('${userID}', '${followerID}')
	`);

	return response.json({ success: true });
}