import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";
import { Header } from "../components/Header";
import { RootState } from "../store";

const WebViewWithoutPopUp = ({ navigation, route }: any) => {
  const [url, setUrl] = useState("");
  const webviewRef = useRef(null);
  const [isFromEstimatedScreen, setEstimatedScreen] = useState(false);
  const [isManualUpdate, setisManualUpdate] = useState(false);
  const { savedUserData } = useSelector(
    (state: RootState) => state.authReducer
  );
  useEffect(() => {
    try {
      if (route.params !== undefined) {
        const { url, isFromEstimated, isFromManualUpdate } = route.params;
        setUrl(url);
        setEstimatedScreen(isFromEstimated);
        setisManualUpdate(isFromManualUpdate);
      }
    } catch (error) {}
  }, []);

  const onBackButtonPress = () => {
    if (isFromEstimatedScreen) {
      navigation.navigate("EstimatedScreen");
    } else if (isManualUpdate) {
      navigation.navigate("SummaryScreen");
    } else {
      navigation.goBack();
    }
  };

  const onMessageReceive = (eventDataString: any) => {
    try {
      let eventData = JSON.parse(eventDataString.nativeEvent.data);
      if (eventData.action === "add-new-account") {
        navigation.navigate("UserNameScreen", { savedUser: savedUserData });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header onPressbackButton={() => onBackButtonPress()} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View style={styles.modalContainer}>
          <WebView
            // javaScriptCanOpenWindowsAutomatically={true}
            ref={webviewRef}
            style={{ flex: 1 }}
            source={{ uri: url }}
            onMessage={(event) => {
              onMessageReceive(event);
              console.log("Received message from web page:", event);
            }}
            injectedJavaScript={`
        window.addEventListener('message', (event) => {
          window.ReactNativeWebView.postMessage(event.data);
        });
      `}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "green",
    width: "100%",
    flex: 1,
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: "center",
  },
});

export default WebViewWithoutPopUp;
