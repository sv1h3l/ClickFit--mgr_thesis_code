import { createConnectionReq } from "@/api/create/createConnectionReq";
import { consoleLogPrint } from "@/api/GenericApiResponse";
import { ConnectedUser } from "@/pages/connection";
import { StateAndSetFunction } from "@/utilities/generalInterfaces";
import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";
import ButtonComp, { IconEnum } from "../small/ButtonComp";
import GeneralCard from "./GeneralCard";

interface Props {
	connectionCode: number;
	qrCode: string;

	connectedUsers: StateAndSetFunction<ConnectedUser[]>;
}

const NewConnection = (props: Props) => {
	const formatConnectionCode = (code: number): string => {
		const codeString = code.toString();
		return codeString.replace(/(\d{4})(?=\d)/g, "$1 - ");
	};

	const [code, setCode] = useState<{ [key: string]: string }>({
		part1: "",
		part2: "",
		part3: "",
	});

	// Funkce pro automatické přepnutí mezi textovými poli
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, part: string) => {
		let value = e.target.value.replace(/\D/g, ""); // jen čísla
		if (value.length > 4) value = value.substring(0, 4); // max 4 číslice

		setCode((prevState) => {
			const newCode = { ...prevState, [part]: value };

			// Přeskočení a označení textu
			if (value.length === 4) {
				let nextId = "";
				if (part === "part1") nextId = "part2";
				else if (part === "part2") nextId = "part3";

				if (nextId) {
					const nextInput = document.getElementById(nextId) as HTMLInputElement | null;
					if (nextInput) {
						nextInput.focus();
						// Musíme dát timeout, jinak `select()` neproběhne správně
						setTimeout(() => {
							nextInput.select();
						}, 0);
					}
				}
			}

			return newCode;
		});
	};

	// Funkce pro zpracování backspace (pokud je pole prázdné)
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, part: string) => {
		const target = e.target as HTMLInputElement;

		if (!(target instanceof HTMLInputElement)) return;

		const cursorPosition = target.selectionStart ?? 0;
		const selectionStart = target.selectionStart ?? 0;
		const selectionEnd = target.selectionEnd ?? 0;
		const isAllSelected = selectionStart === 0 && selectionEnd === target.value.length;
		const isNonEmptySelection = isAllSelected && target.value.length > 0;

		// Nepřeskočíme, pokud je celé pole označené a není prázdné
		if (isNonEmptySelection) return;

		if (e.key === "Backspace" && cursorPosition === 0) {
			e.preventDefault();
			if (part === "part2") {
				document.getElementById("part1")?.focus();
			} else if (part === "part3") {
				document.getElementById("part2")?.focus();
			}
		}

		if (e.key === "ArrowLeft" && cursorPosition === 0) {
			e.preventDefault();
			if (part === "part2") {
				document.getElementById("part1")?.focus();
			} else if (part === "part3") {
				document.getElementById("part2")?.focus();
			}
		}

		if (e.key === "ArrowRight" && cursorPosition === target.value.length) {
			e.preventDefault();
			if (part === "part1") {
				document.getElementById("part2")?.focus();
			} else if (part === "part2") {
				document.getElementById("part3")?.focus();
			}
		}
	};

	const handleCreateConnection = async (connectionCodeString: string) => {
		if (!/^\d+$/.test(connectionCodeString)) {
			return;
		}

		const connectionCode = Number(connectionCodeString);

		try {
			const res = await createConnectionReq({ connectionCode });

			if (res.status === 200 && res.data) {
				props.connectedUsers.setState((prev) => {
					return [res.data!, ...prev];
				});
			}

			consoleLogPrint(res);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	return (
		<GeneralCard
			firstTitle="Nová spojení"
			height="h-full"
			firstChildren={
				<Box className="flex flex-col items-center gap-2 ">
					<Typography className="font-light">Se svými sparingy, trenéry nebo klienty se můžete snadno spojit. Stačí naskenovat QR kód pomocí telefonu nebo ručně zadat 12ciferný kód do vyhledávače.</Typography>

					{props.qrCode && (
						<Box className="w-44 h-auto mr-4 mt-8">
							{props.qrCode ? (
								<img
									src={props.qrCode}
									alt="QR kód pro nová spojení"
								/>
							) : null}
						</Box>
					)}

					<Typography className="text-lg mr-4">{formatConnectionCode(props.connectionCode)}</Typography>

					<Typography className="text-xl font-light mt-8 mr-4 mb-1">Vyhledávač</Typography>

					<Box className="flex gap-0.5 ml-4">
						<TextField
							className="w-12"
							id="part1"
							value={code.part1}
							onChange={(e) => handleChange(e, "part1")}
							onKeyDown={(e) => handleKeyDown(e, "part1")}
							variant="standard"
							InputProps={{
								sx: {
									"& input::placeholder": {
										fontWeight: "300",
										textAlign: "center",
									},
								},
							}}
							inputProps={{
								style: {
									padding: 0,
									paddingInline: 5,
									paddingBottom: 0.75,
								},
								maxLength: 4,
							}}
						/>
						<Typography>-</Typography>
						<TextField
							className="w-12"
							id="part2"
							value={code.part2}
							onChange={(e) => handleChange(e, "part2")}
							onKeyDown={(e) => handleKeyDown(e, "part2")}
							variant="standard"
							InputProps={{
								sx: {
									"& input::placeholder": {
										fontWeight: "300",
										textAlign: "center",
									},
								},
							}}
							inputProps={{
								style: {
									padding: 0,
									paddingInline: 5,
									paddingBottom: 0.75,
								},
								maxLength: 4,
							}}
						/>
						<Typography>-</Typography>
						<TextField
							className="w-12"
							id="part3"
							value={code.part3}
							onChange={(e) => handleChange(e, "part3")}
							onKeyDown={(e) => handleKeyDown(e, "part3")}
							variant="standard"
							InputProps={{
								sx: {
									"& input::placeholder": {
										fontWeight: "300",
									},
								},
							}}
							inputProps={{
								style: {
									padding: 0,
									paddingInline: 5,
									paddingBottom: 0.75,
								},
								maxLength: 4,
							}}
						/>

						<ButtonComp
							style="mt-0.5 ml-3"
							disabled={code["part1"].length < 4 || code["part2"].length < 4 || code["part3"].length < 4}
							dontChangeOutline
							justClick
							contentStyle="scale-[1.4]"
							content={IconEnum.PLUS}
							onClick={() => {
								handleCreateConnection(code["part1"] + code["part2"] + code["part3"]);
							}}
						/>
					</Box>
				</Box>
			}
		/>
	);
};

export default NewConnection;
