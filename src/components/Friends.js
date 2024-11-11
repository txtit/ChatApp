import React, { useState } from "react";
import { useTheme, styled } from "@mui/material/styles";
import { borderRadius, Stack, width } from "@mui/system";
import StyledBadge from "./StyledBadge";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { socket } from "../socket";
import { Chat } from "phosphor-react";



const StyledChatBox = styled(Box)(({ theme }) => ({
    "&:hover": {
        cursor: "pointer",
    },
}));
const user_id = window.localStorage.getItem("user_id");

const UserComponent = ({ firstName, lastName, _id, online, img }) => {
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
                    <Button onClick={() => {
                        console.log("Sending friend request...");
                        socket.emit("friend_request", { to: _id, from: user_id }, (error, result) => {
                            if (error) {
                                console.error("Failed to send friend request:", error);
                            } else {
                                alert("Request sent successfully");
                                console.log("Friend request sent:", result);
                            }
                        });
                    }}>
                        Send Request
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    )
}
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
const FriendRequestComponent = ({ firstName, lastName, _id, online, img, id }) => {
    const theme = useTheme();
    const name = `${firstName} ${lastName}`;
    const [loading, setLoading] = useState(false);
    const [accepted, setAccepted] = useState(false);

    const handleAcceptRequest = () => {
        setLoading(true);
        socket.emit("accept_request", { request_id: _id }, (response) => {
            setLoading(false);
            console.log(response);
            if (response.success) {
                setAccepted(true);
                alert("Request accepted!");
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