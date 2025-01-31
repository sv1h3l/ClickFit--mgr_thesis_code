import { Box, Typography } from "@mui/material";

interface LabelAndValueProps {
    label?: string;
    value?: string;

    spaceBetween?: boolean;
    noPaddingTop?: boolean;

    notFilledIn?: boolean;
    isSelected?: boolean;
}

function LabelAndValue({ label, value, spaceBetween, noPaddingTop, notFilledIn, isSelected }: LabelAndValueProps) {
    return (
        <Box
            className={`flex  w-full pl-3 relative
                        ${!spaceBetween && "gap-3"} ${!noPaddingTop && "pt-4"} `}
        >
            {isSelected && <Typography className="absolute -left-4 text-gray-200">⬤</Typography>}

            <Typography
                className={`text-nowrap 
                ${spaceBetween && "w-1/2"} ${!isSelected && "font-light"}`}
            >
                {label}
            </Typography>

            {!spaceBetween && (value || notFilledIn) && <Typography className="text-gray-400 font-light text-nowrap">»</Typography>}

            <Typography
                className={`text-nowrap 
                                    ${!value && "text-gray-400 font-light"} ${spaceBetween && !isSelected && "font-light"}`}
            >
                {value || (notFilledIn && "Není vyplněno")}
            </Typography>
        </Box>
    );
}

export default LabelAndValue;
