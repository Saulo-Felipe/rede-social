import { Sequelize } from "sequelize";


export const sequelize = new Sequelize("bmjqzsun", "bmjqzsun", "TqAEuiIySZ2MjlOjrKkv4U_RjQBkUO-q", {
  host: "kesavan.db.elephantsql.com",
  dialect: "postgres"
});


export default function handler(req, res) {
  res.status(200).json({ Ok: true })
};