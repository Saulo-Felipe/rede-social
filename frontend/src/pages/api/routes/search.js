import { sequelize } from "../database/connect";

export default async function search(request, response) {
	try {
		const { search } = request.body;


		const [users] = await sequelize.query(`
			SELECT * FROM "User" 
			WHERE username ILIKE '%${search}%';
		`);

		return response.json({ success: true, users });

	} catch(e) {
		return response.json({ error: true, message: "Erro ao realizar pesquisa." });
	}
}