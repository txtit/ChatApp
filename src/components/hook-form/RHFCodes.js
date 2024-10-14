import { TextField } from "@mui/material";
import { spacing, Stack } from "@mui/system";
import React, { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

const RHFCode = ({ keyName = "", inputs = [], ...other }) => {

    const codesRef = useRef(null);
    const { control } = useFormContext();
    const handleChangeWithNextField = (event, handleChange) => {
        const { maxLength, value, name } = event.target;
        const fieldIndex = name.replace(keyName, "");
        const fieldIntIndex = Number(fieldIndex);
        const nextField = document.querySelector(`input[name=${keyName}${fieldIntIndex + 1}]`);
        const preField = document.querySelector(`input[name=${keyName}${fieldIntIndex - 1}]`);

        if (value.length > maxLength) {
            event.target.value = value[0];
        }
        if (value.length >= maxLength && fieldIntIndex < 6 && nextField !== null) {
            nextField.focus();
        }

        // Handle Backspace key press (move to the previous field)
        if (event.key === "Backspace" && value === "" && preField !== null) {
            preField.focus();
        }
        handleChange(event);
    }
    return (
        <Stack
            direction={"row"}
            spacing={2}
            justifyContent={"center"}
            ref={codesRef}
        >
            {inputs.map((name, index) => (
                <Controller
                    key={name}
                    name={`${keyName}${index + 1}`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            error={error}
                            autoFocus={index === 0}
                            placeholder={"-"}
                            onChange={(event) => {
                                //
                                handleChangeWithNextField(event, field.onChange);
                            }}
                            onKeyDown={(event) => handleChangeWithNextField(event, field.onChange)}  // Also capture Backspace
                            onFocus={(event) => event.currentTarget.select()}
                            InputProps={{
                                sx: {
                                    width: { xs: 36, sm: 56 },
                                    height: { xs: 36, sm: 56 },
                                    '& input': { p: 0, textAlign: "center" }

                                }
                            }}
                            inputProps={{
                                maxLength: 1,
                                type: "number",

                            }}
                            {...other}
                        />
                    )}
                />
            ))}
        </Stack>
    );
};

export default RHFCode;
