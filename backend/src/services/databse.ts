import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  host: 'ec2-3-222-74-92.compute-1.amazonaws.com',
  database: 'd5bgs720l6lgq5',
  username: 'ahuwssrxwajjdp',
  password: '13a254af4572feb8217ee5f4e7d90835378e578449f3707047e03d6f6ddd7f9c',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    },
  },
  logging: false
});

// with ssl
// postgres://ahuwssrxwajjdp:13a254af4572feb8217ee5f4e7d90835378e578449f3707047e03d6f6ddd7f9c@ec2-3-222-74-92.compute-1.amazonaws.com:5432/d5bgs720l6lgq5/postgres?ssl=true&sslmode=require


export { sequelize };