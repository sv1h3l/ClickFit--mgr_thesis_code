import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2";
import { WebSocket, WebSocketServer } from "ws";
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
const port = process.env.SERVER_PORT || 5000;

app.get("/", (req, res) => {
	res.send("Hello, world!");
});

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(bodyParser.json());
app.use("/api", routes);

// HTTP server
const server = app.listen(port, () => {
	console.log(`Server běží na portu ${port}`);
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
	console.log("Nový WebSocket klient");
	clients.push(ws);

	ws.on("message", (raw) => {
		try {
			const data = JSON.parse(raw.toString());

			switch (data.type) {
				case "joinChat":
					ws.connectionId = data.chatId;
					console.log(`Klient se připojil k chatu ${ws.connectionId}`);
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

							// Oprava: přetypování na ResultSetHeader pro získání insertId
							const resultSet = result as mysql.ResultSetHeader;
							const savedMessage = {
								messageId: resultSet.insertId, // `insertId` je dostupné na ResultSetHeader
								chatId: msg.chatId,
								userId: msg.userId,
								message: msg.message,
								createdAt: new Date().toISOString(), // můžeš nahradit hodnotou z DB
							};

							// Rozeslání zprávy všem připojeným klientům ve stejném chatu
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
		console.log("WebSocket uzavřen");
		const index = clients.indexOf(ws);
		if (index !== -1) clients.splice(index, 1);
	});
});

export { db };

