import Express from "express";

const router = Express.Router();
import { getComments, addComment } from "../controllers/comment.js";

router.get("/", getComments);
router.post("/", addComment);
export default router;
