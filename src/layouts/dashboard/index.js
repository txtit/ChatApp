import { Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React  from "react";
import { Outlet } from "react-router-dom";



import SideBar from "./SideBar";



const DashboardLayout = () => {
  // gettheme
  const theme = useTheme();
 

  console.log(theme);

  

  return (
    <Stack direction={"row"}>
      {/* //  sidebar */}

     <SideBar/>
     

      <Outlet />

    </Stack>
    
  );
};

export default DashboardLayout;
