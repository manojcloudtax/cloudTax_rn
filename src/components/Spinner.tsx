import React from "react";
import { StyleSheet, ActivityIndicator, ActivityIndicatorProps } from "react-native";
import { CtView } from "./UiComponents";
import { useSelector } from "react-redux";
import { RootState } from '../store';
import { defaultColors } from '../utils/defaultColors';

interface SpinnerProps extends ActivityIndicatorProps {
}

const Spinner = (props: SpinnerProps) => {
    const { size, style } = props;
    const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
    return (
        <CtView style={[styles.container, style]}>
            <ActivityIndicator color={darkTheme ? defaultColors.black : defaultColors.black} size={size || 'large'} />
        </CtView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export { Spinner };