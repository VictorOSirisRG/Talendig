import {Router} from "express";
import * as ctrl from "../controllers/resenas.controller.js";

const router = Router();

router.get('/', ctrl.listarResenas);
router.post('/', ctrl.crearResena);

export default router;