import express, { query, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mysql, { RowDataPacket } from "mysql2";
import routes from "./routes";

dotenv.config();
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // Nastaví defaultní port
}); 

db.connect((err) => {
    if (err) {
        console.error("Chyba připojení k databázi:", err);
    } else {
        console.log("Připojeno k databázi");
    }
});

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

export { db };
