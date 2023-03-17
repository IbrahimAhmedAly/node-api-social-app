import Express from "express";

const router = Express.Router();
import { getUser, updateUser, getSuggestedUsers } from "../controllers/user.js";

router.get("/find/:userId", getUser);
router.get("/suggestedUsers", getSuggestedUsers);
router.put("/", updateUser);
export default router;
