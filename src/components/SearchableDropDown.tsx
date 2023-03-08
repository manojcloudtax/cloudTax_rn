import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { defaultColors } from "../utils/defaultColors";
import { OCRListItem } from "./OCRListItem";
import { CustomInput } from "./CustomInput";
import { useSelector } from "react-redux";
import { RootState } from "../store";
const SearchableDropDown = ({
  value,
  placeholder,
  onChangeText,
  onSubmit,
  drawerItems,
  onSelectListItem,
  onFocus,
  isShowDropDown,
}: any) => {

const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <View style={styles().container}>
      <CustomInput
        value={value}
        editable={true}
        placeholder={"Search"}
        placeholderTextColor={defaultColors.gray}
        onChangeText={(email: string) => onChangeText(email)}
        onBlur={onSubmit}
        onFocus={onFocus}
        autoCapitalize="none"
        isHideBottom={true}
        customImage={
          darkTheme
            ? require("../../assets/search.png")
            : require("../../assets/search.png")
        }
      />
      {(isShowDropDown !== undefined && isShowDropDown) ? (
        <View
          style={{
            maxHeight: 250,
            // borderWidth: darkTheme?  1 : 1.5,
            borderColor: defaultColors.borderColor,
          }}
        >
          <FlatList
            data={drawerItems}
            renderItem={({ item, index }) =>
              renderDropDownList({ item, index, onSelectListItem, darkTheme })
            }
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  );
};

const renderDropDownList = ({ item, index, onSelectListItem, darkTheme }: any) => {
  // console.log("renderDropDownList", item);
  return (
    <TouchableOpacity
      style={{
        height: 50,
        // borderTopWidth: 1,
        backgroundColor: defaultColors.transparent,
        justifyContent: "center",
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: darkTheme?  1 : 1.5,
        borderColor: darkTheme ? defaultColors.darkBorder : "#DADADA",
        // borderRadius: 10,
      }}
      onPress={() => onSelectListItem(item)}
    >
      <OCRListItem value={item.name} boxNumber={item.id} />
    </TouchableOpacity>
  );
};
const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    container: {
      height: "auto",
      backgroundColor: isDarkTheme
        ? defaultColors.darkBorder
        : defaultColors.transparent,
      borderRadius: 10,
    },
  });
export default SearchableDropDown;
