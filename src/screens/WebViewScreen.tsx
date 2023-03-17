import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { WebView } from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import _ from "lodash";
import { Header } from "../components/Header";

const WebViewScreen = ({ navigation, route }: any) => {
  const { getSavedLoggedInData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const [url, setUrl] = useState("");
  const [isLoaded, setisLoaded] = useState(false);
  useEffect(() => {
    try {
      if (route.params !== undefined) {
        const { url } = route.params;
        setUrl(url);
        setisLoaded(false);
      }
    } catch (error) {}
  }, []);

  const onNavigationStateChange = async (webViewState: any) => {
    console.log("onNavigationStateChange webViewState", webViewState);
    //   var regex = /[?&]([^=#]+)=([^&#]*)/g,
    // var params: any;
    //   match;
    // while ((match = regex.exec(webViewState.url))) {
    //   params[match[1]] = match[2];
    // }
    //   var regexp = /[?&]([^=#]+)=([^&#]*)/g,params = {},check;
    // while (check = regexp.exec(webViewState.url)) {
    //   params[check[1]] = check[2];
    // }
    // var regex = /[?&]([^=#]+)=([^&#]*)/g,
    //   params: any = {},
    //   match;
    // while (match = regex.exec(url)) {
    //   params[match[1]] = match[2];
    // }

    var regexp = /[?&]([^=#]+)=([^&#]*)/g,
      params: any = {},
      check;
    while ((check = regexp.exec(webViewState.url))) {
      params[check[1]] = check[2];
    }

    console.log("params", params);

    if (
      !_.isEmpty(params) &&
      // webViewState.url.startsWith("https://app.cloudtax.ca/ct_2022/")
      webViewState.url.startsWith("https://app.cloudtax.ca/2022/")
    ) {
      // console.log(
      //   "Hello GetTDDNetfileRes",
      //   savedUserData,
      //   getSavedLoggedInData,
      //   params.t
      // );
      const encodednew = decodeURIComponent(params.t)

      // var encoded = base64.decode(params);
      // console.log("params encoded", encoded);
      console.log("params encodednew", encodednew);
      navigation.navigate("CRADetailsScreen", {
        data : [],
        t: encodednew
      });
      // if(isLoaded){
      //   return;
      // }
      // setisLoaded(true);
      // const GetTDDNetfileRes = await GetTDDNetfile(
      //   {
      //     TaxID: getSavedLoggedInData?.TaxID,
      //     AcctID: savedUserData?.AcctID,
      //     TaxPayerID: savedUserData?.TaxPayerID,
      //     Year: 2022,
      //     token: params.t,
      //     year: 2022,
      //     appType: "FREE",
      //     saveData: true,
      //   },
      //   savedUserData?.token
      // );
      // console.log("Hello GetTDDNetfileRes", savedUserData, GetTDDNetfileRes);
      // if (GetTDDNetfileRes) {
      //   if (GetTDDNetfileRes.ErrCode == -1) {
      //     console.log("GetTDDNetfileRes else");
      //   } else {
      //     // navigation.goback();

      //     const GetSlipsfileRes = await GetSlips(
      //       {
      //         TaxID: getSavedLoggedInData?.TaxID,
      //         AcctID: savedUserData?.AcctID,
      //         TaxPayerID: savedUserData?.TaxPayerID,
      //         Year: 2022,
      //         year: 2022,
      //       },
      //       savedUserData?.token);
      //     console.log("Hello GetSlipsfileRes",GetSlipsfileRes);
      //     if (GetSlipsfileRes) {
      //       if (GetSlipsfileRes.ErrCode == -1) {
      //         console.log("GetSlipsfileRes else");
      //       } else if(GetSlipsfileRes.status == 200) {
      //         navigation.navigate("CRADetailsScreen", {
      //           data : GetSlipsfileRes,
      //           t: params.t
      //         });
      //       }
      //     } else {
      //       console.log("GetTDDNetfileRes else");
      //     }
      //   }
      // } else {
      //   console.log("GetTDDNetfileRes else");
      // }
    }
  };

  // const jsCode = 'window.ReactNativeWebView.postMessage(document.documentElement.innerHTML)'

  // const onMessage = (event : any) => {
  //   console.log('Received: ', event.nativeEvent.data)
  // }
  const onBackButtonPress = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView
      style={{ flex: 1}}
    >
      <Header onPressbackButton={() => onBackButtonPress()}/>
      <View style={styles.modalContainer}>
        <WebView
          style={{ flex: 1 }}
          source={{ uri: url }}
          // injectedJavaScript={jsCode}
          onNavigationStateChange={(e) => onNavigationStateChange(e)}
          // onMessage={(event) => onMessage(event)}
          javaScriptEnabled
        />
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

export default WebViewScreen;
