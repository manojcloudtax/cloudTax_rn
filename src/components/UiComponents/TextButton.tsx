import React from "react";

import { StyleSheet } from "react-native";
import { CtView, CtText } from ".";
import { defaultColors } from "../../utils/defaultColors";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const TextButton = ({ description, linkTextColor, linkText, onPress }: any) => {
    const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
    return (
        <CtView style={[styles().container, { justifyContent: description ? "center" : "flex-end" }]}>

            <CtText style={styles(darkTheme).linkDescription}>{description}
                <CtText onPress={onPress} style={[styles(darkTheme).linkTextStyle, { fontSize: description ? 14 : 16, color: linkTextColor }]}> {linkText}</CtText>
            </CtText>
        </CtView>
    );
}


const styles = (isDarkTheme?: boolean) => StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
    },
    linkDescription: {
        fontSize: 16,
        color: isDarkTheme? defaultColors.whiteGrey : defaultColors.secondaryTextColor,
        fontWeight: '400'
    },
    linkTextStyle: {
        fontSize: 16,
        fontWeight: '600'
    }
});

export { TextButton };