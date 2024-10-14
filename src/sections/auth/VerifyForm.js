import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/hook-form";
import { Button, Stack } from "@mui/material";
import RHFCode from "../../components/hook-form/RHFCodes";
import { VerifyEmail } from "../../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";

const VerifyForm = () => {
    const verifyCodeSchema = Yup.object().shape({
        code1: Yup.string().required("code is required"),
        code2: Yup.string().required("code is required"),
        code3: Yup.string().required("code is required"),
        code4: Yup.string().required("code is required"),
        code5: Yup.string().required("code is required"),
        code6: Yup.string().required("code is required"),
    });
    const dispacth = useDispatch();
    const { email } = useSelector((state) => state.auth);


    const defaultValues = {
        code1: "",
        code2: "",
        code3: "",
        code4: "",
        code5: "",
        code6: "",
    };

    const methods = useForm({
        mode: onchange,
        resolver: yupResolver(verifyCodeSchema),
        defaultValues
    });

    const { handleSubmit, formState } = methods;

    const onSubmit = async (data) => {

        try {

            // sendApi submit verify
            dispacth(VerifyEmail({
                email,
                otp: `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}${data.code6}`
            }));

        } catch (error) {
            console.log(error);
        }
    };





    return (

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <RHFCode
                    keyName="code"
                    inputs={["code1", "code2", "code3", "code4", "code5", "code6"]}
                />

                <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{
                        mt: 3,
                        bgcolor: "text.primary",
                        color: (theme) =>
                            theme.palette.mode === "light" ? "common.white" : "grey.800",
                        "&:hover": {
                            bgcolor: "text.primary",
                            color: (theme) =>
                                theme.palette.mode === "light" ? "common.white" : "grey.800",
                        },
                    }}
                >
                    Verify
                </Button>
            </Stack>
        </FormProvider>

    );
}

export default VerifyForm;