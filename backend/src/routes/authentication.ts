import { sequelize } from "../services/databse";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { Router } from "express";
import { getCurrentDate } from "../utils/date";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/authorization";

const authentication = Router();


interface RegisterEmailBody {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

authentication.get("/verify-token", verifyToken, (request, response) => {
  return response.json({ success: true });
});

authentication.put("/register/email", async (request, response) => {
  try {
    const { email, name, password, passwordConfirm }: RegisterEmailBody = request.body;

    if (password === passwordConfirm) {

      const [result] = await sequelize.query(`
        SELECT id FROM "User"
        WHERE email = '${email}'
      `);

      if (result.length === 0) {
        const id = uuid();
        const createdOn = getCurrentDate()

        bcrypt.genSalt(5, (err, salt) => {
          bcrypt.hash(password, salt, async (error, hash) => {
            await sequelize.query(`
              INSERT INTO "User" (id, username, email, image_url, password, auth_type, created_on)
              VALUES (
                '${id}', '${name}', '${email}', ${null}, '${hash}', 'Email', '${createdOn}'
              );
            `);
          });
        });

        // Automatic login
        const token: any = jwt.sign({ email: email }, String(process.env.SECRET), {
          expiresIn: "1d"
        });

        return response.json({
          success: true, 
          token: token,
          user: {
            id,
            name, 
            email, 
            createdOn,
            picture: process.env.SERVER_URL+"/images/user/profile-user.png"
          }
        });
        
      } else return response.json({ success: true, message: "Este email já está em uso" });

    } else return response.json({ success: true, message: "Senhas inválidas." });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao criar usuário." });
  }
});


interface RegisterGoogleBody {
  name: string;
  email: string;
  image_url: string;
  id: string;
  bio?: string
}

authentication.post("/signin/:authType", async (request, response) => {
  try {
    const { email, id, image_url, name, bio }: RegisterGoogleBody = request.body;
    const { authType } = request.params;

    const [result]: any = await sequelize.query(`
      SELECT id, username, image_url, created_on FROM "User"
      WHERE email = '${email}'
    `);
    
    const currentDate = result.length == 0 ? getCurrentDate() : result[0].created_on;

    if (result.length == 0) {
      console.log("[creating user]");

      await sequelize.query(`
        INSERT INTO "User" (id, username, email, image_url, password, auth_type, created_on, bio)
        VALUES (
          '${id}', 
          '${name}', 
          '${email}', 
          '${image_url}', 
          ${null}, 
          '${authType}', 
          '${currentDate}',
          ${bio ? `${bio}` : null}
        );
      `);
    }

    // Automatic login

    const token: string = jwt.sign({ email: email }, String(process.env.SECRET), {
      expiresIn: "1d"
    });

    console.log("[Google] success");

    return response.json({
      success: true, 
      token: token,
      message: "Login realizado com sucesso!",
      user: {
        id: result[0] ? result[0].id : id,
        name: result[0] ? result[0].username : name, 
        email, 
        picture: result[0] ? result[0].image_url : image_url,
        createdOn: currentDate,
      }
    });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao criar usuário." });
  }
});


interface LoginBody {
  email: string;
  password: string;
}

authentication.post("/login", async (request, response) => {
  try {
    const { email, password }: LoginBody = request.body;

    let [user]: any = await sequelize.query(`
      SELECT id, username, COALESCE(image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url, password, auth_type, email, created_on FROM "User" 
      WHERE email = '${email}'
    `);

    if (user.length == 0) {
      return response.json({ success: true, message: "Essa conta não existe." });
    }

    if (user[0].password === null)
      return response.json({ 
        success: true, 
        message: `Esta conta foi registrada via ${user[0].auth_type}, tente "Entrar com ${user[0].auth_type}".` 
      });


    bcrypt.compare(password, user[0].password, (err, result) => {
      if (result) {
        
        const token = jwt.sign({ email }, String(process.env.SECRET), {
          expiresIn: "1d"
        });

        return response.json({ 
          success: true, 
          user: {
            id: user[0].id,
            name: user[0].username,
            email,
            picture: user[0].image_url,
            createdOn: user[0].created_on
          },
          token
        });      
      }
      else 
        return response.json({ success: true, message: "Senha incorreta" });
    });
    
  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao autenticar usuário." });
  }

});

authentication.post("/recover-user-information", (request, response) => {
  try {
    const token = request.header("app-token") || "";

    if (token && typeof token === "string" && token !== null) {

      jwt.verify(token, String(process.env.SECRET), async (err, decoded: any) => {  
        
        if (decoded) {

          let [user]: any = await sequelize.query(`
            SELECT id, username, email, COALESCE(image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url, created_on FROM "User"
            WHERE email = '${decoded.email}'
          `);
          
          return response.json({ 
            success: true,
            user: {
              id: user[0].id,
              name: user[0].username,
              email: user[0].email,
              picture: user[0].image_url,
              createdOn: user[0].created_on
            }
          });
  

        } else return response.json({ message: "Usuário sem autenticação", user: null });
      });
      
    } else return response.json({ message: "Usuário sem autenticação", user: null });

    
  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao selecionar usuário." });
  }
});


export { authentication };