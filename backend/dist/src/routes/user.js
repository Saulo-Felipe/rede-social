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
exports.user = void 0;
const express_1 = require("express");
const authorization_1 = require("../utils/authorization");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = require("../utils/cloudinary");
const prismaClient_1 = require("../../prisma/prismaClient");
const user = (0, express_1.Router)();
exports.user = user;
user.use(authorization_1.verifyToken);
user.get("/profile/:userID/:currentUserID", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentUserID, userID } = request.params;
        let user = yield prismaClient_1.prisma.$queryRawUnsafe(`
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
            const following = yield prismaClient_1.prisma.$queryRawUnsafe(`
        select count(*) as following from "Follower"
        where fk_user_id = '${user.id}';
      `);
            const followers = yield prismaClient_1.prisma.$queryRawUnsafe(`
        select count(*) as followers from "Follower"
        where fk_follower_id = '${user.id}';
      `);
            user.following = parseInt(following[0].following);
            user.followers = parseInt(followers[0].followers);
            // Is follower?
            const isFollowing = yield prismaClient_1.prisma.$queryRawUnsafe(`
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
        }
        else
            return response.json({ success: true, userExists: false });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao buscar profile." });
    }
}));
user.get("/posts/:userID", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = request.params;
        const posts = yield prismaClient_1.prisma.$queryRawUnsafe(`
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
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao selecionar posts do usuário." });
    }
}));
user.put("/new-follow", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, followerID } = request.body;
        yield prismaClient_1.prisma.$queryRawUnsafe(`
      INSERT INTO "Follower" (fk_user_id, fk_follower_id)
      VALUES ('${userID}', '${followerID}')
    `);
        return response.json({ success: true });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao seguir o usuário." });
    }
}));
user.delete("/unfollow/:userID/:followerID", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, followerID } = request.params;
        yield prismaClient_1.prisma.$queryRawUnsafe(`
			DELETE FROM "Follower"
			WHERE fk_user_id = '${userID}'
			AND fk_follower_id = '${followerID}'
		`);
        return response.json({ success: true });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao parar de seguir usuário." });
    }
}));
user.get("/all", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield prismaClient_1.prisma.$queryRawUnsafe(`
      SELECT id, username, COALESCE(image_url, '${process.env.SERVER_URL}/images/user/profile-user.png') as image_url FROM "User"
    `);
        return response.json({ success: true, users });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao buscar usuários." });
    }
}));
user.get("/current", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = request.header("app-token") || "";
        jsonwebtoken_1.default.verify(token, String(process.env.SECRET), (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (decoded) {
                const [user] = yield prismaClient_1.prisma.$queryRawUnsafe(`
          SELECT id FROM "User"
          WHERE email = '${decoded.email}'
        `);
                return response.json({ user: user });
            }
            else {
                return response.json({ logout: true });
            }
        }));
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao buscar usuário." });
    }
}));
const storage = multer_1.default.diskStorage({
    destination: path_1.default.join(__dirname, '../public/images/user'),
    filename: (request, file, callback) => {
        callback(null, (0, uuid_1.v4)() + "." + file.mimetype.split("/")[1]);
    }
});
const upload = (0, multer_1.default)({ storage: storage }).array("picture");
user.post("/update-info", upload, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = request.header("current-user-email");
        const { bio, cover_color, id, name, picture, currentPassword, newPassword } = JSON.parse(request.body.body);
        const file = request.files;
        let user = yield prismaClient_1.prisma.$queryRawUnsafe(`
      SELECT cloudinary_id, password FROM "User" WHERE email = '${email}'
    `);
        if (picture && user[0].cloudinary_id) {
            yield cloudinary_1.cloudinary.uploader.destroy(user[0].cloudinary_id);
        }
        if (currentPassword === '' && newPassword === '') {
            let cloudinaryId = picture ? yield cloudinary_1.cloudinary.uploader.upload(file[0].path) : "";
            yield prismaClient_1.prisma.$queryRawUnsafe(`
        UPDATE "User"
        SET bio = '${bio}',
        cover_color = '${cover_color}',
        username = '${name}'
        ${picture ? `, image_url = '${cloudinaryId.secure_url}'` : ""}
        ${picture ? `, cloudinary_id = '${cloudinaryId.public_id}'` : ""}
        WHERE email = '${email}' AND id = '${id}'
      `);
            return response.json({ success: true });
        }
        else { // change password
            if (user.length > 0) {
                const match = user[0].password ? yield bcrypt_1.default.compare(currentPassword, user[0].password) : true;
                if (match) {
                    let cloudinaryId = picture ? yield cloudinary_1.cloudinary.uploader.upload(file[0].path) : "";
                    const salt = yield bcrypt_1.default.genSalt(5);
                    const hash = yield bcrypt_1.default.hash(newPassword, salt);
                    yield prismaClient_1.prisma.$queryRawUnsafe(`
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
                }
                else { // incorrect password
                    return response.json({ failed: true, message: "Senha incorreta." });
                }
            }
            else { // Erro de permissão
                return response.json({ failed: true, message: "Permission denied." });
            }
        }
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao atualizar dados." });
    }
}));
