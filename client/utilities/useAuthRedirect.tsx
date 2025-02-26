import { useRouter } from "next/router";
import { useEffect } from "react";

const cookie = require("cookie");

const useAuthRedirect = () => {
	const router = useRouter();
	const pagesWithoutAuth = ["/", "/login", "/registration", "forgotten-password"];

	useEffect(() => {
		const cookies = cookie.parse(document.cookie);
		const userEmail = cookies.userEmail || null;

		if (!userEmail && !pagesWithoutAuth.includes(router.pathname)) {
			router.push("/"); // Pokud není přihlášený a není na stránce bez autentizace, je přesměrován na index
		}

		if (userEmail && pagesWithoutAuth.includes(router.pathname)) {
			router.push("/training-plans"); // Pokud je přihlášený a je na stránce bez autentizace, je přesměrován na training-plans
		}
	});
};

export default useAuthRedirect;
