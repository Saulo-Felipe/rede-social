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
exports.index = void 0;
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const prismaClient_1 = require("../../prisma/prismaClient");
const index = (0, express_1.Router)();
exports.index = index;
index.get("/404", (request, response) => {
    return response.status(404).json({ error: true });
});
index.get("/test", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return response.json({ success: true });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "ErroR: " + e });
    }
}));
index.get("/search/:searchQuery", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchQuery } = request.params;
        console.log(searchQuery);
        const users = yield prismaClient_1.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                image_url: true
            },
            where: {
                username: {
                    contains: searchQuery,
                    mode: "insensitive"
                }
            }
        });
        return response.json({
            success: true,
            users: users.map(user => (Object.assign(Object.assign({}, user), { image_url: user.image_url || process.env.SERVER_URL + "/images/user/profile-user.png" })))
        });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro ao pesquisar usuários" });
    }
}));
index.get("/images/user/:image", (request, response) => {
    try {
        const { image } = request.params;
        return response.sendFile(path_1.default.join(__dirname, "../public/images/user/" + image));
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro. Arquivo inválido." });
    }
});
index.get("/images/post/:image", (request, response) => {
    try {
        const { image } = request.params;
        return response.sendFile(path_1.default.join(__dirname, "../public/images/posts/" + image));
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Erro. Arquivo inválido." });
    }
});
index.post("/all-messages", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { index } = request.body;
        const messagesLimitPerPage = 5;
        const messages = yield prismaClient_1.prisma.global_messages.findMany({
            skip: messagesLimitPerPage * index,
            take: messagesLimitPerPage,
            orderBy: {
                id: "desc"
            }
        });
        return response.json({ success: true, messages });
    }
    catch (e) {
        console.log('----| Error |-----: ', e);
        return response.status(500).json({ error: true, message: "Eror ao buscar mensagens." });
    }
}));
