import { Stack, Typography } from "@mui/material";
import React from "react";
import VerifyForm from "../../sections/auth/VerifyForm";

const Verify = () => {
    return (
        <>
            <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
                <Typography variant="h4" >verify OTP</Typography>

                <Stack spacing={0.5}>
                    <Typography variant="body2">
                        Sent to email (thao16068@gmail.com)
                    </Typography>
                </Stack>
                <VerifyForm />

            </Stack>
        </>
    )
};

export default Verify;