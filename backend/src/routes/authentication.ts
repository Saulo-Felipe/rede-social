import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { Router } from "express";
import { getCurrentDate } from "../utils/date";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/authorization";
import { prisma } from "../../prisma/prismaClient";
import { User } from "@prisma/client";

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
      const user = await prisma.user.findFirst({
        select: {
          id: true,
        },
        where: {
          email: email
        }
      });

      if (user === null) {
        const id = uuid();
        const createdOn = getCurrentDate()

        bcrypt.genSalt(5, (err, salt) => {
          bcrypt.hash(password, salt, async (error, hash) => {
            await prisma.user.create({
              data: {
                id,
                username: name,
                email,
                image_url: null,
                password: hash,
                auth_type: "Email",
                created_on: createdOn
              }
            })
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
    const { authType } = request.params; // Google or Github

    const user: User | null = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    const currentDate = user?.created_on || getCurrentDate();

    if (user === null) { //create user automatically if not exists
      await prisma.user.create({
        data: {
          id, 
          username: name, 
          email, 
          image_url, 
          auth_type: authType, 
          created_on: currentDate,
          bio: bio
        }
      })
    }

    // login
    const token: string = jwt.sign({ email: email }, String(process.env.SECRET), {
      expiresIn: "1d"
    });

    return response.json({
      success: true, 
      token: token,
      message: "Login realizado com sucesso!",
      user: {
        id: user?.id || id,
        username: user?.username || name, 
        email, 
        picture: user?.image_url || image_url,
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

    const user: User | null = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if (user === null) {
      return response.json({ success: true, message: "Essa conta não existe." });
    }

    if (user.password === null) {
      return response.json({ 
        success: true, 
        message: `Esta conta foi registrada via ${user.auth_type}, tente "Entrar com ${user.auth_type}".` 
      });
    }

    const isEqual = bcrypt.compareSync(password, user.password);

    if (isEqual) {
      const token = jwt.sign({ email }, String(process.env.SECRET), {
        expiresIn: "1d"
      });

      return response.json({ 
        success: true, 
        user: {
          id: user.id,
          name: user.username,
          email,
          picture: user.image_url || process.env.SERVER_URL+"/images/user/profile-user.png",
          createdOn: user.created_on
        },
        token
      }); 
    }

    return response.json({ success: true, message: "Senha incorreta" });
    
  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao autenticar usuário." });
  }

});

interface JwtVerify extends JwtPayload {
  email: string;
}

authentication.post("/recover-user-information", async (request, response) => {
  try {
    const token = request.header("app-token") || "";

    if (token) {
      const { email }: JwtVerify = jwt.verify(token, String(process.env.SECRET)) as JwtVerify;

      if (email) {
        const user = await prisma.user.findFirst({
          where: {
            email
          },
          select: {
            id: true, 
            username: true,
            email: true,
            image_url: true,
            created_on: true
          }
        });

        return response.json({
          success: true,
          user: {
            ...user,
            name: user?.username,
            picture: user?.image_url || process.env.SERVER_URL+"/images/user/profile-user.png",
            createdOn: user?.created_on
          }
        });
      }

      return response.json({ message: "Usuário sem autenticação", user: null })
      
    } 
    
    return response.json({ message: "Usuário sem autenticação", user: null });
    
  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao selecionar usuário." });
  }
});


export { authentication };