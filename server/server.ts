import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2";
import { WebSocket, WebSocketServer } from "ws";
import { changeUnreadMessagesMod } from "./models/change/changeUnreadMessagesMod";
import routes from "./routes";

dotenv.config();

// Připojení k databázi
const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

db.getConnection((err, connection) => {
	if (err) {
		console.error("Chyba připojení k databázi:", err);
	} else {
		console.log("Připojeno k databázi");
		connection.release();
	}
});

// Nastavení Express serveru
const app = express();
const host = process.env.SERVER_HOST || "10.0.0.99";
const port = parseInt(process.env.SERVER_PORT || "5000", 10);

app.use(
	cors({
		origin: true, // nebo odpovídající front-end doména
		credentials: true,
	})
);
app.use(bodyParser.json());
app.use("/api", routes);

const server = app.listen(port, host, () => {
	console.log(`Server běží na http://${host}:${port}`);
});

// Typ rozšířeného WebSocketu
interface ExtendedWebSocket extends WebSocket {
	connectionId?: number;
	userId?: number;
}

const clients: ExtendedWebSocket[] = [];

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: ExtendedWebSocket) => {
	clients.push(ws);

	ws.on("message", (raw) => {
		try {
			const data = JSON.parse(raw.toString());

			switch (data.type) {
				case "joinChat":
					ws.connectionId = data.chatId;
					ws.userId = data.userId; // ← přidat tohle!
					break;

				case "sendMessage":
					const msg = data.message;

					// Uložení zprávy do DB
					db.query(
						`INSERT INTO chats (connection_id, user_id, message, created_at)
							 VALUES (?, ?, ?, NOW())`,
						[msg.chatId, msg.userId, msg.message],
						(err, result) => {
							if (err) {
								console.error("Chyba při ukládání zprávy:", err);
								return;
							}

							const resultSet = result as mysql.ResultSetHeader;
							const savedMessage = {
								messageId: resultSet.insertId,
								chatId: msg.chatId,
								userId: msg.userId,
								message: msg.message,
								createdAt: new Date().toISOString(),
							};

							// Získání dat o connection
							db.query(`SELECT first_user_id, second_user_id FROM connections WHERE connection_id = ?`, [msg.chatId], (err, results) => {
								if (err) {
									console.error("Chyba při získávání uživatelů:", err);
									return;
								}

								const rows = results as mysql.RowDataPacket[];
								if (rows.length === 0) return;

								const connection = rows[0] as {
									first_user_id: number;
									second_user_id: number;
								};

								// Určení příjemce
								const receiverId = msg.userId === connection.first_user_id ? connection.second_user_id : connection.first_user_id;

								// Zjisti, jestli je příjemce právě v chatu
								const isReceiverInSameChat = clients.some((client) => client.readyState === WebSocket.OPEN && client.connectionId === msg.chatId && client.userId === receiverId);

								if (!isReceiverInSameChat) {
									const column = receiverId === connection.first_user_id ? "first_user_unread_messages" : "second_user_unread_messages";

									db.query(`UPDATE connections SET ${column} = ${column} + 1 WHERE connection_id = ?`, [msg.chatId], (err) => {
										if (err) {
											console.error("Chyba při aktualizaci počtu nepřečtených zpráv:", err);
										}
									});
								}

								// Rozeslání zprávy klientům ve stejném chatu
								clients.forEach((client) => {
									if (client.readyState === WebSocket.OPEN && client.connectionId === msg.chatId) {
										client.send(
											JSON.stringify({
												type: "receiveMessage",
												message: savedMessage,
											})
										);
									}
								});
							});
						}
					);
					break;

				default:
					console.warn("Neznámý typ zprávy:", data.type);
			}
		} catch (err) {
			console.error("Chyba při zpracování zprávy:", err);
		}
	});

	ws.on("close", () => {
		const index = clients.indexOf(ws);
		if (index !== -1) {
			const userId = ws.userId;
			const connectionId = ws.connectionId;

			clients.splice(index, 1);

			if (userId !== undefined && connectionId !== undefined) {
				changeUnreadMessagesMod({ userId, connectionId }).catch((err) => {
					console.error("Nastala chyba během označení zpráv jako přečtené");
				});
			}
		}
	});
});

export { db };

