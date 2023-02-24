import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    onBoarding: true,
    onBoardingData: {}
}

export const onBoardingSlice = createSlice({
    name: "onBoardingSlice",
    initialState,
    reducers: {
        setOnBoarding: (state, action) => {
            state.onBoarding = action.payload
        },
        setOnBoardingData: (state, action) => {
            console.log("setOnBoardingData",action.payload);
            state.onBoardingData = action.payload
        },
        resetOnBoardingData: (state) => {
            state.onBoarding = true;
            state.onBoardingData = {}
        },
    },
})

export const { setOnBoarding, setOnBoardingData, resetOnBoardingData } = onBoardingSlice.actions;

export default onBoardingSlice.reducer;
