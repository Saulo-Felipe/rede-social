import { Router } from "express";
import { v4 as uuid } from "uuid";

import multer from "multer";
import path from "path";
import { verifyToken } from "../utils/authorization";
import { cloudinary } from "../utils/cloudinary";
import { prisma } from "../../prisma/prismaClient";
import { Prisma } from "@prisma/client";

const posts = Router();

posts.use(verifyToken);


posts.delete("/like/:userID/:postID", async (request, response) => {
  try {
    const { postID, userID } = request.params;

    await prisma.likes.deleteMany({
      where: {
        user_id: userID,
        post_id: Number(postID)
      }
    })

    return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao deletar like." });
  }
});

posts.put("/like/:userID/:postID", async (request, response) => {
  try {
    const { postID, userID } = request.params;


    await prisma.dislikes.deleteMany({
      where: {
        user_id: userID,
        post_id: Number(postID)
      }
    });

    await prisma.likes.create({
      data: {
        user_id: userID,
        post_id: Number(postID)
      }
    });

    return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao criar like." });
  }
});

posts.delete("/dislike/:userID/:postID", async (request, response) => {
  try {
    const { postID, userID } = request.params;

    await prisma.dislikes.deleteMany({
      where: {
        user_id: userID,
        post_id: Number(postID)
      }
    })

    return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro deletar dislike." });
  }
});

posts.put("/dislike/:userID/:postID", async (request, response) => {
  try {
    const { postID, userID } = request.params;

    await prisma.likes.deleteMany({
      where: {
        user_id: userID,
        post_id: Number(postID)
      }
    })

    await prisma.dislikes.create({
      data: {
        user_id: userID,
        post_id: Number(postID)
      }
    })

    return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro criar dislike." });
  }
});



interface GetActionsBody {
  postID: number;
}

posts.post("/actions", async (request, response) => {
  try {
    const { postID }: GetActionsBody = request.body;


    const likes = await prisma.$queryRawUnsafe(`
      SELECT post_id, user_id, "User".username, COALESCE("User".image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url  
      FROM likes 
      INNER JOIN "User" on "User".id = likes.user_id
      WHERE post_id = ${postID}
    `);

    const dislikes = await prisma.$queryRawUnsafe(`
      SELECT post_id, user_id, "User".username, COALESCE("User".image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url  
      FROM dislikes 
      INNER JOIN "User" on "User".id = dislikes.user_id
      WHERE post_id = ${postID}
    `);

    return response.json({ success: true, likes, dislikes });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao buscar likes e dislikes." });
  }
})


interface recentPostsParams {
  index: string;
}

posts.get("/recent/:index", async (request, response) => {
  try {
    const { index }: recentPostsParams = request.params;

    const posts = await prisma.$queryRawUnsafe(`
      SELECT 
      "Post".id, 
      "Post".fk_user_id,   
      "Post".content,
      "Post".images, 
      "Post".created_on,
      "User".username,
      "User".username, 
      COALESCE("User".image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url
    FROM "Post"
      INNER JOIN "User" ON "Post".fk_user_id = "User".id 
      ORDER BY "Post".id DESC
      OFFSET 5*${index} LIMIT 5    
    `);

    return response.json({ success: true, posts });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao buscar postagens recentes." });
  }
});


interface createPostBody {
  postContent: string;
  userID: string;
  createdOn: string;
}

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/images/posts'),
  filename: (request, file, callback) => {
    callback(null, uuid()+"."+file.mimetype.split("/")[1]);
  }
});

const upload = multer({ storage: storage }).array("picture");

posts.put("/create", upload, async (request, response) => {
  try {
    const { createdOn, postContent, userID } : createPostBody = JSON.parse(request.body.body);    
    let cloudinaryIds = ""
    const fileAmount: any = request.files;

    for (let c = 0; c < fileAmount.length; c++) {
      let result = await cloudinary.uploader.upload(fileAmount[c].path);

      if (c < fileAmount.length-1) {
        cloudinaryIds += result.public_id+",";
      } else {
        cloudinaryIds += result.public_id;
      }
    }
    
    if (createdOn && userID) {

      await prisma.$queryRawUnsafe(`
        INSERT INTO "Post" (content, fk_user_id, created_on, images)
        VALUES (
          '${postContent}',
          '${userID}',
          '${createdOn}',
          ${cloudinaryIds.length == 0 ? null : `'${cloudinaryIds}'`}
        );
      `);

      return response.json({ success: true });

    } else throw "Erro na criação do post";

  } catch(e) {
    console.log('----| Error |-----: ', e)
    return response.status(500).json({ error: true, message: "Erro ao criar post" });
  }
});


interface deletePostParams {
  currentUserId: string;
  fk_user_id: string;
  postID: string;
}

posts.delete("/:currentUserId/:fk_user_id/:postID", async (request, response) => {
  try {
    const { currentUserId, fk_user_id, postID }: deletePostParams = request.params;

    if (currentUserId === fk_user_id) {
      let images: any = await prisma.$queryRawUnsafe(`
        SELECT images FROM "Post"
        WHERE id = ${Number(postID)}
      `);
      
      // Delete actions
      await prisma.$queryRawUnsafe(`
        DELETE FROM likes 
        WHERE post_id = ${Number(postID)}
      `);

      await prisma.$queryRawUnsafe(`
        DELETE FROM dislikes 
        WHERE post_id = ${Number(postID)}
      `);    
      
      // delete post
      await prisma.$queryRawUnsafe(`
        DELETE FROM "Post" 
        WHERE id = ${Number(postID)}
      `);

      images = images[0]?.images?.split(",") || [];

      for (let c = 0; c < images.length; c++) {
        await cloudinary.uploader.destroy(images[c]);

        // Development mode
        // try {
        //   fsPromisses.unlink(path.join(__dirname, `../public/images/posts/${images[c]}`));
        // } catch(e) {
        //   console.log("File não existe")
        // }
      }

      return response.json({ success: true });

    } else {
      return response.status(500).json({ error: true, message: "Erro ao deletar post. Usuário sem permissão." });
    }

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao deletar post" });
  }
});


interface getCommentsParams {
  postID: string;
}

posts.get("/comments/:postID", async (request, response) => {
  try {
    const { postID }: getCommentsParams = request.params;

    const comments: any = await prisma.$queryRawUnsafe(`
      SELECT
      "User".id as "userID", 
      "Comment".id as "commentID", 
      username, 
      COALESCE("User".image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url, 
      "Comment".content,
      "Comment".created_on
      FROM "Comment" 
      INNER JOIN "User" ON "User".id = "Comment".fk_user_id
      WHERE fk_post_id = ${Number(postID)}
      ORDER BY "commentID" DESC
    `);


    return response.json({ success: true, comments });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao buscar comentários" });
  }
});


interface newCommentBody {
  content: string;
  userID: string;
  postID: number;
}

posts.put("/new-comment", async (request, response) => {
  try {
    const { content, postID, userID }: newCommentBody = request.body;

    let date: string | string[] = String(new Date()).split(" ");
    date = date[2] + "," + date[1] + "," + date[3] + "," + date[4];

    await prisma.$queryRawUnsafe(`
      INSERT INTO "Comment" (content, fk_user_id, fk_post_id, created_on)
      VALUES ('${content}', '${userID}', ${postID}, '${date}')
    `);

    return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao criar comentários." });
  }
});


export { posts };