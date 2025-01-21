import { ReactNode } from "react";
import Header from "./Header";

function Layout({ children, isWide }: { children: ReactNode, isWide?: boolean }) {
	return (
		<>
			<Header isWide={isWide}/>

			<div className="flex justify-center w-full ">
				<div className=" max-w-content w-full  "> {/*outline outline-1 outline-cyan-500 */}
					<main>{children}</main>
				</div>
			</div>
		</>
	);
}

export default Layout;
