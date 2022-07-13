import { sequelize } from "../database/connect";

export default async function verifyUser(request, response) {
  const { userID } = request.body;


  const [result] = await sequelize.query(`
    SELECT username, image_url, created_on FROM "User" where user_id = '${userID}';
  `);

  if (result.length === 0) 
    return response.json({ userExists: false });
  else 
    return response.json({ userExists: true, user: result[0] });

}