import { useRouter } from "next/router";
import { useEffect } from "react";

const checkLoggedUser = (WrappedComponent: React.ComponentType) => {
	return function AuthenticatedComponent(props: any) {
		const router = useRouter();

		useEffect(() => {
			const user = localStorage.getItem("user");
			if (user) {
				router.push("/training-plans");
			}
		}, [router]);

		return <WrappedComponent {...props} />;
	};
};

export default checkLoggedUser;
