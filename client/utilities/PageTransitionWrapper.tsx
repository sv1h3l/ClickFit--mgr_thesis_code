import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

interface PageTransitionWrapperProps {
	children: React.ReactNode;
}

export default function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
	const router = useRouter();
	const [isVisible, setIsVisible] = useState(true);
	const [displayChildren, setDisplayChildren] = useState(children);
	const previousPathname = useRef(router.pathname);

	useEffect(() => {
		// Pokud zůstáváme na té samé stránce, nedělej přechod
		if (router.pathname === previousPathname.current) {
			setDisplayChildren(children);
			return;
		}

		// Pokud měníme stránku, spusť přechod
		setIsVisible(false);

		const timeout = setTimeout(() => {
			setDisplayChildren(children);
			setIsVisible(true);
			previousPathname.current = router.pathname;
		}, 150);

		return () => clearTimeout(timeout);
	}, [children, router.pathname]);

	return <div className={`transition-opacity duration-150 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>{displayChildren}</div>;
}
