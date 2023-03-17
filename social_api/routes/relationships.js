import Express from "express";

const router = Express.Router();
import {
  getRelationships,
  addRelationship,
  deleteRelationship,
} from "../controllers/realationship.js";

router.get("/", getRelationships);
router.post("/", addRelationship);
router.delete("/", deleteRelationship);
export default router;
