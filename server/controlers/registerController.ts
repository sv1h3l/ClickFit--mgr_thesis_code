import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { createUser } from "../models/createUser";
import { checkEmailDuplicity } from "../models/checkEmailDuplicity";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
	const { name, surname, email, password, confirmPassword } = req.body;

	// Objekt do kterého se shromažďují chyby
	const errors: Record<string, string> = {};

	// Validace vstupů
	!name && (errors.name = "Jméno nesmí být prázdné");
	!surname && (errors.surname = "Příjmení nesmí být prázdné");
	password !== confirmPassword && (errors.confirmPassword = "Hesla se neshodují");
	password.length < 8 && (errors.password = "Heslo musí obsahovat alespoň 8 znaků");

	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!emailRegex.test(email)) {
		errors.email = "Neplatná emailová adresa";
	} else {
		const isDuplicate = await checkEmailDuplicity(email);
		isDuplicate && (errors.email = "Již existuje účet se zadanou emailovou adresou");
	}

	// Pokud existují chyby, vrátí se všechny najednou
	if (Object.keys(errors).length > 0 || name.length > 20 || surname.length > 20 || email.length > 40 || password.length > 40) {
		res.status(400).json({ errors });
		return;
	}

	try {
		// Hashování hesla
		const hashedPassword = await bcrypt.hash(password, 10);

		// Uložení uživatele do databáze
		await createUser(email, hashedPassword, name, surname);

		// Úspěšná odpověď
		res.status(201).json({ message: "Registrace byla úspěšná." });
	} catch (error) {
		console.error(error);

		// Serverová chyba
		res.status(500).json({ message: "Došlo k chybě při registraci." });
	}
};