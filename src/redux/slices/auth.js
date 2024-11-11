import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { showSnackBar } from "./app";
const initialState = {
    isLoggedIn: false,
    token: "",
    isLoading: false,
    email: "",
    error: false
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateIsLoading(state, action) {
            state.error = action.payload.error;
            state.isLoading = action.payload.isLoading;
        },
        logIn(state, action) {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
        },
        logOut(state, action) {
            state.isLoggedIn = false;
            state.token = "";
        },
        registerUser(state, action) {
            state.email = action.payload.email;
        }

    }

});


//reducer
export default slice.reducer;

// Log in 
export function LoginUser(formValues) {
    //formValues email, password
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
        await axios.post("auth/login", {
            ...formValues,
        },

            {
                headers: {
                    "Content-Type": "application/json",
                },
            }

        ).then(function (response) {
            console.log(response);
            dispatch(
                slice.actions.logIn({
                    isLoggedIn: true,
                    token: response.data.token,
                })
            );
            window.localStorage.setItem("user_id", response.data.user_id);

            dispatch(showSnackBar({ severity: "success", message: response.data.message }))
            dispatch(
                slice.actions.updateIsLoading({ isLoading: false, error: false })
            );
        }).catch(function (err) {
            dispatch(showSnackBar({ severity: "error", message: err.message }));
            dispatch(
                slice.actions.updateIsLoading({ isLoading: false, error: true })
            );
            console.log(err);
        });
    }
}

//Log out
export function LogoutUser() {
    return async (dispatch, getState) => {
        dispatch(slice.actions.logOut())
        window.localStorage.removeItem("user_id");

    }
}

// forgot password 
export function ForgotPassword(formValues) {
    return async (dispatch, getState) => {
        await axios.post("/auth/forgot-password", {
            ...formValues
        },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log(err);
        })
    }
}


// new password 
export function NewPassword(formValues) {
    return async (dispatch, getState) => {
        axios.post("/auth/reset-password", {
            ...formValues,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        })
    }
}


//register 
export function RegisterUser(formValues) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

        axios.post("/auth/register", {
            ...formValues,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            console.log(response);
            dispatch(slice.actions.registerUser({ email: formValues.email }));
            dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
        }).catch((error) => {
            console.log(error);
            dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));

        }).finally(() => {
            // auth k co loi
            if (!getState().auth.error) {
                window.location.href = "/auth/verify-otp";

            }
        })
    }
}

//verify
export function VerifyEmail(formValues) {
    return async (dispatch, getState) => {
        axios.post("/auth/verify", {
            ...formValues,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            console.log(response);
            dispatch(slice.actions.logIn({
                isLoggedIn: true,
                token: response.data.token,
            }));
            window.localStorage.setItem("user_id", response.data.user_id);
        }).catch((error) => {
            console.log(error);
        })
    }
}