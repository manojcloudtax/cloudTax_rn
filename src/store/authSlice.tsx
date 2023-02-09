import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userToken: null,
    user: null,
    status: null,
    email: null,
    password: null,
    refreshToken: null,
    img_url: null,
}

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,

    reducers: {
        login: (state, action) => {
            state.userToken = action.payload.token;
            state.refreshToken = action.payload.refresh;
            state.email = action.payload.email;
            state.password = action.payload.password;
        },
        register: (state, action) => {
            state.userToken = action.payload.token;
            state.email = action.payload.email;
            state.password = action.payload.password;
            state.refreshToken = action.payload.refresh;
        },
        imageUpload: (state, action) => {
            state.img_url = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        resetState: () => {},
    },
})

export const {login, register, setUser, imageUpload, resetState} = authSlice.actions

export default authSlice.reducer;
