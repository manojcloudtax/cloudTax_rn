import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    darkTheme: false,
    isExpanded: false,
}

export const themeSlice = createSlice({
    name: "themeSlice",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.darkTheme = action.payload
        }
    },
})

export const {setTheme} = themeSlice.actions;

export default themeSlice.reducer;
