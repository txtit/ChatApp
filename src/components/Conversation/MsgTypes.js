import { Box, Divider, IconButton, Link, Menu, MenuItem, Stack, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles"
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import { Message_options } from "../../data";

const DocMsg = ({ el, menu }) => {
    const theme = useTheme();
    const validColors = ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'textPrimary', 'textSecondary'];
    const color = validColors.includes(el.color) ? el.color : 'textPrimary';
    return (
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default : theme.palette.primary.main, borderRadius: 1.5,
                width: "max-content",
            }}>
                <Stack spacing={2}>
                    <Stack p={2} direction={"row"} spacing={3} alignItems={"center"} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, }}>
                        <Image size={48} />
                        <Typography variant="caption">Abstract.png</Typography>
                        <IconButton>
                            <DownloadSimple />
                        </IconButton>
                    </Stack>
                    <Typography variant="body2" sx={{ color: color }}>{el.message}</Typography>
                </Stack>
            </Box>
            {menu && <MessageOption />}


        </Stack>

    )
}



const LinkMsg = ({ el, menu }) => {
    const theme = useTheme();
    const validColors = ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'textPrimary', 'textSecondary'];
    const color = validColors.includes(el.color) ? el.color : 'textPrimary';


    return (
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default : theme.palette.primary.main, borderRadius: 1.5,
                width: "max-content",
            }}>
                <Stack spacing={2}>
                    <Stack p={2} spacing={3} alignItems={"center"} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
                        <img src={el.preview} alt={el.message} style={{ maxHeight: 210, borderRadius: "10px" }} />
                        <Stack spacing={2}>
                            <Typography variant="subtitle2">
                                Creating Chat App
                            </Typography>
                            <Typography variant="subtitle2" component={Link} to="//https://www.youtube.com">
                                www.youtube.com
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color={color}>
                            {el.message}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
            {menu && <MessageOption />}

        </Stack>

    )
}


const ReplyMsg = ({ el }) => {
    const theme = useTheme();

    // Mảng chứa các giá trị hợp lệ cho prop `color`
    const validColors = ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'textPrimary', 'textSecondary'];
    const color = validColors.includes(el.color) ? el.color : 'textPrimary';

    return (
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default : theme.palette.primary.main,
                borderRadius: 1.5,
                width: "max-content",
            }}>
                <Stack spacing={2}>
                    <Stack p={2} direction="column" spacing={3} alignItems={"center"} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
                        <Typography variant="body2" color="textPrimary">
                            {el.message}
                        </Typography>
                    </Stack>
                    {/* Kiểm tra giá trị color với `sx` để thêm màu trực tiếp nếu không hợp lệ */}
                    <Typography variant="body2" color={validColors.includes(el.color) ? el.color : 'textPrimary'}>
                        {el.reply}
                    </Typography>
                </Stack>
            </Box>
            <MessageOption />
        </Stack>
    );
};



const MediaMsg = ({ el }) => {
    const theme = useTheme();

    const validColors = ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'textPrimary', 'textSecondary'];
    const color = validColors.includes(el.color) ? el.color : 'textPrimary';
    return (
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default : theme.palette.primary.main, borderRadius: 1.5,
                width: "max-content",
            }}>
                <Stack spacing={1}>
                    <img src={el.img} alt={el.message} style={{ maxHeight: 210, borderRadius: "1" }} />
                    <Typography variant="body2" color={color}>
                        {el.message}
                    </Typography>
                </Stack>
            </Box>
            <MessageOption />

        </Stack>

    )
}


const TextMsg = ({ el }) => {
    const theme = useTheme();
    const validColors = ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'textPrimary', 'textSecondary'];
    const color = validColors.includes(el.color) ? el.color : 'textPrimary';
    return (
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default : theme.palette.primary.main, borderRadius: 1.5,
                width: "max-content",
            }}>
                <Typography variant="body2" color={color}>
                    {el.message}
                </Typography>
            </Box>
            <MessageOption />
        </Stack>
    )
}

const Timeline = ({ el }) => {
    const theme = useTheme();

    const validColors = ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'textPrimary', 'textSecondary'];
    const color = validColors.includes(el.color) ? el.color : 'textPrimary';
    return (
        <Stack direction="row" alignItems={"center"} justifyContent={"space-between"}>
            <Divider width="46%" />
            <Typography variant="caption" sx={{ color: theme.palette.text }}>{el.text}</Typography>
            <Divider width="46%" />

        </Stack>
    )
}


const MessageOption = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <DotsThreeVertical
                size={20}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            />

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <Stack spacing={1} px={1}>
                    {Message_options.map((el, idx) => (
                        <MenuItem key={idx} onClick={handleClose}>{el.title}</MenuItem>

                    ))}
                </Stack>

            </Menu>
        </>
    )
}

export { Timeline, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };