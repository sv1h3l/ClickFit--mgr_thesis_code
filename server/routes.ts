import { Router } from "express";
import { registerUser } from "./controlers/registerController";

const router = Router();

router.post("/register", registerUser);

export default router;
