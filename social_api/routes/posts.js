import Express from "express";

const router = Express.Router();
import { getPosts, addPost, deletePost } from "../controllers/post.js";

router.get("/", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;
