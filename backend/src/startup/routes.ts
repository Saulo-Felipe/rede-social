import { Express } from "express-serve-static-core";
import { post } from "../routes/post";

export function useRoutes(app: Express) {
  app.use("/posts", post);
}