"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(request, response, next) {
    const token = request.header("app-token") || "";
    if (token && typeof token !== "undefined" && token !== null) {
        jsonwebtoken_1.default.verify(token, String(process.env.SECRET), (err, decoded) => {
            if (decoded) {
                request.headers["current-user-email"] = decoded.email;
                next();
            }
            else
                response.status(500).json({ logout: true });
        });
    }
    else
        response.status(500).json({ logout: true });
}
exports.verifyToken = verifyToken;
