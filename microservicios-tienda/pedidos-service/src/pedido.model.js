import mongoose from 'mongoose';

const pedidosSchema = new mongoose.Schema({
    productoId:{type:Number,require:true},
    cantidad:{type:Number,require:true,min:1},
    estado:{
        type:String,
        enum:["pendiente","confirmado","rechazado"],
        default:"pendiente"
    },
    motivo:String,
},{timestamp:true});

export const Pedido = mongoose.model("Pedido",pedidosSchema);