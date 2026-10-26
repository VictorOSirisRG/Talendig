import express from 'express';
import mongoose from 'mongoose';
import{Pedido}from './pedido.model.js'
import { conectarRabbit,publicar,subscribir } from '../src/rabbit.js';

const app = express();

app.use(express.json());


//Guarda el pedido

app.post('/pedidos',async(req,res)=>{
    const {productoId,cantidad} = req.body;
    const pedido = await Pedido.create(
        {productoId,cantidad});
        publicar("pedido.creado",{
            pedidoId:pedido.id,productoId,cantidad,
        });
        res.status(201).json(pedido);
});



app.get("/pedidos",async(req,res)=>{
    res.json(await Pedido.find().sort({createdAt:-1}))
})

await mongoose.connect(process.env.MONGO_URI)
await conectarRabbit(process.env.RABBIT_URL)

await subscribir('pedidos.confirmados','pedido.confirmado',
    ({pedidoId}) => Pedido.findByIdAndUpdate(pedidoId,
        {
            estado:"confirmado"
        }
    )
);


await subscribir('pedidos.rechazado','pedido.rechazado',
    ({pedidoId}) => Pedido.findByIdAndUpdate(pedidoId,
        {  estado:"rechazado" }
    )
);

app.listen(process.env.PORT);
console.log(`pedidos-service en ${process.env.PORT}`);

