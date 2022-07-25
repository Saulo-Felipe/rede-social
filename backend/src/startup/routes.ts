import { Express } from "express-serve-static-core";

import { posts } from "../routes/post";
import { user } from "../routes/user";
import { index } from "../routes/index";

export function useRoutes(app: Express) {
  app.use("/", index);
  app.use("/posts", posts);
  app.use("/user", user);
}