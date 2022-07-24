import { Express } from "express-serve-static-core";
import { posts } from "../routes/post";
import { user } from "../routes/user";

export function useRoutes(app: Express) {
  app.use("/posts", posts);
  app.use("/user", user);
}