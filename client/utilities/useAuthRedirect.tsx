import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppContext } from "./Context";

const cookie = require("cookie");

const useAuthRedirect = () => {
	const router = useRouter();
	const pagesWithoutAuth = ["/", "/login", "/registration", "/forgotten-password", "/new-password /verification"];
	const pagesWithAuth = ["/chat", "/connection", "/diary", "/profile", "/sports", "/training-plan-creation", "/training-plan", "/training-plans"];

	useEffect(() => {
		const cookies = cookie.parse(document.cookie);
		const authToken = cookies.authToken || null;

		if (!pagesWithAuth.includes(router.pathname) && !pagesWithoutAuth.includes(router.pathname)) return;

		if (router.pathname === "/connection" && !authToken) {
			const cc = router.query.cc;

			if (cc) {
				document.cookie = cookie.serialize("cc", cc, {
					path: "/",
					maxAge: 60 * 60 * 24,
				});

				router.push("/login");
				return;
			}
		}

		if (!authToken && !pagesWithoutAuth.includes(router.pathname)) {
			router.push("/");
		} else if (authToken && pagesWithoutAuth.includes(router.pathname)) {
			router.push("/training-plans");
		}
	});
};

export default useAuthRedirect;
