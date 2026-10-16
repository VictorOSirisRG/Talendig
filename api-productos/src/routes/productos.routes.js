import Router from "express";
import * as ctrl from "../controllers/productos.controller.js";
import {verificarToken} from "../middlwares/auth.js";

const router = Router();


//Publicas: cualquiera puede acceder a estas rutas
router.get('/', ctrl.listarProductos);
router.get('/:id', ctrl.obtenerProducto);


//Protegidas: solo usuarios autenticados pueden acceder a estas rutas
router.post('/', verificarToken, ctrl.crearProducto);
router.put('/:id', verificarToken, ctrl.actualizarProducto);
router.delete('/:id', verificarToken, ctrl.eliminarProducto);

export default router;