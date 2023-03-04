import React from "react";
import { StyleSheet, View} from "react-native";
import { defaultColors } from "../utils/defaultColors";
import Modal from "react-native-modal";
import { RootState } from "../store";
import { useSelector } from "react-redux";

interface Props {
  isShowModal: boolean
  ChildView: any
  onBackdropPress: any
}

const CommonModal = (props: Props ) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <Modal
      isVisible={props.isShowModal}
      style={styles.container}
      backdropOpacity={0.4}
      onBackdropPress={props.onBackdropPress}
      avoidKeyboard
      useNativeDriver={true} 
    >
      <View
        style={{
          height: "auto",
          width: "100%",
          backgroundColor: defaultColors.transparent,
        }}
      >
        <View
          style={{
            height: 5,
            width: "100%",
            marginBottom: 10,
            backgroundColor: defaultColors.transparent,
            justifyContent: "center",
            alignItems: 'center'
          }}
        >
          <View
            style={{
              height: 5,
              width: 50,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 100
            }}
          />
        </View>
        <View
          style={{
            height: 'auto',
            width: "100%",
            backgroundColor: darkTheme ? defaultColors.matBlack : defaultColors.white,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }}
        >
          {props.ChildView} 
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    margin: 0,
  },
});

export { CommonModal };
