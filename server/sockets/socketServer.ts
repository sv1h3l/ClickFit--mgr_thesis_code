import { createServer } from "http";
import { Server } from "socket.io";

export const initSocketServer = () => {
	const httpServer = createServer();
	const io = new Server(httpServer, {
		cors: {
			origin: "*", // nebo specifikujte konkrétní doménu, např. "http://localhost:3000"
			methods: ["GET", "POST"],
			allowedHeaders: ["my-custom-header"],
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		console.log("User connected:", socket.id);
		// Your socket event handlers here
	});

	return io;
};
