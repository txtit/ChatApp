import { Badge, Box, Divider, IconButton, Link, Menu, MenuItem, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles"
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import { Message_options } from "../../data";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import { toast } from 'sonner';
import { UpdateDirectConversations } from "../../redux/slices/coversation";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { EmojiEmotions } from '@mui/icons-material';
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
    // Hàm để trích xuất URL từ HTML
    const extractTextFromHTML = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        return doc.body.textContent || ""; // Lấy nội dung văn bản
    };
    const plainText = extractTextFromHTML(el.message);
    return (
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>

            <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default : theme.palette.primary.main, borderRadius: 1.5,
                width: "max-content",
            }}>
                <Stack spacing={2}>
                    <Stack p={2} spacing={3} alignItems={"center"} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
                        <img src={el.preview}
                            alt={plainText}
                            style={{ maxHeight: 260, borderRadius: "10px" }} />
                        <Stack spacing={2}>
                            <Typography variant="subtitle2" style={{ textAlign: "center" }}>
                                Link
                            </Typography>
                            <Typography variant="subtitle2" component={Link} to={plainText} style={{
                                textDecoration: "none",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "block", // Bắt buộc với textOverflow
                                maxWidth: "300px", // Tùy chỉnh chiều rộng phù hợp
                            }}>
                                Bài viết được chia sẻ
                            </Typography>
                        </Stack>
                        <Typography
                            variant="subtitle2"
                            component="a"
                            href={plainText}
                            target="_blank"
                            rel="noopener noreferrer"

                            style={{
                                textDecoration: "none",
                                overflow: "hidden",
                                textAlign: "center",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "block", // Bắt buộc với textOverflow
                                maxWidth: "600px", // Tùy chỉnh chiều rộng phù hợp
                                minWidth: "300px", // Tùy chỉnh chiều rộng phù hợp
                            }}
                        >
                            {plainText}
                        </Typography>

                    </Stack>
                </Stack>
            </Box>
            {menu && <MessageOption id={el.id} />}

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
            <MessageOption id={el.id} />
        </Stack>
    );
};



const MediaMsg = ({ el }) => {
    const theme = useTheme();

    const validColors = ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'textPrimary', 'textSecondary'];
    const color = validColors.includes(el.color) ? el.color : 'textPrimary';
    return (
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
            <Box p={0} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default : theme.palette.primary.main, borderRadius: 1.5,
                width: "max-content",
            }}>
                <Stack spacing={0}>
                    <img src={el.imageUrl} alt={el.message} style={{ maxHeight: 210, borderRadius: 5.5 }} />
                    <Typography variant="body2" color={color}>
                        {el.message}
                    </Typography>
                </Stack>
            </Box>
            <MessageOption id={el.id} />

        </Stack>

    )
}


const TextMsg = ({ el }) => {
    const theme = useTheme();
    const validColors = ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'textPrimary', 'textSecondary'];
    const color = validColors.includes(el.color) ? el.color : 'textPrimary';
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null); // Lưu emoji đã chọn
    // Hàm mở hoặc đóng picker emoji
    const toggleEmojiPicker = () => {
        setIsPickerOpen(prev => !prev);
    };

    // Hàm xử lý khi người dùng chọn emoji
    const handleEmojiSelect = (emoji) => {
        setSelectedEmoji(emoji.native); // Lưu emoji đã chọn
        setIsPickerOpen(false); // Đóng picker
    };

    return (
        <Stack direction={"row"} sx={{ paddingRight: "50px" }} justifyContent={el.incoming ? "start" : "end"}>
            <Box
                p={1.5}

                sx={{
                    backgroundColor: el.incoming ? '#f5f5f5' : '#3f51b5',
                    borderRadius: 1.5,
                    width: "max-content",

                }}
            >
                <Typography sx={{ color: el.incoming ? "textPrimary" : "white" }} variant="body2">
                    {el.message}
                </Typography>
            </Box>

            {/* Badge dùng để hiển thị biểu tượng cảm xúc */}
            <Badge
                color="secondary"
                badgeContent={
                    selectedEmoji ? (
                        <span style={{ cursor: "pointer" }} onClick={toggleEmojiPicker}>{selectedEmoji}</span> // Hiển thị emoji đã chọn
                    ) : (
                        <IconButton
                            onClick={toggleEmojiPicker}
                            sx={{ position: 'absolute', bottom: '-8px', right: '-7px' }}
                        >
                            {/* Kiểm tra xem đã chọn emoji chưa */}
                            {selectedEmoji ? (
                                <span>{selectedEmoji}</span> // Hiển thị emoji đã chọn
                            ) : (
                                <EmojiEmotions sx={{ fontSize: 18, color: "#fff" }} /> // Mặc định là biểu tượng cảm xúc
                            )}
                        </IconButton>
                    )
                }
                sx={{
                    // position: 'absolute',
                    bottom: '-45px', // Đặt badge dưới tin nhắn
                    right: '0', // Căn bên phải
                }}
            >

            </Badge>

            {/* Picker emoji sẽ hiển thị nếu isPickerOpen là true */}
            {isPickerOpen && (
                <Picker
                    data={data} // Dữ liệu emoji
                    onEmojiSelect={handleEmojiSelect} // Hàm gọi khi chọn emoji
                    sx={{ position: 'absolute', bottom: '50px', right: '-40px' }}
                />
            )}
            <MessageOption sx={{ paddingRight: '30px' }} id={el.id} />
        </Stack>
    );
}

const Timeline = ({ el }) => {
    const theme = useTheme();

    const validColors = ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'textPrimary', 'textSecondary'];
    const color = validColors.includes(el.color) ? el.color : 'textPrimary';
    return (
        <Stack direction="row" alignItems={"center"} justifyContent={"space-between"}>
            <Divider width="35%" />
            <Typography variant="caption" sx={{ color: theme.palette.text }}>{el.message}</Typography>
            <Divider width="35%" />

        </Stack>
    )
}
const Timeline2 = ({ el }) => {
    const theme = useTheme();

    const validColors = ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'textPrimary', 'textSecondary'];
    const color = validColors.includes(el.color) ? el.color : 'textPrimary';
    return (
        <Stack direction="row" alignItems={"center"} justifyContent={"center"}>
            <Typography variant="caption" sx={{ color: theme.palette.text }}>{el.message}</Typography>

        </Stack>
    )
}


const MessageOption = (id) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { conversations = [] } = useSelector((state) => state.conversation.direct_chat);
    const { sidebar, room_id } = useSelector((state) => state.app);
    const user_id = window.localStorage.getItem("user_id");
    const current = conversations.find((el) => el?.id === room_id);
    const dispatch = useDispatch();
    // Hàm xử lý sự kiện "Delete Message"
    const handleDeleteMessage = () => {
        console.log(id.id);

        // Gửi sự kiện delete_message qua socket
        socket.emit('delete_message', {
            to: current?.user_id,
            from: user_id,
            id: id.id,
        });

        dispatch(UpdateDirectConversations({ conversation: current }));

        // Bạn có thể cập nhật UI hoặc thông báo cho người dùng
        toast.success("Message deletion requested");
    };

    const handleReactMessage = () => {
        console.log(id);
        // Ở đây bạn có thể gọi API xóa tin nhắn hoặc thực hiện các thao tác cần thiết
        // Gửi sự kiện delete_message qua socket
        socket.emit('delete_message', {
            to: current?.user_id,
            from: user_id,
            id: id,
        });

        dispatch(UpdateDirectConversations({ conversation: current }));

        // Bạn có thể cập nhật UI hoặc thông báo cho người dùng
        toast.success("Message deletion requested");
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
                        <MenuItem
                            key={idx} onClick={() => {
                                handleClose(); // Đóng menu khi chọn mục
                                if (el.title === "Delete Message") {
                                    handleDeleteMessage(); // Gọi hàm xóa tin nhắn nếu là "Delete Message"
                                }
                                if (el.title === "React to message") {
                                    handleDeleteMessage(); // Gọi hàm xóa tin nhắn nếu là "Delete Message"
                                }
                            }}
                        >
                            {el.title}
                        </MenuItem>
                    ))}
                </Stack>

            </Menu>
        </>
    );
};




export { Timeline, Timeline2, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };