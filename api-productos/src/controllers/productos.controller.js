import {pool} from '../db/sqlserver.js';

//get /api/productos
export async function listarProductos(req, res) {
        const result = await pool.request().query('SELECT * FROM productos');
        res.json(result.recordset);
    }

//get /api/productos/:id
export async function obtenerProducto(req, res) {
    const  r = await pool.request()
        .input('id', req.params.id)
        .query('SELECT * FROM productos WHERE id = @id');
    if(!r.recordset[0]) {
        res.status(404).json({msg: 'Producto no encontrado'});
        return;
    }
     res.json(r.recordset[0]);

}

//Post /api/productos
export async function crearProducto(req, res) {
    const{nombre,precio,stock=0} = req.body;
    if(!nombre || precio == undefined) {
       return  res.status(400).json({msg: 'Faltan datos'});        
    }

    const r = await pool.request()
        .input('nombre', nombre)
        .input('precio', precio)
        .input('stock', stock)
        .query('INSERT INTO productos (nombre, precio, stock) output INSERTED.* VALUES (@nombre, @precio, @stock)');
    res.status(201).json(r.recordset[0]);
}


//put/api/productos/:id
export async function actualizarProducto(req, res) {
    const {nombre, precio, stock} = req.body;
    const r = await pool.request()
        .input('id', req.params.id)
        .input('nombre', nombre)
        .input('precio', precio)
        .input('stock', stock)
        .query('UPDATE productos SET nombre = @nombre, precio = @precio, stock = @stock output INSERTED.* WHERE id = @id');
    if(!r.recordset[0]) {
        res.status(404).json({msg: 'Producto no encontrado'});
        return;
    }
    res.json(r.recordset[0]);
}

//dELETE /api/productos/:id
export async function eliminarProducto(req, res) {
    const r = await pool.request()
        .input('id', req.params.id)
        .query('DELETE FROM productos WHERE id = @id');
    if(!r.rowsAffected[0]) {
        res.status(404).json({msg: 'Producto no encontrado'});
        return;
    }
    res.status(204).end();
}
