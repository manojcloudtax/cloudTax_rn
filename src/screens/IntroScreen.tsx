import React, { useRef, useState } from "react";
import { StyleSheet, Image, TouchableOpacity, Platform, Dimensions } from "react-native";
import { CtText, CtView, Button } from "../components/UiComponents";
import { defaultColors } from "../utils/defaultColors";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";

const IntroScreen = ({ navigation }: any) => {
    const carousel = useRef<any>(null);
    const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
    const { onBoarding } = useSelector((state: RootState) => state.boardingReducer);
    const [showGetStartedButton, setShowGetStartedButton] = useState<boolean>(false);

    const dispatch = useDispatch();

    const onSkip = () => {
        navigation.navigate('RegisterScreen');
    }

    return (
        <CtView style={styles.container}>
            <CtView style={styles.skipSection}>
                <TouchableOpacity onPress={() => onSkip()}>
                    <CtText style={styles.topSectionTitle}>Skip</CtText>
                </TouchableOpacity>
            </CtView>
            <CtView>
              
            </CtView>
            {!showGetStartedButton ?
                <Button style={styles.button} onPress={() => carousel.current.snapToNext()} buttonText="Next"></Button>
                :
                <Button style={styles.button} onPress={() => onSkip()} buttonText="Get Started"></Button>}
        </CtView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: Platform.OS == "ios" ? 35 : '5%',
        paddingHorizontal: 15,
        justifyContent: 'flex-end'
    },
    sectionImage: {
        justifyContent: 'center',
        marginTop: '15%',
    },
    sectionTitle: {
        justifyContent: 'center',
    },
    skipSection: {
        position: 'absolute',
        top: Platform.OS == "ios" ? 55 : 20,
        right: 15,
        zIndex: 1,
        flex: 0,
    },
    topSectionTitle: {
        textAlign: 'right',
        color: defaultColors.gray,
        fontSize: 18
    },
    image: {
        width: 'auto',
        height: '100%'
    },
    imageSlide: {
        alignSelf: 'center',
        marginBottom: 20
    },
    textHeader: {
        fontWeight: "bold",
        fontSize: 32,
        textAlign: 'center',
        fontFamily: 'Figtree-Bold',
        lineHeight: 34.15
    },
    textDescription: {
        fontWeight: '400',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 60,
        color: defaultColors.gray,
        lineHeight: 17.7
    },
    button: {
        borderRadius: 5
    }
});


export default IntroScreen;
