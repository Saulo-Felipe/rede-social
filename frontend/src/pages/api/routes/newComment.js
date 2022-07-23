import { sequelize } from "../database/connect";


export default async function(request, response) {
	try {
		const { content, userID, postID } = request.body;

    let date = String(new Date()).split(" ");
    date = date[2] + "," + date[1] + "," + date[3] + "," + date[4];

		await sequelize.query(`
			INSERT INTO "Comment" (content, fk_user_id, fk_post_id, created_on)
			VALUES (
				'${content}',
				'${userID}',
				${postID},
				'${date}'
			)
		`);

		return response.json({ success: true });

	} catch(e) {
		return response.json({ error: true, message: "Erro ao criar comentário" });
	}
}