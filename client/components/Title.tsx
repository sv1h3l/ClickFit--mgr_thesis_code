import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

function Title({ title, secondTitle, smallPaddingTop }: { title: string; secondTitle?: string; smallPaddingTop?: boolean }) {
    const titleRef = useRef<HTMLDivElement>(null);
    const secondTitleRef = useRef<HTMLDivElement>(null);

    const [widthOfTitle, setWidthOfTitle] = useState<number | null>(null);
    const [widthOfSecondTitle, setWidthOfSecondTitle] = useState<number | null>(null);

    useEffect(() => {
        if (titleRef.current) {
            const typographyWidth = titleRef.current.getBoundingClientRect().width;
            setWidthOfTitle(typographyWidth + 14);
        }

        if (secondTitleRef.current) {
            const typographyWidth = secondTitleRef.current.getBoundingClientRect().width;
            setWidthOfSecondTitle(typographyWidth + 14);
        }
    }, []);

    return (
        <Box className={`${secondTitle && "flex"}`}>
            <Box
                className={`relative 
                            ${smallPaddingTop ? "pt-2" : "pt-8"} ${secondTitle && "w-1/2"}`}
            >
                <Box
                    style={{ width: `${widthOfTitle}px` }}
                    className="border-t-2 border-l-2 border-gray-200 h-6 rounded-tl-xl absolute -left-3"
                />

                <Typography
                    ref={titleRef}
                    className={`pt-1  text-lg text-nowrap w-fit`}
                >
                    {title}
                </Typography>
            </Box>

            {secondTitle && (
                <Box className={`relative ${smallPaddingTop ? "pt-2" : "pt-8"}`}>
                    <Box
                        style={{ width: `${widthOfSecondTitle}px` }}
                        className="border-t-2 border-l-2 border-gray-200 h-6 rounded-tl-xl absolute -left-3"
                    />

                    <Typography
                        ref={secondTitleRef}
                        className={`pt-1  text-lg text-nowrap w-fit`}
                    >
                        {secondTitle}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default Title;
