import { ReactNode } from "react";
import Header from "./Header";

function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />

			<div className="flex justify-center w-full ">
				<div className=" max-w-content w-full  ">
					<main>{children}</main>
				</div>
			</div>
		</>
	);
}

export default Layout;
