import { Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { toggleSidebar, updateSidebarType } from "../redux/slices/app";
import { Backspace } from "phosphor-react";




const SharredMessages = () => {
  const theme = useTheme();
  const dispatch =useDispatch();


    return (
       <Box sx={{width:320, height: "100vh"}}>
            <Stack sx={{height:"100%"}}>
                 {/* header */}
            <Box sx={{
              boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
              width:"100%",
              backgroundColor: theme.palette.mode === "Light" ? "#F8FAFF" : theme.palette.background,
            }}>
          <Stack sx={{height:"100%",p:2}} direction="now" alignItems={"center"} justifyContent={'space-between'} spacing={3}>
          <IconButton onClick={()=>{    
            dispatch(updateSidebarType("CONTACT"));
          }}>
            <Backspace/>
          </IconButton>
          <Typography variant="subtitle2">Media</Typography>
       
          </Stack>
            </Box>
            </Stack>
       </Box>
    )
}

export default SharredMessages;