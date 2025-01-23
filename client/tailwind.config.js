/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			screens: {
				"max-content": "1750px",
			},
			colors: {
				"d-blue": "#0086F0",
				"m-blue": "#76C2FF",
				"l-blue": "#D2EBFF",
			},
		},
	},
	plugins: [],
};
