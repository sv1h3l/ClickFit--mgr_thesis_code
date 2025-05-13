import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	components: {
		MuiButton: {
			defaultProps: {
				disableRipple: true,
			},
			styleOverrides: {
				root: {
					borderRadius: 12,
					"&.Mui-disabled": {
						color: "rgba(255, 255, 255, 0.3)", // změna barvy textu při disabled
					},
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				input: {
					color: "white",
					"&::placeholder": {
						opacity: 0.6,
					},
				},
				root: {
					".MuiInput-input": {
						"&.Mui-disabled": {
							"&::placeholder": {
								"-webkit-text-fill-color": "#ffffff75",
							},
						},
					},
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					color: "rgba(255, 255, 255, 0.7)", // barva helper textu
					paddingLeft: "0.2rem",
					"&.Mui-disabled": {
						color: "rgba(255, 255, 255, 0.3)", // když je disabled
					},
					"&.Mui-error": {
						color: "#ff6565", // TODO barva při chybě, #ff8585 při červeném ražimu
					},
				},
			},
		},
		MuiAutocomplete: {
			styleOverrides: {
				noOptions: {
					color: "white", // barva textu
					opacity: 0.6, // volitelně lehce zprůhlednit
				},
			},
		},
		MuiInput: {
			styleOverrides: {
				root: {
					color: "white",
					opacity: 0.88,
				},

				underline: {
					"&:before": {
						borderBottomColor: "#808080",
						opacity: 0.88,
						borderBottomWidth: 1,
					},

					"&:hover:not(.Mui-disabled):before": {
						borderBottomColor: "#B4B4B4",
						opacity: 0.88,
						borderBottomWidth: 1,
					},
					"&:after": {
						borderBottomColor: "white",
						opacity: 0.88,
						borderBottomWidth: 1,
					},
					"&.Mui-disabled:before": {
						borderBottomStyle: "solid", // změna z dotted na solid
						opacity: 0.5, // volitelné, mírné zeslabení
					},
				},

				input: {
					paddingLeft: "0.2rem",
					paddingRight: "0.2rem",
					paddingBottom: "0.15rem",
					caretColor: "white",
					"&:-webkit-autofill": {
						boxShadow: "0 0 0 1000px #2f2f2f inset", // musí být dostatečně velký a tmavý
						WebkitTextFillColor: "white",
						transition: "background-color 5000s ease-in-out 0s",
					},
					"&.Mui-disabled": {
						color: "rgba(255, 255, 255, 0.3)",
						WebkitTextFillColor: "rgba(255, 255, 255, 0.3)",
					},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				input: {
					color: "white",
					caretColor: "white",
					"&::placeholder": {
						opacity: 0.6,
					},
					"&:-webkit-autofill": {
						boxShadow: "0 0 0 1000px #2f2f2f inset", // musí být dostatečně velký a tmavý
						WebkitTextFillColor: "white",
						transition: "background-color 5000s ease-in-out 0s",
					},
				},
				notchedOutline: {
					borderColor: "#6A6A6A",
					borderWidth: 1,
					transition: "border-color 0.3s ease, border-width 0.3s ease",
				},
				root: {
					borderRadius: 12,
					"&:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: "#939393",
						borderWidth: 1.2,
					},
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: "#E4E4E4",
						opacity: 0.88,
						borderWidth: 1.2,
					},
				},
			},
		},
		MuiFilledInput: {
			styleOverrides: {
				input: {
					color: "white",
					caretColor: "white",
					"&::placeholder": {
						color: "rgba(255, 255, 255, 0.7)",
						opacity: 1,
					},
					"&:-webkit-autofill": {
						boxShadow: "0 0 0 1000px #2f2f2f inset", // musí být dostatečně velký a tmavý
						WebkitTextFillColor: "white",
						transition: "background-color 5000s ease-in-out 0s",
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: "rgba(255, 255, 255, 0.6)",
					"&.Mui-focused": {
						color: "white",
					},
					"&.Mui-error": {
						color: "#ff6565",
					},
					"&.Mui-disabled": {
						color: "rgba(255, 255, 255, 0.3)",
					},
				},
				standard: {
					left: "0.2rem",
				},
			},
		},
		MuiInputAdornment: {
			styleOverrides: {
				root: {
					color: "white",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: "#666",
					color: "white",
					borderTopRightRadius: 3,
					borderTopLeftRadius: 10,
					borderBottomLeftRadius: 10,
					borderBottomRightRadius: 10,
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					backgroundColor: "#464646", // stejné jako MenuItem background
					color: "white",
					paddingTop: 0,
					paddingBottom: 0,
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					backgroundColor: "#2f2f2f", // tvoje požadovaná barva pozadí
					color: "white",
					"&:hover": {
						backgroundColor: "#3a3a3a", // barva při najetí
					},
					"&.Mui-selected": {
						backgroundColor: "#474747", // barva když je vybraný
						"&:hover": {
							backgroundColor: "#505050",
						},
					},
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					color: "white",
					opacity: 0.7,
					"&.Mui-checked": {
						color: "white",
						opacity: 0.8,
					},
					"&.Mui-disabled": {
						color: "rgba(255, 255, 255, 0.2)",
					},
				},
			},
		},
		MuiFormControlLabel: {
			styleOverrides: {
				label: {
					color: "white", // Barva textu (labelu) checkboxu
					opacity: 0.85,
					"&.Mui-disabled": {
						color: "#ffffff40", // Barva textu když je checkbox disabled
					},
				},
			},
		},
	},
});

export default theme;
