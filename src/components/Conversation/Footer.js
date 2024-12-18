import React, { useRef, useState } from "react";
import { Box, Fab, IconButton, InputAdornment, Stack, TextField, Tooltip } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles"
import { Camera, File, Image, LinkSimple, Smiley, Sticker, TelegramLogo, User } from "phosphor-react";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import { AddDirectMessage, FetchCurrentMessages, fetchDirectConversationsAction, UpdateDirectConversations } from "../../redux/slices/coversation";


const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#1b8cfe",
    icon: <Sticker size={24} />,
    y: 172,
    title: "Stickers",
  },
  {
    color: "#0172e4",
    icon: <Camera size={24} />,
    y: 242,
    title: "Image",
  },
  {
    color: "#0159b2",
    icon: <File size={24} />,
    y: 312,
    title: "Document",
  },
  {
    color: "#013f7f",
    icon: <User size={24} />,
    y: 382,
    title: "Contact",
  },
];


const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingTopBottom: "12px",
  }
}));
const ChatInput = ({ openPicker, setOpenPicker, setValue, value, inputRef, handleSendMessage }) => {
  const [openActions, setOpenActions] = useState(false);
  return (
    <StyledInput
      inputRef={inputRef}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSendMessage();
        }
      }}
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: 'max-content' }}>
            <Stack sx={{
              position: "relative",
              display: openActions ? "inline-block" : "none"
            }}>
              {Actions.map((el, idx) => (
                <Tooltip key={idx} placement="right" title={el.title}>
                  <Fab
                    onClick={() => {
                      setOpenActions(!openActions);
                    }}
                    sx={{
                      position: "absolute",
                      top: -el.y,
                      backgroundColor: el.color
                    }}
                    aria-label="add"
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>

            <InputAdornment position="start">
              <IconButton onClick={() => {
                setOpenActions((prev) => !prev);
              }}>
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: <InputAdornment position="end">
          <IconButton onClick={() => {
            setOpenPicker((prev) => !prev);
          }}>
            <Smiley />
          </IconButton>
        </InputAdornment>

      }} />
  )
}
function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
}

function containsUrl(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
}

const Footer = () => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const { conversations = [] } = useSelector((state) => state.conversation.direct_chat);

  const user_id = window.localStorage.getItem("user_id");

  // const isMobile = useResponsive("between", "md", "xs", "sm");

  const { sidebar, room_id } = useSelector((state) => state.app);

  const [openPicker, setOpenPicker] = React.useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
        emoji +
        value.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  const current = conversations.find((el) => el?.id === room_id);
  const handleSendMessage = () => {
    const newMessage = {
      message: linkify(value),
      conversation_id: room_id,
      from: user_id,
      to: current?.user_id,
      type: containsUrl(value) ? "Link" : "Text"
    };
    socket.emit("text_message", newMessage, (response) => {
      console.log("server response", response);
      // dispatch(AddDirectMessage({ message: newMessage }));
      dispatch(UpdateDirectConversations({ conversation: current, message: newMessage }));
      // socket.emit("start_conversations", { to: current?.user_id, from: user_id });
    });
    console.log("to", newMessage);

    setValue("")
  }
  return (
    <Box
      p={2}
      sx={{
        height: 100,
        width: "100%",
        backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)"

      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={3}>
        <Stack sx={{ width: "100%" }} >
          {/* chatinput */}
          <Box sx={{
            display: openPicker ? "inline" : "none",
            zIndex: 10,
            position: "fixed",
            bottom: 81,
            right: 100,
          }}>
            <Picker
              theme={theme.palette.mode}
              data={data}
              onEmojiSelect={(emoji) => {
                handleEmojiClick(emoji.native);
              }}
            />

          </Box>
          <ChatInput
            inputRef={inputRef}
            value={value}
            setValue={setValue}
            openPicker={openPicker}
            setOpenPicker={setOpenPicker}
            handleSendMessage={handleSendMessage} />
        </Stack>
        <Box sx={{
          height: 48,
          width: 48,
          backgroundColor: theme.palette.primary.main,
          borderRadius: 1.5
        }}
        >
          <Stack sx={{
            height: "100%",
            width: "100%"
          }}
            alignItems={"center"}
            justifyContent={"center"}>

            <IconButton
              onClick={handleSendMessage}>
              <TelegramLogo color="#fff" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>

  )
}

export default Footer;