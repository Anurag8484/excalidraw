import { Router } from "express";
import { gate } from "../../middleware";

const roomRouter = Router();


roomRouter.post("/create-room", gate, async (req, res) => {});