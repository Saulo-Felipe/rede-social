// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sequelize } from "./database/connect";

export default async function handler(req, res) {
  try {
    var [response] = await sequelize.query(`select * from "User" `);

    res.status(200).json({ users: response })

  } catch(e) {
    console.log("Erro ao conectar!")
    res.status(200).json({ name: 'erro ao conect' })

  }

}
