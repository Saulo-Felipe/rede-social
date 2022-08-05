import { response, Router } from "express";
import { sequelize } from "../services/databse";
import { axiosServer } from "../services/api";
import { v4 as uuid } from "uuid";
import fsPromisses from "fs/promises";

import multer from "multer";
import path from "path";
import { verifyToken } from "../utils/authorization";

const posts = Router();

posts.use(verifyToken);


interface recentPostsParams {
  index: string;
}

posts.get("/recent/:index", async (request, response) => {
  try {
    const { index }: recentPostsParams = request.params;

    const [posts] = await sequelize.query(`
      SELECT "Post".id, "Post".images, content, fk_user_id, likes_amount, dislikes_amount, username, image_url, "Post".created_on FROM "Post"
      INNER JOIN "User" ON "User".id = "Post".fk_user_id
      ORDER BY "Post".id DESC
      OFFSET 5*${Number(index)} LIMIT 5;
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
  destination: path.join(__dirname, '../images'),
  filename: (request, file, callback) => {
    callback(null, uuid()+"."+file.mimetype.split("/")[1]);
  }
});

const upload = multer({ storage: storage }).array("picture");

posts.put("/create", upload, async (request, response) => {
  try {
    const { createdOn, postContent, userID } : createPostBody = JSON.parse(request.body.body);    
    let databaseImagesName = "";
    const fileAmount: any = request.files;

    for (let c = 0; c < fileAmount.length; c++) {
      if (c < fileAmount.length-1) {
        databaseImagesName += fileAmount[c].filename+",";
      } else {
        databaseImagesName += fileAmount[c].filename;
      }
    }
    
    if (createdOn && userID) {

      await sequelize.query(`
        INSERT INTO "Post" (content, fk_user_id, created_on, images)
        VALUES (
          '${postContent}',
          '${userID}',
          '${createdOn}',
          ${databaseImagesName.length == 0 ? null : `'${databaseImagesName}'`}
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
      let [images]: any = await sequelize.query(`
        SELECT images FROM "Post"
        WHERE id = ${Number(postID)}
      `);
      
      await sequelize.query(`
        DELETE FROM "LikeAndDislike" 
        WHERE fk_post_id = ${Number(postID)} 
      `);
  
      await sequelize.query(`
        DELETE FROM "Post" 
        WHERE id = ${Number(postID)}
      `);

      images = images[0]?.images?.split(",") || [];

      for (let c = 0; c < images.length; c++) {
        fsPromisses.unlink((path.join(__dirname, `../images/${images[c]}`)));
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



interface getPostsFromUser {
  userID: string;
}

posts.get("/get-by-user/:userID", async (request, response) => {
  try {
    const { userID }: getPostsFromUser = request.params;

    console.log("type: ", typeof userID);

    const [posts] = await sequelize.query(`
      SELECT content, fk_user_id, likes_amount, dislikes_amount, username, image_url, "Post".created_on, "Post".id FROM "Post"
      INNER JOIN "User" ON "User".id = "Post".fk_user_id
      WHERE "Post".fk_user_id = '${userID}'
      ORDER BY "Post".id DESC;
    `);

    return response.json({ success: true, posts });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao buscar posts de usuário" });
  }
});


interface userLikedPostParams {
  postID: string;
  userID: string;
}

posts.get("/user-liked-post/:postID/:userID", async (request, response) => {
  try {
    const { postID, userID }: userLikedPostParams = request.params;

    const [result]: any = await sequelize.query(`
      SELECT type FROM "LikeAndDislike"
      WHERE fk_user_id = '${userID}' and fk_post_id = ${Number(postID)}
    `);

    if (result.length == 0)
      return response.json({ success: true, type: "noAction" });

    return response.json({ success: true, type: result[0].type == 0 ? "like" : "dislike" });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao verificar ação." });
  }
});


interface deleteActionBody {
  userID: string;
  postID: number;
  action: string | boolean;
}

posts.post("/delete-action", async (request, response) => {
  try {
    let {action, postID, userID}: deleteActionBody = request.body;

    //Delete from table like and dislike
    await sequelize.query(`
      DELETE FROM "LikeAndDislike"
      WHERE fk_user_id = '${userID}'
      AND fk_post_id = ${postID}
    `);

    // Update count from post table
    action = action == "like" ? "likes_amount" : "dislikes_amount";

    await sequelize.query(`
      UPDATE "Post"
      SET ${action} = ((SELECT ${action} FROM "Post" WHERE id = ${postID}) - 1)
      WHERE id = ${postID}
    `);

    return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao deletar ação." });
  }
});


interface newActionBody {
  userID: string;
  postID: number;
  action: string;
  deleteOthers: boolean;
}

posts.put("/new-action", async (request, response) => {
  try {
    let { action, deleteOthers, postID, userID }: newActionBody = request.body;
    
    if (deleteOthers) {
      await axiosServer.post("/posts/delete-action", {
        action: action == "Like" ? "dislike" : "like",
        postID,
        userID
      });
    }

    await sequelize.query(`
      INSERT INTO "LikeAndDislike" (fk_user_id, fk_post_id, type)
      VALUES (
        '${userID}',
        ${postID},
        ${action == "Like" ? 0 : 1}
      );
    `);
    
    action = action == "Like" ? "likes_amount" : "dislikes_amount";

    await sequelize.query(`
      UPDATE "Post"
      SET ${action} = ((select ${action} from "Post" where id = ${postID}) + 1)
      WHERE id = ${postID}
    `);
    
    return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao dar like ou dislike" });
  }
});


interface getCommentsParams {
  postID: string;
}

posts.get("/comments/:postID", async (request, response) => {
  try {
    const { postID }: getCommentsParams = request.params;

    const [comments]: any = await sequelize.query(`
      SELECT
      "User".id as "userID", 
      "Comment".id as "commentID", 
      username, 
      image_url, 
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

    await sequelize.query(`
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