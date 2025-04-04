/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				boldonse: ["Boldonse", "sans-serif"],
				righteous: ["Righteous", "sans-serif"],
				audiowide: ["Audiowide", "sans-serif"],
				brunoace: ["BrunoAceSC", "sans-serif"],

			},
			
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
