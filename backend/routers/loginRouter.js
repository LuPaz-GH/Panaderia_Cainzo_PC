import express, {Router} from "express";
import { login, loginInvitado } from "../controllers/loginController.js";

const router = express.Router();

router.post("/", login)
router.post("/invitado", loginInvitado)

export default router;