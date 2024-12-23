import React, { useEffect, useState } from "react";
import { useTheme, styled } from "@mui/material/styles";
import { borderRadius, Stack, width } from "@mui/system";
import StyledBadge from "./StyledBadge";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { socket } from "../socket";
import { Chat } from "phosphor-react";
import { fecthRequest, ResetSent, UpdateSent } from "../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";



const StyledChatBox = styled(Box)(({ theme }) => ({
    "&:hover": {
        cursor: "pointer",
    },
}));
const user_id = window.localStorage.getItem("user_id");
const UserComponent = ({ firstName, lastName, _id, online, img }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const sent = useSelector((state) => state.app.sent);
    const [loading, setLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false); // Để theo dõi yêu cầu đã gửi

    const handleSendRequest = () => {
        console.log("Sending friend request...");

        // Gửi yêu cầu kết bạn
        socket.emit("friend_request", { to: _id, from: user_id }, (error, result) => {
            if (error) {
                console.error("Failed to send friend request:", error);
            } else {
                alert("Request sent successfully");
                // Cập nhật trạng thái Redux
                dispatch(UpdateSent({ _id: _id }));
                setRequestSent(true); // Cập nhật trạng thái requestSent
                console.log("Friend request sent:", result);
            }
        });
    };

    const handleCancelSendRequest = () => {
        console.log("Canceling friend request...");

        // Hủy yêu cầu kết bạn
        socket.emit("cancel_send_request", { to: _id, from: user_id }, (error, result) => {
            if (error) {
                console.error("Failed to cancel friend request:", error);
            } else {
                alert("Request canceled successfully");
                // Cập nhật lại trạng thái khi hủy yêu cầu
                dispatch(UpdateSent({ _id: null }));
                setRequestSent(false); // Cập nhật trạng thái requestSent
            }
        });
    };

    return (
        <StyledChatBox
            sx={{
                width: "100%",
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {online ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            variant="dot"
                        >
                            <Avatar alt={`${firstName} ${lastName}`} src={img} />
                        </StyledBadge>
                    ) : (
                        <Avatar alt={`${firstName} ${lastName}`} src={img} />
                    )}
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{`${firstName} ${lastName}`}</Typography>
                    </Stack>
                </Stack>

                <Stack direction={"row"} spacing={2} alignContent={"center"}>
                    {/* Nếu đã gửi yêu cầu, hiển thị nút "Hủy" */}
                    {requestSent ? (

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCancelSendRequest}
                        >
                            Cancel Request
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendRequest}
                        >
                            Send Request
                        </Button>
                    )}
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};




// const UserComponent = ({ firstName, lastName, _id, online, img }) => {
//     const theme = useTheme();
//     const dispatch = useDispatch();
//     const sent = useSelector((state) => state.app.sent);
//     const name = `${firstName} ${lastName}`;
//     const { friendsRequest = [] } = useSelector((state) => state.app);
//     const [loading, setLoading] = useState(false);
//     // if (friendsRequest.length === 0) {
//     //     sent = null;
//     // }
//     // const [sent, setSent] = useState(false);
//     // console.log("sent", sent)
//     if (!Array.isArray(sent)) {
//         console.warn("Sent is not an array or is undefined");
//         return null; // Hoặc trả về giao diện mặc định
//     }
//     // if (sent?.filter((el) => el._id !== _id).length === 0) {
//     //     dispatch(ResetSent());
//     // }
//     const isSent = sent?.some((el) => el._id === _id);
//     const handleSendRequest = () => {
//         console.log("Sending friend request...");

//         socket.emit("friend_request", { to: _id, from: user_id }, (error, result) => {
//             if (error) {
//                 console.error("Failed to send friend request:", error);
//             } else {
//                 alert("Request sent successfully");
//                 // setSent(true);

//                 console.log("Friend request sent:", result);
//             }
//         });
//     }
//     const handleCancelSendRequest = () => {
//         console.log("Cancel");


//         socket.emit("cancel_send_request", { to: _id, from: user_id }, (error, result) => {
//             if (error) {
//                 console.error("Failed to cancel friend request:", error);
//             } else {
//                 alert("Cancel request successfully");

//                 // Xóa yêu cầu khỏi `sent`
//                 dispatch(UpdateSent(sent.filter((el) => el._id !== _id)));

//                 // Kiểm tra nếu `sent` rỗng
//                 if (sent.length === 1) {
//                     console.log("No more requests");
//                     // Reset lại trạng thái hoặc thông báo
//                 }
//             }
//         });
//     }
//     return (
//         <StyledChatBox
//             sx={{
//                 width: "100%",
//                 borderRadius: 1,
//                 backgroundColor: theme.palette.background.paper,
//             }}
//             p={2}
//         >
//             <Stack
//                 direction={"row"}
//                 alignItems={"center"}
//                 justifyContent={"space-between"}
//             >
//                 <Stack direction={"row"} alignItems={"center"} spacing={2}>
//                     {" "}
//                     {online ? (
//                         <StyledBadge
//                             overlap="circular"
//                             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                             variant="dot"
//                         >
//                             <Avatar alt={name} src={img} />

//                         </StyledBadge>
//                     ) : (
//                         <Avatar alt={name} src={img} />
//                     )}
//                     <Stack spacing={0.3}>
//                         <Typography variant="subtitle2">{name}</Typography>
//                     </Stack>
//                 </Stack>
//                 <Stack direction={"row"} spacing={2} alignContent={"center"}>
//                     <Button
//                         // disabled={sent}
//                         variant="contained"
//                         color={isSent ? "secondary" : "primary"}
//                         onClick={isSent ? handleCancelSendRequest : handleSendRequest}>

//                         {isSent ? "Cancel" : "Send Request"}
//                     </Button>

//                 </Stack>
//             </Stack>
//         </StyledChatBox>
//     )
// }
const FriendComponent = ({ firstName, lastName, _id, online, img }) => {
    const theme = useTheme();
    const name = `${firstName} ${lastName}`;

    return (
        <StyledChatBox
            sx={{
                width: "100%",
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {" "}
                    {online ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            variant="dot"
                        >
                            <Avatar alt={name} src={img} />

                        </StyledBadge>
                    ) : (
                        <Avatar alt={name} src={img} />
                    )}
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} spacing={2} alignContent={"center"}>
                    <IconButton onClick={() => {
                        //start a new conversation
                        socket.emit("start_conversations", { to: _id, from: user_id });
                    }}>
                        <Chat />
                    </IconButton>
                </Stack>
            </Stack>
        </StyledChatBox>
    )
}
const FriendRequestComponent = ({ firstName, lastName, _id, online, img }) => {
    const theme = useTheme();
    const name = `${firstName} ${lastName}`;
    const [loading, setLoading] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const dispatch = useDispatch();

    const handleAcceptRequest = () => {
        setLoading(true);
        socket.emit("accept_request", { request_id: _id }, (response) => {
            setLoading(false);
            console.log(response)
            if (response.success) {
                setAccepted(true);
                alert("Request accepted!");

                // Gọi lại fetchRequest để cập nhật danh sách
                console.log('Dispatching fetchRequest...');
                dispatch(fecthRequest());

            } else {
                alert("Error accepting request.");
            }
        });
    };

    return (
        <StyledChatBox
            sx={{
                width: "100%",
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    {online ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            variant="dot"
                        >
                            <Avatar alt={name} src={img} />
                        </StyledBadge>
                    ) : (
                        <Avatar alt={name} src={img} />
                    )}
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} spacing={2} alignContent={"center"}>
                    {!accepted ? (
                        <Button
                            onClick={handleAcceptRequest}
                            disabled={loading}
                            variant="contained"
                            color="primary"
                        >
                            {loading ? "Accepting..." : "Accept Request"}
                        </Button>
                    ) : (
                        <Typography variant="body2" color="green">Request Accepted</Typography>
                    )}
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

export { UserComponent, FriendComponent, FriendRequestComponent };