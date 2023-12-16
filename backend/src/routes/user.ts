import { Router } from "express";
import { verifyToken } from "../utils/authorization";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { cloudinary } from "../utils/cloudinary";
import { prisma } from "../../prisma/prismaClient";

const user = Router();

user.use(verifyToken);

interface getProfileParams {
  userID: string;
  currentUserID: string;
}

user.get("/profile/:userID/:currentUserID", async (request, response) => {
  try {
    const { currentUserID, userID }: getProfileParams = request.params;

    let user: any = await prisma.$queryRawUnsafe(`
      SELECT
        id,
        username,
        COALESCE(image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url,
        created_on,
        COALESCE(cover_color, '#2F5BAC') as cover_color,
        COALESCE(bio, 'Sem biografia') as bio,
          CASE WHEN password is null
            THEN false
          ELSE true
          END as "havePassword"
      FROM "User"
      WHERE id = '${userID}';
    `);

    if (user.length !== 0) { // Get followers and followings
      user = user[0];

      const following: any = await prisma.$queryRawUnsafe(`
        select count(*) as following from "Follower"
        where fk_user_id = '${user.id}';
      `);

      const followers: any = await prisma.$queryRawUnsafe(`
        select count(*) as followers from "Follower"
        where fk_follower_id = '${user.id}';
      `);

      user.following = parseInt(following[0].following);
      user.followers = parseInt(followers[0].followers);

      // Is follower?
      const isFollowing: any = await prisma.$queryRawUnsafe(`
        SELECT id FROM "Follower"
        WHERE fk_user_id = '${currentUserID}'
        AND fk_follower_id = '${userID}'
      `);

      return response.json({
        success: true,
        userExists: true,
        user,
        isFollowing: isFollowing.length !== 0
      });

    } else return response.json({ success: true, userExists: false });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao buscar profile." });
  }
});


interface postsParams {
  userID: string;
}

user.get("/posts/:userID", async (request, response) => {
  try {
    const { userID }: postsParams = request.params;

    const posts: any = await prisma.$queryRawUnsafe(`
      SELECT
        "Post".id,
        "Post".fk_user_id,
        "Post".content,
        "Post".images,
        "Post".created_on,
        "User".username,
        COALESCE("User".image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url
      FROM "Post"
        INNER JOIN "User" ON "Post".fk_user_id = "User".id
        WHERE "Post".fk_user_id = '${userID}'
        ORDER BY "Post".id DESC
    `);

    return response.json({ success: true, posts });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao selecionar posts do usuário." });
  }
});


interface newFollowBody {
  userID: string;
  followerID: string;
}

user.put("/new-follow", async (request, response) => {
  try {
    const { userID, followerID }: newFollowBody = request.body;

    await prisma.$queryRawUnsafe(`
      INSERT INTO "Follower" (fk_user_id, fk_follower_id)
      VALUES ('${userID}', '${followerID}')
    `);

    return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao seguir o usuário." });
  }
});


interface unfollowBody {
  userID: string;
  followerID: string;
}

user.delete("/unfollow/:userID/:followerID", async (request, response) => {
  try {
    const { userID, followerID }: unfollowBody = request.params;

		await prisma.$queryRawUnsafe(`
			DELETE FROM "Follower"
			WHERE fk_user_id = '${userID}'
			AND fk_follower_id = '${followerID}'
		`);

		return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao parar de seguir usuário." });
  }
});

user.get("/all", async (request, response) => {
  try {

    let users = await prisma.$queryRawUnsafe(`
      SELECT id, username, COALESCE(image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url FROM "User"
    `);

    return response.json({ success: true, users });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao buscar usuários." });
  }
});


user.get("/current", async (request, response) => {
  try {
    const token = request.header("app-token") || "";

    jwt.verify(token, String(process.env.SECRET), async (err, decoded: any) => {

      if (decoded) {
        const [user]: any = await prisma.$queryRawUnsafe(`
          SELECT id FROM "User"
          WHERE email = '${decoded.email}'
        `);

        return response.json({ user: user });

      } else {
        return response.json({ logout: true });
      }
    });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao buscar usuário." });
  }
});


interface UpdateUserInfoBody {
  bio: string;
  name: string;
  picture: null | File;
  cover_color: string | null;
  currentPassword: string;
  newPassword: string;
  id: string;
}

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/images/user'),
  filename: (request, file, callback) => {
    callback(null, uuid()+"."+file.mimetype.split("/")[1]);
  }
});

const upload = multer({ storage: storage }).array("picture");


user.post("/update-info", upload, async (request, response) => {
  try {
    const email: any = request.header("current-user-email");
    const {bio, cover_color, id, name, picture, currentPassword, newPassword}: UpdateUserInfoBody = JSON.parse(request.body.body);
    const file: any = request.files;

    let user: any = await prisma.$queryRawUnsafe(`
      SELECT cloudinary_id, password FROM "User" WHERE email = '${email}'
    `);

    if (picture && user[0].cloudinary_id) {
      await cloudinary.uploader.destroy(user[0].cloudinary_id);
    }

    if (currentPassword === '' && newPassword === '') {
      let cloudinaryId: any = picture ? await cloudinary.uploader.upload(file[0].path) : ""

      await prisma.$queryRawUnsafe(`
        UPDATE "User"
        SET bio = '${bio}',
        cover_color = '${cover_color}',
        username = '${name}'
        ${picture ? `, image_url = '${cloudinaryId.secure_url}'` : ""}
        ${picture ? `, cloudinary_id = '${cloudinaryId.public_id}'` : ""}
        WHERE email = '${email}' AND id = '${id}'
      `);

      return response.json({ success: true });

    } else { // change password
      if (user.length > 0) {
        const match = user[0].password ? await bcrypt.compare(currentPassword, user[0].password) : true;

        if (match) {
          let cloudinaryId: any = picture ? await cloudinary.uploader.upload(file[0].path) : "";
          const salt = await bcrypt.genSalt(5);
          const hash = await bcrypt.hash(newPassword, salt);

          await prisma.$queryRawUnsafe(`
            UPDATE "User"
            SET
            bio = '${bio}',
            cover_color = '${cover_color}',
            username = '${name}'
            ${picture ? `, image_url = '${cloudinaryId.secure_url}'` : ""}
            password = '${hash}',
            ${picture ? `, cloudinary_id = '${cloudinaryId.public_id}'` : ""}
            WHERE email = '${email}' AND id = '${id}'
          `);

          return response.json({ success: true });

        } else { // incorrect password
          return response.json({ failed: true, message: "Senha incorreta." });
        }
      } else { // Erro de permissão
        return response.json({ failed: true, message: "Permission denied." });
      }
    }

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao atualizar dados." });
  }
});

export { user };