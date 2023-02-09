import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    onBoarding: true,
}

export const onBoardingSlice = createSlice({
    name: "onBoardingSlice",
    initialState,
    reducers: {
        setOnBoarding: (state, action) => {
            state.onBoarding = action.payload
        },
    },
})

export const { setOnBoarding } = onBoardingSlice.actions;

export default onBoardingSlice.reducer;
