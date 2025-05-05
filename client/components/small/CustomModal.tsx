import { Backdrop, Box, Fade, Modal } from "@mui/material";
import GeneralCard from "../large/GeneralCard";
import ButtonComp, { IconEnum } from "./ButtonComp";

// Vlastní modal komponenta
interface Props {
	isOpen: boolean;
	onClose: () => void;

	title: string;
	children: React.ReactNode;
	hideBackButton?: boolean;
  paddingTop?: boolean;

	style?: string;
}

const CustomModal = (props: Props) => {
	return (
		<Modal
			open={props.isOpen}
			onClose={(event, reason) => {
				if (reason !== "backdropClick") {
					props.onClose();
				}
			}}
			closeAfterTransition
			
			BackdropComponent={Backdrop} // Přidání ztmavení pozadí
			BackdropProps={{
				timeout: 200,
				style: {
					backgroundColor: "rgba(0, 0, 0, 0.6)", // Nastavíme intenzitu ztmavení pozadí (tady 70%)
				},
			}}>
			<Fade in={props.isOpen}>
				<Box
					className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2  shadow-xl max-h-svh rounded-lg max-w-content
                        ${props.style}`}>
					<GeneralCard
						prolog={props.paddingTop}
						centerFirstTitle
						firstTitle={props.title}
						firstChildren={
							<Box>
								{props.children}

								{props.hideBackButton ? null : (
									<ButtonComp
										content={IconEnum.BACK}
										justClick
										dontChangeOutline
										size="small"
										style="absolute left-3 top-3"
										onClick={() => {
											props.onClose();
										}}
									/>
								)}
							</Box>
						}
					/>
				</Box>
			</Fade>
		</Modal>
	);
};

export default CustomModal;
