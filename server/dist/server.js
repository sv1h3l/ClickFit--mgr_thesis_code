"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mysql2_1 = __importDefault(require("mysql2"));
const ws_1 = require("ws");
const changeUnreadMessagesMod_1 = require("./models/change/changeUnreadMessagesMod");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
// Připojení k databázi
const db = mysql2_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
exports.db = db;
db.getConnection((err, connection) => {
    if (err) {
        console.error("Chyba připojení k databázi:", err);
    }
    else {
        console.log("Připojeno k databázi");
        connection.release();
    }
});
// Nastavení Express serveru
const app = (0, express_1.default)();
const host = process.env.SERVER_HOST || "10.0.0.99";
const port = parseInt(process.env.SERVER_PORT || "5000", 10);
app.use((0, cors_1.default)({
    origin: true, // nebo odpovídající front-end doména
    credentials: true,
}));
app.use(body_parser_1.default.json());
app.use("/api", routes_1.default);
const server = app.listen(port, host, () => {
    console.log(`Server běží na http://${host}:${port}`);
});
const clients = [];
// WebSocket server
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (ws) => {
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
                    db.query(`INSERT INTO chats (connection_id, user_id, message, created_at)
							 VALUES (?, ?, ?, NOW())`, [msg.chatId, msg.userId, msg.message], (err, result) => {
                        if (err) {
                            console.error("Chyba při ukládání zprávy:", err);
                            return;
                        }
                        const resultSet = result;
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
                            const rows = results;
                            if (rows.length === 0)
                                return;
                            const connection = rows[0];
                            // Určení příjemce
                            const receiverId = msg.userId === connection.first_user_id ? connection.second_user_id : connection.first_user_id;
                            // Zjisti, jestli je příjemce právě v chatu
                            const isReceiverInSameChat = clients.some((client) => client.readyState === ws_1.WebSocket.OPEN && client.connectionId === msg.chatId && client.userId === receiverId);
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
                                if (client.readyState === ws_1.WebSocket.OPEN && client.connectionId === msg.chatId) {
                                    client.send(JSON.stringify({
                                        type: "receiveMessage",
                                        message: savedMessage,
                                    }));
                                }
                            });
                        });
                    });
                    break;
                default:
                    console.warn("Neznámý typ zprávy:", data.type);
            }
        }
        catch (err) {
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
                (0, changeUnreadMessagesMod_1.changeUnreadMessagesMod)({ userId, connectionId }).catch((err) => {
                    console.error("Nastala chyba během označení zpráv jako přečtené");
                });
            }
        }
    });
});
//# sourceMappingURL=server.js.map