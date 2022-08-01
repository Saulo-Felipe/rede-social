import { sequelize } from "../services/databse";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { Router } from "express";
import { getCurrentDate } from "../utils/date";
import jwt from "jsonwebtoken";

const authentication = Router();


interface RegisterEmailBody {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

authentication.put("/register/email", async (request, response) => {
  try {
    const { email, name, password, passwordConfirm }: RegisterEmailBody = request.body;

    if (password === passwordConfirm) {

      const [result] = await sequelize.query(`
        SELECT id FROM "User"
        WHERE email = '${email}'
      `);

      if (result.length === 0) {

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, async (error, hash) => {
            await sequelize.query(`
              INSERT INTO "User" (id, username, email, image_url, password, auth_type, created_on)
              VALUES (
                '${uuid()}', '${name}', '${email}', ${null}, '${hash}', 'Email', '${getCurrentDate()}'
              );
            `);
          });
        });

        return response.json({ success: true });

      } else return response.json({ success: true, failed: true, message: "Este email já está em uso" });

    } else return response.json({ success: true, failed: true, message: "Senhas inválidas." });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(203).json({ error: true, message: "Erro ao criar usuário." });
  }
});


interface RegisterGoogleBody {
  name: string;
  email: string;
  image_url: string;
  id: string;
}

authentication.put("/register/google", async (request, response) => {
  try {
    const { email, id, image_url, name }: RegisterGoogleBody = request.body;

    const [result] = await sequelize.query(`
      SELECT id FROM "User"
      WHERE email = '${email}'
    `);
    
    if (result.length == 0) {
      await sequelize.query(`
        INSERT INTO "User" (id, username, email, image_url, password, auth_type, created_on)
        VALUES (
          '${id}', '${name}', '${email}', '${image_url}', ${null}, 'Google', '${getCurrentDate()}'
        );
      `);
    }

    return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(203).json({ error: true, message: "Erro ao criar usuário." });
  }
});


interface LoginBody {
  email: string;
  password: string;
}

authentication.post("/login", async (request, response) => {
  try {
    const { email, password }: LoginBody = request.body;

    const [user]: any = await sequelize.query(`
      SELECT password, auth_type, email FROM "User" 
      WHERE email = '${email}'
    `);

    console.log(user);

    if (user.length == 0) {
      return response.json({ success: true, failed: true, message: "Essa conta não existe." });
    }

    if (user[0].password === null)
      return response.json({ 
        success: true, 
        failed: true, 
        message: `Esta conta foi registrada via ${user[0].auth_type}, tente "Entrar com ${user[0].auth_type}".` 
      });


    bcrypt.compare(password, user[0].password, (err, result) => {
      if (result) {
        
        const token = jwt.sign({ email: user[0].email }, "SECTETR HERE", {
          expiresIn: "1d"
        });

        console.log("Your token: ", token);

        return response.json({ 
          success: true, 
          message: "Login realizado com sucesso!",
          token: token
        });
      }
      else 
        return response.json({ success: true, failed: true, message: "Senha incorreta" })
    });
    
  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(203).json({ error: true, message: "Erro ao criar usuário." });
  }

});


authentication.post("/current-session", (request, response) => {
  try {
    const token = request.header("token") || "";

    if (token && typeof token === "string" && token !== null) {
      console.log("Token: ", token);
      jwt.verify(token, "SECTETR HERE", async (err, decoded: any) => {
        if (err) console.log("error: ", err);
  
        if (decoded) {
          const [user] = await sequelize.query(`
            SELECT id, username, email, image_url, created_on FROM "User"
            WHERE email = '${decoded.email}'
          `);
  
          return response.json({ user: user[0], isAuthenticated: true });
  

        } else return response.json({ user: {}, isAuthenticated: false });
      });
    } else return response.json({ user: {}, isAuthenticated: false });

    
  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(203).json({ error: true, message: "Erro ao selecionar usuário." });
  }
});



export { authentication };