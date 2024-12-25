import React, { useEffect, useRef } from "react";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Slide,
    Stack,
} from "@mui/material";
import { faker } from "@faker-js/faker";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../utils/axios";
import { ResetAudioCallQueue } from "../../redux/slices/audioCall";
import Typography from "../../theme/overrides/Typography";
import { socket } from "../../socket"; // Import socket

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CallDialog = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.app);
    const { this_users } = useSelector((state) => state.app);
    const audioStreamRef = useRef(null);
    const localAudioRef = useRef(null);
    const remoteAudioRef = useRef(null);

    const [callDetails] = useSelector((state) => state.audioCall.call_queue);

    const { token } = useSelector((state) => state.auth);

    const appID = 757848594;
    const server = "wss://webliveroom757848594-api.coolzcloud.com/ws";

    const roomID = callDetails?.roomID;
    const userID = callDetails?.from?._id;
    const userName = callDetails?.userName;

    const zg = new ZegoExpressEngine(appID, server);
    const streamID = callDetails?.streamID;

    const handleDisconnect = (event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        } else {
            dispatch(ResetAudioCallQueue());
            socket?.off("audio_call_accepted");
            socket?.off("audio_call_denied");
            socket?.off("audio_call_missed");

            zg.stopPublishingStream(streamID);
            zg.stopPlayingStream(userID);
            if (audioStreamRef.current) {
                zg.destroyStream(audioStreamRef.current);
            }

            zg.logoutRoom(roomID);

            handleClose();
        }
    };

    useEffect(() => {
        if (!socket) {
            console.error("Socket is undefined!");
        }

        const timer = setTimeout(() => {
            socket.emit("audio_call_not_picked", { to: streamID, from: userID }, () => {
                console.log("Call missed");
            });
        }, 30 * 1000);

        socket.on("audio_call_missed", (data) => {
            console.log("Call missed:", data);
            handleDisconnect();
        });

        socket.on("audio_call_accepted", () => {
            clearTimeout(timer);
        });

        socket.on("audio_call_denied", () => {
            handleDisconnect();
        });

        if (!callDetails?.incoming) {
            socket.emit("start_audio_call", { to: streamID, from: userID, roomID });
        }

        async function fetchToken() {
            try {
                const response = await axiosInstance.post(
                    "/user/generate-zego-token",
                    { userId: userID, room_id: roomID },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                return response.data.token;
            } catch (error) {
                console.error("Error fetching token:", error);
                alert("Lỗi khi lấy token. Vui lòng thử lại.");
            }
        }

        fetchToken().then((this_token) => {
            zg.checkSystemRequirements().then((result) => {
                if (result.webRTC && result.microphone) {
                    zg.loginRoom(roomID, this_token, { userID, userName }, { userUpdate: true })
                        .then(async () => {
                            const localStream = await zg.createStream({
                                camera: { audio: true, video: false },
                            });
                            console.log("Local stream created:", localStream);
                            audioStreamRef.current = localStream;
                            zg.checkSystemRequirements().then((result) => {
                                if (!result.microphone) {
                                    console.error("Microphone is not accessible. Please allow microphone access.");
                                }
                            });

                            if (localAudioRef.current && localStream) {
                                localAudioRef.current.srcObject = localStream;
                                localAudioRef.current
                                    .play()
                                    .then(() => console.log("Local audio playing"))
                                    .catch((error) => {
                                        console.error("Error playing local audio:", error);
                                    });
                            } else {
                                console.error("Local audio element or stream is null");
                            }

                            zg.startPublishingStream(streamID, localStream);

                            zg.on("roomStreamUpdate", (roomID, updateType, streamList) => {
                                if (updateType === "ADD") {
                                    const remoteStream = streamList[0]?.stream;
                                    console.log("Remote stream added:", remoteStream);
                                    if (remoteAudioRef.current && remoteStream) {
                                        remoteAudioRef.current.srcObject = remoteStream;
                                        remoteAudioRef.current.play().catch((error) => {
                                            console.error("Error playing remote audio:", error);
                                        });
                                    } else {
                                        console.error("Remote audio element or stream is null");
                                    }
                                }
                            });
                        })
                        .catch((error) => {
                            console.error("Error logging into room:", error);
                        });
                } else {
                    console.log("Browser does not support WebRTC or microphone.");
                }
            });
        });

        return () => {
            socket?.off("audio_call_accepted");
            socket?.off("audio_call_denied");
            socket?.off("audio_call_missed");
            handleDisconnect();
        };
    }, [callDetails, userID, streamID, roomID, token]);

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleDisconnect}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogContent>
                <Stack direction="row" spacing={24} p={2}>
                    <Stack>
                        <Avatar sx={{ height: 100, width: 100 }} src={faker.image.cats()} />
                        <Typography>{this_users.lastName}</Typography>
                        <audio ref={localAudioRef} controls={false} autoPlay />
                    </Stack>
                    <Stack>
                        <Avatar sx={{ height: 100, width: 100 }} src={faker.image.cats()} />
                        <audio ref={remoteAudioRef} controls={false} autoPlay />
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDisconnect} variant="contained" color="error">
                    End Call
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CallDialog;
