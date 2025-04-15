import { Server, Socket } from "socket.io";
import { db } from "../../server";

export const chatHandler = (io: Server, socket: Socket) => {
	console.log("Uživatel se připojil:", socket.id);

	socket.on("joinChat", (chatId: number) => {
		socket.join(`chat_${chatId}`);
		console.log(`Uživatel ${socket.id} se připojil do chat roomu chat_${chatId}`);
	});

	socket.on("sendMessage", async (data: { chatId: number; senderId: number; message: string }) => {
		const { chatId, senderId, message } = data;
		try {
			const [result] = await db.promise().query(`INSERT INTO chat_messages (chat_id, sender_id, message, created_at) VALUES (?, ?, ?, NOW())`, [chatId, senderId, message]);

			const messageData = {
				messageId: (result as any).insertId,
				chatId,
				senderId,
				message,
				createdAt: new Date(),
			};

			io.to(`chat_${chatId}`).emit("receiveMessage", messageData);
		} catch (err) {
			console.error("Chyba při ukládání zprávy:", err);
		}
	});

	socket.on("disconnect", () => {
		console.log("Uživatel se odpojil:", socket.id);
	});
};
