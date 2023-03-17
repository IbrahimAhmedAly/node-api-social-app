import Express from "express";

const router = Express.Router();
import { login, register, logout } from "../controllers/auth.js";

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
export default router;
