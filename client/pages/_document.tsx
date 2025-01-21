import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="cs">
			<Head>
				<link
					href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
