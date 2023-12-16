"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoutes = void 0;
const post_1 = require("../routes/post");
const user_1 = require("../routes/user");
const index_1 = require("../routes/index");
const authentication_1 = require("../routes/authentication");
function useRoutes(app) {
    app.use("/", index_1.index);
    app.use("/posts", post_1.posts);
    app.use("/user", user_1.user);
    app.use("/auth", authentication_1.authentication);
}
exports.useRoutes = useRoutes;
