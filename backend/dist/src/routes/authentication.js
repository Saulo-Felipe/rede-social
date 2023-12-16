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
exports.authentication = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const express_1 = require("express");
const date_1 = require("../utils/date");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorization_1 = require("../utils/authorization");
const prismaClient_1 = require("../../prisma/prismaClient");
const authentication = (0, express_1.Router)();
exports.authentication = authentication;
authentication.get("/verify-token", authorization_1.verifyToken, (request, response) => {
    return response.json({ success: true });
});
authentication.put("/register/email", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password, passwordConfirm } = request.body;
        if (password === passwordConfirm) {
            const user = yield prismaClient_1.prisma.user.findFirst({
                select: {
                    id: true,
                },
                where: {
                    email: email
                }
            });
            if (user === null) {
                const id = (0, uuid_1.v4)();
                const createdOn = (0, date_1.getCurrentDate)();
                bcrypt_1.default.genSalt(5, (err, salt) => {
                    bcrypt_1.default.hash(password, salt, (error, hash) => __awaiter(void 0, void 0, void 0, function* () {
                        yield prismaClient_1.prisma.user.create({
                            data: {
                                id,
                                username: name,
                                email,
                                image_url: null,
                                password: hash,
                                auth_type: "Email",
                                created_on: createdOn
                            }
                        });
                    }));
                });
                // Automatic login
                const token = jsonwebtoken_1.default.sign({ email: email }, String(process.env.SECRET), {
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
                        picture: process.env.SERVER_URL + "/images/user/profile-user.png"
                    }
                });
            }
            else
                return response.json({ success: true, message: "Este email já está em uso" });
        }
        else
            return response.json({ success: true, message: "Senhas inválidas." });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao criar usuário." });
    }
}));
authentication.post("/signin/:authType", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, id, image_url, name, bio } = request.body;
        const { authType } = request.params; // Google or Github
        const user = yield prismaClient_1.prisma.user.findFirst({
            where: {
                email: email
            }
        });
        const currentDate = (user === null || user === void 0 ? void 0 : user.created_on) || (0, date_1.getCurrentDate)();
        if (user === null) { //create user automatically if not exists
            yield prismaClient_1.prisma.user.create({
                data: {
                    id,
                    username: name,
                    email,
                    image_url,
                    auth_type: authType,
                    created_on: currentDate,
                    bio: bio
                }
            });
        }
        // login
        const token = jsonwebtoken_1.default.sign({ email: email }, String(process.env.SECRET), {
            expiresIn: "1d"
        });
        return response.json({
            success: true,
            token: token,
            message: "Login realizado com sucesso!",
            user: {
                id: (user === null || user === void 0 ? void 0 : user.id) || id,
                username: (user === null || user === void 0 ? void 0 : user.username) || name,
                email,
                picture: (user === null || user === void 0 ? void 0 : user.image_url) || image_url,
                createdOn: currentDate,
            }
        });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao criar usuário." });
    }
}));
authentication.post("/login", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = request.body;
        const user = yield prismaClient_1.prisma.user.findFirst({
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
        const isEqual = bcrypt_1.default.compareSync(password, user.password);
        if (isEqual) {
            const token = jsonwebtoken_1.default.sign({ email }, String(process.env.SECRET), {
                expiresIn: "1d"
            });
            return response.json({
                success: true,
                user: {
                    id: user.id,
                    name: user.username,
                    email,
                    picture: user.image_url || process.env.SERVER_URL + "/images/user/profile-user.png",
                    createdOn: user.created_on
                },
                token
            });
        }
        return response.json({ success: true, message: "Senha incorreta" });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao autenticar usuário." });
    }
}));
authentication.post("/recover-user-information", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = request.header("app-token") || "";
        if (token) {
            const { email } = jsonwebtoken_1.default.verify(token, String(process.env.SECRET));
            if (email) {
                const user = yield prismaClient_1.prisma.user.findFirst({
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
                    user: Object.assign(Object.assign({}, user), { name: user === null || user === void 0 ? void 0 : user.username, picture: (user === null || user === void 0 ? void 0 : user.image_url) || process.env.SERVER_URL + "/images/user/profile-user.png", createdOn: user === null || user === void 0 ? void 0 : user.created_on })
                });
            }
            return response.json({ message: "Usuário sem autenticação", user: null });
        }
        return response.json({ message: "Usuário sem autenticação", user: null });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao selecionar usuário." });
    }
}));
