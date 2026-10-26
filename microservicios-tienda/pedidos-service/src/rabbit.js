import amqp from 'amqplib';
import { reintentar } from './reintentar.js';

const EXCHANGE = 'tienda';
let canal;

export async function conectarRabbit(url){
    const conexion= await reintentar('conectar a RabbitMQ',()=>amqp.connect(url));
    canal= await conexion.createChannel();
    await canal.assertExchange(EXCHANGE,'topic');
    console.log('Conectado a RabbitMQ');

}


export function publicar(evento,datos){
    const cuerpo = Buffer.from(JSON.stringify(datos));
    canal.publish(EXCHANGE,evento,cuerpo);
    console.log("Publicado:",evento,datos);
}

export async function subscribir(cola,evento,manejador){
    await canal.assertQueue(cola);
    await canal.bindQueue(cola,EXCHANGE,evento);
    canal.consume(cola,async(msg)=>{
        const datos = JSON.parse(msg.content.toString());
        console.log("Recibido:",evento,datos);
        try{
            await manejador(datos);
            canal.ack(msg);
        }catch(err){
            console.log(err);
            canal.nack(msg,false,false);
        }
    })
}