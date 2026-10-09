import express from "express";
import cors from "cors";
import productos from "./routes/productos.routes.js";
import resenas from "./routes/resenas.routes.js";
import {errores} from "./middlwares/errores.js";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/salud",(req,res)=>{
    res.json({ok:true, message:"API de productos funcionando correctamente"})
});

app.use('/api/productos',productos);
app.use('/api/resenas',resenas);
app.use(errores);

await mongoose.connect(process.env.MONGO_URI);
app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});

const Port = process.env.PORT || 3000;
app.listen(Port, () => {
    console.log(`Servidor escuchando en el puerto ${Port}`);
});

