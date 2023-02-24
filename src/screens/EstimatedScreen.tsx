import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  View,
  Text,
} from "react-native";
import {
  CtText,
  CtView,
  CtTextInput,
  Button,
  TextButton,
  Divider,
} from "../components/UiComponents";
import { Spinner, ErrorMessage } from "../components";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { defaultColors } from "../utils/defaultColors";
import auth, { loginUser } from "../api/auth";
import { useQuery } from "react-query";
import { FontAwesome5 } from "@expo/vector-icons";
import { validateEmail } from "../utils/email";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Ionicons, Feather } from "@expo/vector-icons";

import DeviceCrypto from "react-native-device-crypto";
import { decryptAccounts } from "../utils/crypto";
import { SafeAreaView } from "react-native-safe-area-context";
import { SocialIcon } from "react-native-elements";
import CheckBox from "@react-native-community/checkbox";
import { Header } from "../components/Header";
import { BottomButton } from "../components/BottomButton";

const EstimatedScreen = ({ navigation, route }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  
  const [DataToRender, setData] = useState([] as any);

  const dispatch = useDispatch();

  useEffect(() => {

    // let vvv = {
    //   Balance: 0,

    //   ErrCode: 0,
      
    //   ErrMsg: "Success",
      
    //   NetIncome: 11700,
      
    //   Refund: -628.44,
      
    //   TaxableIncome: 10200,
      
    //   TotalCredits: 628.44,
      
    //   TotalIncome: 11700,
      
    //   TotalPayable: 0,
    // }
    // setData(vvv);
    try {
      if (route.params !== undefined) {
        const { data } = route.params;
        setData(data);
        // setData(data.slipsFilerted);
        console.log("onPressConfirm data");
      }
    } catch (error) {}
  }, []);


  const getAmountFormatter = (amount: Number) => {
    console.log("getAmountFormatter data", amount);
    
    if(amount !== undefined){
      return amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
    
  }
  const onBackButtonPress = () => {
    navigation.goBack();
  };

  console.log("datatorender data", DataToRender);
  return (
    <SafeAreaView style={styles(darkTheme).scrollStyle}>
      <Header onPressbackButton={() => onBackButtonPress()}/>
      <ScrollView
        // contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* <View
          style={{
            // flex: 0.05,
            marginBottom: 23.5,
            // marginLeft:15
          }}
        > */}
            {/* <CtView style={styles().inputIcon2}>
                    <TouchableOpacity>
                      <Ionicons
                        name={"arrow-back-outline"}
                        style={styles().iconStyle}
                      />
                    </TouchableOpacity>
                  </CtView> */}
                  {/* <TouchableOpacity
            style={{
              alignItems: "flex-start",
              height: "auto",
              width: "90%",
              flexDirection: "row",
              paddingLeft: 15,
              paddingTop: 20
            }}
            onPress={() => onBackButtonPress()}
          >
            <Ionicons
              name={"ios-chevron-back-outline"}
              style={{
                fontSize: 21,
                color: defaultColors.primaryBlue,
              }}
            />
            <CtText
              style={{
                fontWeight: "500",
                fontSize: 18,
                color: defaultColors.primaryBlue,
              }}
            >
              {"Back"}
            </CtText>
          </TouchableOpacity> */}
        {/* </View> */}

        <View
          style={{
            // flex: 0.2,
            height:125,
            marginRight: 28,
            marginLeft: 25,
            borderRadius: 10,
            backgroundColor: "#0A98FF",
            marginTop: 20
          }}
        >
          <CtText
            style={{
              fontSize: 16,
              marginLeft: 19,
              marginTop: 22,
              // fontFamily: "Gilroy-Medium",
              fontWeight: "400",
              color: "#FFFFFF",
            }}
          >
            {DataToRender.Refund > 0 ? "Your 2022 Tax Refund" : DataToRender.Balance > 0 ? "Your 2022 Balance owing" : ''}
          </CtText>

          <CtText
            style={{
              fontSize: 36,
              marginLeft: 19,
              marginBottom: 32,
              fontFamily: "Figtree",
              fontWeight: "700",
              color: "#FFFFFF",
            }}
          >
            $ {getAmountFormatter(DataToRender?.Balance)}
          </CtText>
        </View>

        <View
          style={{
            // flex: 0.4,
            height:'auto',
            marginRight: 28,
            marginLeft: 25,
            marginTop: 23,
            marginBottom: 12,
            // borderColor: "#DEE1E9",
            // borderRadius: 10,
            // borderWidth: 1,
            display: "flex",
            backgroundColor: darkTheme ?  defaultColors.black : defaultColors.white
          }}
        >
          <View
            style={styles(darkTheme).TopItemContainer}
          >
            <CtText
              style={{
                flex: 0.6,
                fontSize: 18,
                marginLeft: 15,
                marginRight: 5,
                // marginTop: 10,
                // marginBottom: 10,
              fontFamily:'Figtree-SemiBold',
                fontWeight: "600",
                color: darkTheme ?  defaultColors.white : "#1A263A",
                alignSelf: 'center'
              }}
            >
              Tax Summary
            </CtText>
          </View>

          <View
            style={styles(darkTheme).itemContainer}
          >
            <CtText
              style={styles(darkTheme).leftItem}
            >
              Total Income:
            </CtText>

            <CtText
              style={styles(darkTheme).rightItem}
            >
              $ {getAmountFormatter(DataToRender?.TotalIncome)}
            </CtText>
          </View>

          <View
            style={styles(darkTheme).itemContainer}
          >
            <CtText
            style={styles(darkTheme).leftItem}
            >
              Taxable Income:
            </CtText>

            <CtText
             style={styles(darkTheme).rightItem}
            >
              $ {getAmountFormatter(DataToRender?.TaxableIncome)}
            </CtText>
          </View>

          <View
            style={styles(darkTheme).itemContainer}
          >
            <CtText
               style={styles(darkTheme).leftItem}
            >
              Net Income:
            </CtText>

            <CtText
               style={styles(darkTheme).rightItem}
            >
              $ {getAmountFormatter(DataToRender?.NetIncome)}
            </CtText>
          </View>

          <View
            style={styles(darkTheme).BottomItemContainer}
          >
            <CtText
              style={styles(darkTheme).leftItem}
            >
              Total Payable:
            </CtText>

            <CtText
              style={styles(darkTheme).rightItem}
            >
              $ {getAmountFormatter(DataToRender?.TotalPayable)}
            </CtText>
          </View>
        </View>

        <View
          style={[styles(darkTheme).itemContainer,{ marginRight: 28,
            marginLeft: 25,

            borderRadius: 10,
          borderTopColor: darkTheme ?  defaultColors.gray : "#DEE1E9",
        borderTopWidth: 1}]}
        >
            <Text
              style={{
                flex: 0.6,
                fontSize: 18,
                marginLeft: 15,
                marginRight: 5,
                // marginTop: 10,
                // marginBottom: 10,
              fontFamily:'Figtree-SemiBold',
                fontWeight: "600",
                color: darkTheme ?  defaultColors.white : "#1A263A",
                alignSelf: 'center'
              }}
            >
              Total Credits:
            </Text>

            <CtText
              style={{
                flex: 0.4,
                fontSize: 18,
                marginRight: 15,
                marginTop: 12,
                marginBottom: 12,
                fontFamily: "Figtree",
                fontWeight: "700",
                color: "#0090EE",
                textAlign: "right",
              }}
            >
              $ {getAmountFormatter(DataToRender?.TotalCredits)}
            </CtText>

        </View>

        <View
          style={{
            height:'auto',
            marginRight: 20,
            marginLeft: 20,
            marginTop:20,
            borderColor: "#FFD88E",
            borderRadius:10,
            borderWidth:1.5,
            backgroundColor:"#FFF7E8"
          }}
        >
            <CtText
              style={{
                fontSize: 14,
                marginRight: 20,
                marginLeft:20,
                marginTop: 15,
                marginBottom: 20,
                fontFamily: "Figtree",
                fontWeight: "400",
                color: "#003A5B",
              }}
            >
             This is an estimated refund/tax owing; however, the actual amount could vary depending on applicable deductions and credits.
            </CtText>
        </View>
      </ScrollView>

      <BottomButton
        onPress={() => navigation.navigate("WebViewWithoutPopUp", { url: 'https://www.app.cloudtax.ca/ct_2022/auth/login' })}
        // style={[styles().button]}
        buttonText={'Continue'}/>
    </SafeAreaView>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    scrollStyle: {
      flex: 1,
      paddingBottom: 15,
      backgroundColor: isDarkTheme ?  defaultColors.black : defaultColors.white,
      
    },
    container: {
      flex: 1,
    },
    itemContainer: {
      // flex: 0.2,

      height: 50,
      borderBottomColor: isDarkTheme ?  defaultColors.gray : "#DEE1E9",
      borderRightColor: isDarkTheme ?  defaultColors.gray : "#DEE1E9",
      borderLeftColor: isDarkTheme ?  defaultColors.gray : "#DEE1E9",
      borderBottomWidth: 1,
      borderRightWidth: 1,
      borderLeftWidth: 1,
      flexDirection: "row",
    },
    BottomItemContainer: {
      height: 50,
      borderBottomColor: isDarkTheme ?  defaultColors.gray : "#DEE1E9",
      borderRightColor: isDarkTheme ?  defaultColors.gray : "#DEE1E9",
      borderLeftColor: isDarkTheme ?  defaultColors.gray : "#DEE1E9",
      borderBottomWidth: 1,
      borderRightWidth: 1,
      borderLeftWidth: 1,
      flexDirection: "row",
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    TopItemContainer: {
      // flex: 0.2,

      height: 50,
      borderWidth: 1,
      // borderRightWidth: 1,
      // borderLeftWidth: 1,
      flexDirection: "row",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderColor: isDarkTheme ?  defaultColors.gray : "#DEE1E9",
      borderRightColor: isDarkTheme ?  defaultColors.gray : "#DEE1E9",
      // borderLeftColor: isDarkTheme ?  defaultColors.gray : "#DEE1E9",
    },
    leftItem:{
      flex: 0.6,
      fontSize: 18,
      marginLeft: 15,
      marginRight: 5,
      // marginTop: 10,
      // marginBottom: 10,
      fontFamily: "Figtree",
      fontWeight: "400",
      color: isDarkTheme ?  defaultColors.white : "#1A263AB2",
      alignSelf: 'center'
    },
    rightItem:{
      flex: 0.4,
      justifyContent: "flex-end",
      fontSize: 16,
      marginRight: 15,
      // marginTop: 10,
      // marginBottom: 10,
      fontFamily:'Figtree-SemiBold',
      fontWeight: "600",
      color: isDarkTheme ?  defaultColors.white : "#1A263A",
      textAlign: "right",
      alignSelf: 'center'
    }
  });

export default EstimatedScreen;
