import React, { useState } from "react";
import { StyleSheet, TextInputProps, Image, TouchableOpacity, View, Alert, Modal, Platform } from "react-native";
import { CtView, CtTextInput, CtText } from "./UiComponents";
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { defaultColors } from '../utils/defaultColors';
import { MaterialIcons } from '@expo/vector-icons';
import { SortOptions } from "../types";
interface SearchProps extends TextInputProps {
    selectedValue?: SortOptions;
    showFilterButton: boolean;
    onSortSelectionChanged?: (option: SortOptions) => void;
}
const Search = (props: SearchProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { darkTheme } = useSelector((state: RootState) => state.themeReducer);

    const ListItem = ({ itemName, onPress, selected }: { itemName: string, onPress: () => void, selected: boolean }) => {
        return (
            <CtView style={styles().item}>
                <TouchableOpacity style={styles().itemContainer} onPress={onPress}>
                    {/* {selected && <Image
                        style={styles().checkIcon}
                        source={darkTheme ? require('../assets/check-black.png') : require('../assets/check.png')}
                    />} */}
                    {!selected && <View
                        style={styles().checkIcon}
                    />}
                    <CtText
                        style={{ color: darkTheme ? defaultColors.black : defaultColors.white }}>
                        {itemName}
                    </CtText>
                </TouchableOpacity>
            </CtView>
        )
    }

    const renderListItems = () => {
        const items = [];
        for (let item in SortOptions) {
            items.push(
                <ListItem
                    key={item.toLocaleLowerCase()}
                    selected={props.selectedValue === item.toLowerCase()}
                    itemName={`Sort by ${item.toLowerCase()}`}
                    onPress={() => props.onSortSelectionChanged(item as SortOptions)}
                />);
        }
        return items;
    }

    return (
        <CtView style={styles(darkTheme).container}>
            <CtView style={styles().logoContainer}>
                {/* <Image style={styles().icon} source={require('../assets/magnifier.png')} /> */}
            </CtView>
            <CtView style={styles().searchContainer}>
                <CtTextInput
                    editable={true}
                    placeholder={'Search expenses'}
                    style={styles().input}
                    {...props}
                />
            </CtView>
            {props.showFilterButton && <CtView style={styles().logoContainer}>
                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                    {/* <Image style={styles().icon} source={require('../assets/filterIcon.png')} /> */}
                </TouchableOpacity>
            </CtView>}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setModalVisible(!modalVisible)}
                    style={{ flex: 1 }}
                >
                    <View style={styles().centeredView}>
                        <View
                            style={[styles().modalView,
                            {
                                shadowColor: darkTheme ? defaultColors.white : defaultColors.black,
                                backgroundColor: darkTheme ? defaultColors.white : defaultColors.black
                            }]}
                        >
                            <MaterialIcons style={[styles().arrow, { color: darkTheme ? defaultColors.white : defaultColors.black }]} name="arrow-drop-up" />
                            {renderListItems()}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </CtView>
    );
}


const styles = (isDarkTheme?: boolean) => StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: Platform.OS == 'android' ? 6 : 10,
        marginBottom: 10,
        borderColor: isDarkTheme ? defaultColors.matBlack : defaultColors.whiteGrey
    },
    logoContainer: {
        flex: 0,
        justifyContent: 'center',
        paddingHorizontal: 7
    },
    searchContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        paddingHorizontal: 5,
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    icon: {
        height: 18,
        width: 18,
    },
    centeredView: {
        flex: 1,
        alignItems: "center",
        marginTop: Platform.OS === 'android' ? 55 : 90
    },
    arrow: {
        position: 'absolute',
        right: 5,
        top: -23,
        fontSize: 40,
        shadowOpacity: 0.25,
        elevation: 5
    },
    modalView: {
        marginTop: 70,
        marginRight: 15,
        alignSelf: 'flex-end',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    item: {
        flex: 0,
        backgroundColor: 'transparent',
        alignSelf: 'flex-start',
        paddingVertical: 5,
        fontWeight: "100",
    },
    itemContainer: {
        flexDirection: 'row',
    },
    checkIcon: {
        width: 14,
        height: 10,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: 10
    }
});

export { Search };
