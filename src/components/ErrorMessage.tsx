import React from "react";
import { StyleSheet, TextProps } from "react-native";
import { CtText } from "./UiComponents";
import { defaultColors } from '../utils/defaultColors';

interface ErrorMessageProps extends TextProps {
    text: string | null;
}

const ErrorMessage = (props: ErrorMessageProps) => {
    const { text, style } = props;
    if (!text) {
        return null;
    }
    return (
        <CtText style={[styles.error, style]}>{text || 'Error'}</CtText>
    );
}

const styles = StyleSheet.create({
    error: {
        color: defaultColors.error,
        fontSize: 12,
        marginTop: -15,
        marginBottom: 15,
        fontFamily: 'Gilroy-MediumItalic'
    },
});

export { ErrorMessage };
