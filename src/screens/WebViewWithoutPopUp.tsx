import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { WebView } from "react-native-webview";

const WebViewWithoutPopUp = ({ navigation, route }: any) => {
  const [url, setUrl] = useState("");
  useEffect(() => { 
    try {
      if (route.params !== undefined) {
        const { url } = route.params;
        setUrl(url);
      }
    } catch (error) {}
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={styles.modalContainer}>
        <WebView style={{ flex: 1 }} source={{ uri: url }} />
      </View>
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
