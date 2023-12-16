"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.posts = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const authorization_1 = require("../utils/authorization");
const cloudinary_1 = require("../utils/cloudinary");
const prismaClient_1 = require("../../prisma/prismaClient");
const posts = (0, express_1.Router)();
exports.posts = posts;
posts.use(authorization_1.verifyToken);
posts.delete("/like/:userID/:postID", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID, userID } = request.params;
        yield prismaClient_1.prisma.likes.deleteMany({
            where: {
                user_id: userID,
                post_id: Number(postID)
            }
        });
        return response.json({ success: true });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao deletar like." });
    }
}));
posts.put("/like/:userID/:postID", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID, userID } = request.params;
        yield prismaClient_1.prisma.dislikes.deleteMany({
            where: {
                user_id: userID,
                post_id: Number(postID)
            }
        });
        yield prismaClient_1.prisma.likes.create({
            data: {
                user_id: userID,
                post_id: Number(postID)
            }
        });
        return response.json({ success: true });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao criar like." });
    }
}));
posts.delete("/dislike/:userID/:postID", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID, userID } = request.params;
        yield prismaClient_1.prisma.dislikes.deleteMany({
            where: {
                user_id: userID,
                post_id: Number(postID)
            }
        });
        return response.json({ success: true });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro deletar dislike." });
    }
}));
posts.put("/dislike/:userID/:postID", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID, userID } = request.params;
        yield prismaClient_1.prisma.likes.deleteMany({
            where: {
                user_id: userID,
                post_id: Number(postID)
            }
        });
        yield prismaClient_1.prisma.dislikes.create({
            data: {
                user_id: userID,
                post_id: Number(postID)
            }
        });
        return response.json({ success: true });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro criar dislike." });
    }
}));
posts.post("/actions", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID } = request.body;
        const likes = yield prismaClient_1.prisma.$queryRawUnsafe(`
      SELECT post_id, user_id, "User".username, COALESCE("User".image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url  
      FROM likes 
      INNER JOIN "User" on "User".id = likes.user_id
      WHERE post_id = ${postID}
    `);
        const dislikes = yield prismaClient_1.prisma.$queryRawUnsafe(`
      SELECT post_id, user_id, "User".username, COALESCE("User".image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url  
      FROM dislikes 
      INNER JOIN "User" on "User".id = dislikes.user_id
      WHERE post_id = ${postID}
    `);
        return response.json({ success: true, likes, dislikes });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao buscar likes e dislikes." });
    }
}));
posts.get("/recent/:index", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { index } = request.params;
        const posts = yield prismaClient_1.prisma.$queryRawUnsafe(`
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
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao buscar postagens recentes." });
    }
}));
const storage = multer_1.default.diskStorage({
    destination: path_1.default.join(__dirname, '../public/images/posts'),
    filename: (request, file, callback) => {
        callback(null, (0, uuid_1.v4)() + "." + file.mimetype.split("/")[1]);
    }
});
const upload = (0, multer_1.default)({ storage: storage }).array("picture");
posts.put("/create", upload, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { createdOn, postContent, userID } = JSON.parse(request.body.body);
        let cloudinaryIds = "";
        const fileAmount = request.files;
        for (let c = 0; c < fileAmount.length; c++) {
            let result = yield cloudinary_1.cloudinary.uploader.upload(fileAmount[c].path);
            if (c < fileAmount.length - 1) {
                cloudinaryIds += result.public_id + ",";
            }
            else {
                cloudinaryIds += result.public_id;
            }
        }
        if (createdOn && userID) {
            yield prismaClient_1.prisma.$queryRawUnsafe(`
        INSERT INTO "Post" (content, fk_user_id, created_on, images)
        VALUES (
          '${postContent}',
          '${userID}',
          '${createdOn}',
          ${cloudinaryIds.length == 0 ? null : `'${cloudinaryIds}'`}
        );
      `);
            return response.json({ success: true });
        }
        else
            throw "Erro na criação do post";
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao criar post" });
    }
}));
posts.delete("/:currentUserId/:fk_user_id/:postID", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { currentUserId, fk_user_id, postID } = request.params;
        if (currentUserId === fk_user_id) {
            let images = yield prismaClient_1.prisma.$queryRawUnsafe(`
        SELECT images FROM "Post"
        WHERE id = ${Number(postID)}
      `);
            // Delete actions
            yield prismaClient_1.prisma.$queryRawUnsafe(`
        DELETE FROM likes 
        WHERE post_id = ${Number(postID)}
      `);
            yield prismaClient_1.prisma.$queryRawUnsafe(`
        DELETE FROM dislikes 
        WHERE post_id = ${Number(postID)}
      `);
            // delete post
            yield prismaClient_1.prisma.$queryRawUnsafe(`
        DELETE FROM "Post" 
        WHERE id = ${Number(postID)}
      `);
            images = ((_b = (_a = images[0]) === null || _a === void 0 ? void 0 : _a.images) === null || _b === void 0 ? void 0 : _b.split(",")) || [];
            for (let c = 0; c < images.length; c++) {
                yield cloudinary_1.cloudinary.uploader.destroy(images[c]);
                // Development mode
                // try {
                //   fsPromisses.unlink(path.join(__dirname, `../public/images/posts/${images[c]}`));
                // } catch(e) {
                //   console.log("File não existe")
                // }
            }
            return response.json({ success: true });
        }
        else {
            return response.status(500).json({ error: true, message: "Erro ao deletar post. Usuário sem permissão." });
        }
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao deletar post" });
    }
}));
posts.get("/comments/:postID", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID } = request.params;
        const comments = yield prismaClient_1.prisma.$queryRawUnsafe(`
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
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao buscar comentários" });
    }
}));
posts.put("/new-comment", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, postID, userID } = request.body;
        let date = String(new Date()).split(" ");
        date = date[2] + "," + date[1] + "," + date[3] + "," + date[4];
        yield prismaClient_1.prisma.$queryRawUnsafe(`
      INSERT INTO "Comment" (content, fk_user_id, fk_post_id, created_on)
      VALUES ('${content}', '${userID}', ${postID}, '${date}')
    `);
        return response.json({ success: true });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao criar comentários." });
    }
}));
