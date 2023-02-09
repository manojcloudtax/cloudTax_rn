import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    darkTheme: false,
    showBanner: true,
    isExpanded: false,
}

export const themeSlice = createSlice({
    name: "themeSlice",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.darkTheme = action.payload
        },
        setDisplayBanner: (state, action) => {
            state.showBanner = action.payload
        },
        setExpanded: (state, action) => {
            state.isExpanded = action.payload
        }
    },
})

export const {setTheme, setDisplayBanner, setExpanded} = themeSlice.actions;

export default themeSlice.reducer;
