import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { defaultColors } from '../../utils/defaultColors';
import {CtView, CtTextInput} from '../UiComponents';
import { Ionicons, Feather } from '@expo/vector-icons';

const CustomeTextInput = ({ showLeftIcon, secureTextEntry, placeholder, onChange, onBlur}: any) => {
    const { darkTheme } = useSelector((state: RootState) => state.themeReducer);

    const renderIcon = () => {
        return (
            <CtView style={styles().inputIcon}>
                
            </CtView>
        )
    };
    return (
        <CtView style={styles().textInputContainer}>
        {/* <CtView style={styles().inputIcon2}> */}
        {showLeftIcon  ?
       renderIcon()
       :
       null}
        {/* </CtView> */}
        <CtTextInput
            testID={'private'}
            editable={true}
            placeholder={placeholder}
            placeholderTextColor={defaultColors.gray}
            secureTextEntry={secureTextEntry}
            style={styles().inputAlt}
            onChange={onChange}
            onBlur={onBlur}
        />
        {/* {!!confirmPassword && renderEyeIcon(false)}
        {!!confirmPassword ? showConfrimPasswordCheck && renderCheckIcon() : null} */}
    </CtView>
    );
};

const styles = (isDarkTheme?: boolean) => StyleSheet.create({
    textInputContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputIcon2: {
        flex: 0,
        position: 'absolute',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        left: 12,
        top: 15
    },
    iconStyle: {
        fontSize: 20,
        color: defaultColors.gray
    },inputAlt: {
        borderWidth: 1,
        borderColor: '#DADADA',
        backgroundColor: 'transparent',
        marginTop: 0,
        padding: 15,
        paddingLeft: 42,
        marginBottom: 24,
        borderRadius: 8,
        width: '100%',
        fontFamily: 'Figtree-Medium'
    },inputIcon: {
        flex: 0,
        position: 'absolute',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        right: 12,
        top: 15
    },

});

export { CustomeTextInput };
