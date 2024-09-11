import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux';
import { toggleSidebar, updateSidebarType } from "../redux/slices/app";
import { faker } from '@faker-js/faker';
import { Bell, CaretRight, Phone, Prohibit, Star, Trash, VideoCamera } from 'phosphor-react';
import AntSwitch from "./AntSwitch";
const Contact = () => {
 
  const theme = useTheme();
  const dispatch =useDispatch();
  return (
    <div>
        <Box sx={{width: 320, height: "100vh"}}>
          <Stack sx={{height:"100%"}}>
          {/* header */}
            <Box sx={{
              boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
              width:"100%",
              backgroundColor: theme.palette.mode === "Light" ? "#F8FAFF" : theme.palette.background,
            }}>
          <Stack sx={{height:"100%",p:2}} direction="now" alignItems={"center"} justifyContent={'space-between'} spacing={3}>
          <Typography variant="subtitle2">Contact Info</Typography>
          <IconButton onClick={()=>{    
            dispatch(toggleSidebar());
          }}>
            X
          </IconButton>
          </Stack>
            </Box>
            {/* body */}
              <Stack sx= {{height:"100%",position: "relative", flexGrow:1, overflow: "scroll"}} p= {3} spacing={3} >
                <Stack alignItems={"center"} direction={"row"} spacing={2}>
                  <Avatar src={faker.image.avatar()} alt={faker.name.firstName()} sx={{height:64 ,width:64}}/>
                  <Stack spacing={0.5}>
                      <Typography variant='article' fontWeight={600}>
                        {faker.name.fullName()}
                      </Typography>
                      <Typography variant='body2' fontWeight={600}>
                        {'+0398481719'}
                      </Typography>
                  </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
                    <Stack spacing={1} alignItems={"center"}>
                      <IconButton>
                        <Phone/>
                      </IconButton>
                      <Typography variant="overline">
                        voice
                      </Typography>
                    </Stack>
                    <Stack spacing={1} alignItems={"center"}>
                      <IconButton>
                        <VideoCamera/>
                      </IconButton>
                      <Typography variant="overline">
                        Video
                      </Typography>
                    </Stack>
                </Stack>
                <Divider/>
                <Stack spacing={0.5}>
                  <Typography variant ="article">About</Typography>
                  <Typography variant='body2'>Imagination is the only limit</Typography>
                </Stack>
                <Divider/>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                  <Typography>Media, Links & Docs</Typography>
                  <Button onClick={() => {dispatch(updateSidebarType("SHARED"))}} endIcon={<CaretRight/>}>
                    401
                  </Button>

                </Stack>
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                  {[1,2,3].map((el) =>(
                    <Box>
                      <img src={faker.image.food() } alt={faker.name.fullName()}/>
                    </Box>
                  )
                
                )}

                </Stack>
                <Divider/>
                <Stack direction={"row"} alignItems={"center"}  justifyContent={'space-between'}>
                <Stack direction={"row"} alignItems="center" spacing={2}>
                    <Star size={"21"}/>
                    <Typography variant='subtitle2'>Started Messages</Typography>
                </Stack>
                <IconButton onClick={() => {dispatch(updateSidebarType("STARRED"))}}>
                  <CaretRight/>
                </IconButton>
                </Stack>
                <Divider/>
                <Stack direction={"row"} alignItems={"center"}  justifyContent={'space-between'}>
                <Stack direction={"row"} alignItems="center" spacing={2}>
                    <Bell  size={"21"}/>
                    <Typography variant='subtitle2'>Mute Notìications</Typography>
                </Stack>
                <AntSwitch/>
                </Stack>
                <Divider/>
                <Typography>1 group in common</Typography>
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                  <Avatar src={faker.image.avatar()} alt={faker.name.fullName()}></Avatar>
                  <Stack spacing={0.5}>
                    <Typography variant='subtitle2'>Coding Monk</Typography>
                    <Typography variant='caption'> Owl, Parrot, Rabbit, You</Typography>
                  </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                  <Button startIcon={<Prohibit/>} fullWidth variant='outlined'>Bloclk</Button>
                  <Button startIcon={<Trash/>} fullWidth variant='outlined'>Delete</Button>
                </Stack>
              </Stack>
          </Stack>
        </Box>
      
    </div>
  )
}

export default Contact
