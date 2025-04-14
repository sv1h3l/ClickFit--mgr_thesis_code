import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2";
import routes from "./routes";

dotenv.config();

// ✅ Vytvoření connection poolu
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

// ✅ Ověření připojení při startu
db.getConnection((err, connection) => {
	if (err) {
		console.error("Chyba připojení k databázi:", err);
	} else {
		console.log("Připojeno k databázi");
		connection.release(); // Nezapomeň uvolnit
	}
});

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(bodyParser.json());

app.use("/api", routes);

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

export { db };
