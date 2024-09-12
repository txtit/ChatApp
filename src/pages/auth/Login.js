import { Stack, Typography } from "@mui/material";
import React from "react";

import { Link, Link as RouterLink } from "react-router-dom";
import AuthSocial from "../../sections/auth/AuthSocial";
import LoginForm from "../../sections/auth/LoginForm";
const Login = () => {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Login To Tawk</Typography>
        <Stack direction={"row"} spacing={0.5}>
          <Typography variant="body2">New User?</Typography>
          <Link
            to={"/auth/register"}
            Component={RouterLink}
            variant="subtitle2"
          >
            Create an account
          </Link>
        </Stack>
        {/* LoginForm */}
        <LoginForm />
        {/* Auth Social */}
        <AuthSocial />
      </Stack>
    </>
  );
};

export default Login;
