import Router from "express";
import * as ctrl from "../controllers/productos.controller.js";

const router = Router();

router.get('/', ctrl.listarProductos);
router.get('/:id', ctrl.obtenerProducto);
router.post('/', ctrl.crearProducto);
router.put('/:id', ctrl.actualizarProducto);
router.delete('/:id', ctrl.eliminarProducto);

export default router;