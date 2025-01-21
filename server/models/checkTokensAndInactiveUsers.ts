import cron from "node-cron";
import { db } from "../server"; // Připojení k databázi

// Funkce pro mazání starých tokenů
const deleteOldTokens = () => {
	const query = `
        UPDATE users 
        SET token = NULL, token_expires = NULL
        WHERE token_expires < CURDATE()
    `;

	db.query(query, (error: Error, results: { affectedRows: number }) => {
		if (error) {
			console.error("Chyba při mazání starých tokenů:", error);
		} else {
			console.log(`Počet aktualizovaných řádků: ${results.affectedRows}`);
		}
	});
};

// Funkce pro mazání neaktivních uživatelů
const deleteInactiveUsers = () => {
	const query = `
        DELETE FROM users 
        WHERE token IS NULL 
          AND token_expires IS NULL 
          AND is_active = 0
    `;

	db.query(query, (error: Error, results: { affectedRows: number }) => {
		if (error) {
			console.error("Chyba při mazání neaktivních účtů:", error);
		} else {
			console.log(`Počet smazaných účtů: ${results.affectedRows}`);
		}
	});
};

export const checkTokensAndInactiveUsers = () => { // TODO testovací funkce (potom smazat)
	console.log("Spouští se úloha mazání starých tokenů a neaktivních uživatelů...");
	deleteOldTokens();
	deleteInactiveUsers();
};

// Naplánujte úlohu na každý den ve 2:00 ráno
cron.schedule("0 3 * * *", () => {
	console.log("Spouští se úloha mazání starých tokenů a neaktivních uživatelů...");
	deleteOldTokens();
	deleteInactiveUsers();
});
