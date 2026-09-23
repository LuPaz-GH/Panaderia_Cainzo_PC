import express, {Router} from "express";
import { login } from "../controllers/loginController.js";

const router = express.Router();

router.post("/", login)

export default router;