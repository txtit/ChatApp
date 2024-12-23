import { Container, Stack } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Logo from "../../assets/Images/logo.ico";
import { useSelector } from "react-redux";

const MainLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const user_id = window.localStorage.getItem("user_id");
  console.log(user_id)
  const this_users = useSelector((state) => state.app);
  if (isLoggedIn) {
    // Nếu cần mở tab mới trước, thực hiện điều này

    if (window.location.host !== "localhost:5173") {
      // Mở tab mới trên FE 5173
      window.open(`http://localhost:5173/#loaded/${user_id}`, "_blank");
      // window.location.href = `http://localhost:5173/#loaded/${user_id}`;
      return <Navigate to={'/app'} />;

    }

    // Sau đó, trả về điều hướng tới ứng dụng chính
  }
  // if (isLoggedIn) {
  //   // if (!window.location.hash) {
  //   // }
  // }
  return (
    <>
      <Container sx={{ mt: 5 }} maxWidth="sm">
        <Stack spacing={5}>
          <Stack sx={{ width: "100%" }} direction={"column"} alignItems={"center"}>
            <img style={{ height: 120, width: 120 }} src={Logo} alt="Logo" />
          </Stack>

        </Stack>


        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
