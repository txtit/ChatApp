import React, { useCallback } from 'react'
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from '../../components/hook-form/FormProvider'
import { Alert, Avatar, Button, Stack } from '@mui/material';
import { RHFTextField } from '../../components/hook-form';
import { useSelector } from 'react-redux';

const ProfileForm = () => {

    const LoginSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        about: Yup.string().required('About is requied'),
        avatarUrl: Yup.string().required("Avatar is required").nullable(true),
    });


    const defaultValues = {
        name: "",
        about: "",
    };

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setError,
        setValue,
        handleSubmit,
        formState: { errors },
    } = methods;

    const values = watch();
    const handleDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file)
        })
        if (file) {
            setValue('avatarUrl', newFile, { shouldValidate: true })
        }
    })
    const { conversations = [] } = useSelector((state) => state.conversation?.direct_chat || {});
    const { room_id } = useSelector((state) => state.app);
    // dispatch(RemoveAllDirectMessage());


    const current = conversations.find((el) => el?.id === room_id);

    const onSubmit = async (data) => {
        try {
            console.log('data: ', data);
            // submit data to backend
            // dispatch(LoginUser(data));
        } catch (error) {
            console.error(error);
            reset();
            setError("afterSubmit", {
                ...error,
                message: error.message,
            });
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <Stack direction={'row'} justifyContent={'center'}>
                    <Avatar
                        src={current?.img}
                        alt={current?.name}
                        sx={{
                            height: 64,
                            width: 64,
                            display: "flex", // Bắt buộc để alignItems hoạt động
                            alignItems: "center", // Căn giữa theo trục dọc
                            justifyContent: "center", // Căn giữa theo trục ngang
                            cursor: "pointer", // Con trỏ dạng pointer
                        }}
                    />
                </Stack>

                <Stack spacing={3}>
                    {!!errors.afterSubmit && (
                        <Alert severity="error">{errors.afterSubmit.message}</Alert>
                    )}
                    <RHFTextField name="name" label="Name" helperText={'This name is visbile to your contacts'} />
                    <RHFTextField multiline rows={3} maxRows={5} name={'about'} label='About' />
                </Stack>
                <Stack direction={'row'} justifyContent={'end'}>
                    <Button color='primary' size='large' type='submit' variant='outlined'>
                        Save
                    </Button>
                </Stack>
            </Stack>
        </FormProvider>
    )
}

export default ProfileForm
