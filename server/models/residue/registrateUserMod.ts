import bcrypt from "bcryptjs";
import { db } from "../../server";
import { generateToken } from "../../utilities/generateToken";
import { ResultSetHeader, RowDataPacket } from "mysql2"; // Import pro správné typování

// Funkce pro vytvoření uživatele
export const registrateUserMod = async (email: string, password: string, firstName: string, lastName: string): Promise<{ token: string; userId: number }> => {
    const query = `
        INSERT INTO users 
        (email, first_name, last_name, hashed_password, auth_token, token, token_expires, connection_code) 
        VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(CURDATE(), INTERVAL 14 DAY), ?)
    `;

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = generateToken(); // Generování unikátního tokenu
    let authToken = await bcrypt.hash(email, 10);

    // Funkce pro kontrolu unikátnosti authToken v DB
    const checkAuthTokenUniqueness = async (token: string): Promise<boolean> => {
        const checkQuery = `SELECT COUNT(*) AS count FROM users WHERE auth_token = ?`;
        const [result] = await db.promise().query<RowDataPacket[]>(checkQuery, [token]); // Přidání typu RowDataPacket[]
        return result[0].count === 0; // Vrátí true, pokud není žádný záznam se stejným auth_token
    };

    // Ujistíme se, že authToken je unikátní
    let isUnique = false;
    while (!isUnique) {
        const isTokenUnique = await checkAuthTokenUniqueness(authToken);
        if (isTokenUnique) {
            isUnique = true; // Pokud je token unikátní, můžeme pokračovat
        } else {
            authToken = await bcrypt.hash(email + Date.now(), 10); // Pokud není unikátní, vygenerujeme nový hash
        }
    }

    // Funkce pro generování unikátního connection_code
    const generateUniqueConnectionCode = async (): Promise<string> => {
        const generateCode = () => {
            const number = Math.floor(Math.random() * 1e12); // Vygeneruje číslo mezi 0 a 999999999999
            return number.toString().padStart(12, '0'); // Zajistí, že číslo bude mít 12 cifer
        };

        let connectionCode = generateCode();

        // Funkce pro kontrolu unikátnosti connection_code v DB
        const checkConnectionCodeUniqueness = async (code: string): Promise<boolean> => {
            const checkQuery = `SELECT COUNT(*) AS count FROM users WHERE connection_code = ?`;
            const [result] = await db.promise().query<RowDataPacket[]>(checkQuery, [code]);
            return result[0].count === 0; // Vrátí true, pokud není žádný záznam se stejným connection_code
        };

        // Ujistíme se, že connectionCode je unikátní
        let isCodeUnique = false;
        while (!isCodeUnique) {
            const isCodeUniqueCheck = await checkConnectionCodeUniqueness(connectionCode);
            if (isCodeUniqueCheck) {
                isCodeUnique = true; // Pokud je code unikátní, můžeme pokračovat
            } else {
                connectionCode = generateCode(); // Pokud není unikátní, vygenerujeme nový
            }
        }

        return connectionCode;
    };

    // Získání unikátního connection_code
    const uniqueConnectionCode = await generateUniqueConnectionCode();

    // Uložení uživatele s unikátními authToken a connection_code
    return new Promise((resolve, reject) => {
        db.query(query, [email, firstName, lastName, hashedPassword, authToken, token, uniqueConnectionCode], (error, results) => {
            const typedResults = results as ResultSetHeader;
            
            if (error) {
                console.log("userModel: ", error);
                reject(error);
            } else {
                console.log("userModel: ", results);
                resolve({ token, userId: typedResults.insertId });
            }
        });
    });
};
