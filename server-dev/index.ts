import { app } from "./app";
import { Server } from "http"
import { Socket } from "node:net";

const PORT:number = parseInt(process.env.SERVER_PORT as string);

const server:Server = app.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
})

const connections:Set<Socket> = new Set();

server.on("connection", (socket:Socket) => {
    connections.add(socket);
    //console.log(`Nova conexão aberta. Total agora: ${connections.size}`);

    socket.on('close', () => {
        connections.delete(socket);
        //console.log(`Conexão fechada. Total agora: ${connections.size}`);
    })
});

process.on("SIGINT", () => {
    console.log(`Finalizando servidor. Conexões TCP ativas: ${connections.size}`);

    server.close(() => {
        process.exit(0);
    })
})