import React from "react";

import { StyleSheet } from "react-native";
import { CtView, CtText } from ".";

const TextButton = ({ description, linkTextColor, linkText, onPress }: any) => {
    return (
        <CtView style={[styles.container, { justifyContent: description ? "center" : "flex-end" }]}>

            <CtText style={styles.linkDescription}>{description}
                <CtText onPress={onPress} style={[styles.linkTextStyle, { fontSize: description ? 14 : 16, color: linkTextColor }]}> {linkText}</CtText>
            </CtText>
        </CtView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
    },
    linkDescription: {
        fontSize: 16,
        color: 'rgba(26, 38, 58, 0.7)',
        fontWeight: '400'
    },
    linkTextStyle: {
        fontSize: 16,
        fontWeight: '600'
    }
});

export { TextButton };