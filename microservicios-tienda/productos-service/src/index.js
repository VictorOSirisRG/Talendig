import express from 'express';
import { iniciarDb, pool } from './db.js';
import { conectarRabbit, publicar, subscribir }
  from '../src/rabbit.js';

const app = express();
app.get('/productos', async (req, res) => {
  const r = await pool.query('SELECT * FROM productos');
  res.json(r.recordset);
});

// Descuenta stock solo si alcanza (en una sola consulta)
async function reservarStock(pedido) {
  const r = await pool.request()
    .input('id', pedido.productoId)
    .input('cantidad', pedido.cantidad)
    .query(`UPDATE productos SET stock = stock - @cantidad
            OUTPUT INSERTED.stock
            WHERE id = @id AND stock >= @cantidad`);
  if (r.recordset.length > 0) {
    publicar('pedido.confirmado',
      { pedidoId: pedido.pedidoId });
  } else {
    publicar('pedido.rechazado', {
      pedidoId: pedido.pedidoId,
      motivo: 'Stock insuficiente o producto inexistente',
    });
  }
}

await iniciarDb();
await conectarRabbit(process.env.RABBIT_URL);
await subscribir('productos.pedidos', 'pedido.creado',
  reservarStock);

app.listen(process.env.PORT);
console.log(`productos-service en ${process.env.PORT}`);