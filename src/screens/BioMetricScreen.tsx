import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import {
  CtText,
  CtView,
  TextButton,
} from "../components/UiComponents";
import { useDispatch } from "react-redux";
import { defaultColors } from "../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../store";

import DeviceCrypto from "react-native-device-crypto";
import { decryptAccounts, encryptData } from "../utils/crypto";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";


const BioMetricScreen = ({ navigation, route }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [publicKey, setPublicKey] = React.useState<string>('');
  const [isKeyExists, setIsKeyExists] = React.useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>();
  const [encryptedText, setEncryptedText] = React.useState<string>('');  
  const [accounts, setAccounts] = useState([])
  const [biometricType, setBiometricType] = useState('');
  const [bType, setBType] = useState('');
  const [isTaxID, setTaxtId] = useState(null);
  const dispatch = useDispatch();


  useEffect(() => {
    DeviceCrypto.getBiometryType()
      .then((type) => {
        setBiometricType(type);
        if(type == "TOUCH"){
            setBType('TouchID')
        } else if(type == "FACE"){
            setBType('FaceID')
        }else if(type == "IRIS"){
            setBType('IrisID')
        } else{
            setBType('')
        }
        
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  useEffect(() => {
    try {
      if (route.params !== undefined) {
        const { TaxID } = route.params;
        setTaxtId(TaxID);
      }
    } catch (error) {}
  }, []);
  const setBio = async () => {
    await simpleAuthentication()
    .then(async(res) => {
        console.log('simpleAuthentication success', res)
       if (res === true) {
            if (isKeyExists === true) {
                await deleteKey()
            } else {
                await createKey()
                await encrypt()
            }
            await AsyncStorage.setItem(
              "isSetBioMetric", "true"
            );
            if(isTaxID !== null){
              navigation.replace("SummaryScreen");
            } else {
              navigation.navigate("ChooseTaxYearScreen", {
                isFromRegistration: false,
              });
            }
           
        } else {
            console.log('Sorry...! Validation failed...!')
        }
    })
  };

  const createKey = async () => {
    try {
    const x = await DeviceCrypto.getOrCreateAsymmetricKey('accounts', {
        accessLevel: 0,
        invalidateOnNewBiometry: false,
      }).then((x) => setPublicKey(x))
    } catch (err: any) {
        Alert.alert("Something went wrong with key creation, please try again.")
    }
};    



  const deleteKey = async () => {
    let encryptText = password + ' ' + email
    decrypt()
    AsyncStorage.clear()
try {
    const x = new Set(accounts)
    x.delete(encryptText as never)
    const res = await encryptData([...x].toString(), 'accounts')
    if (res?.encryptedText && res?.iv) {
        await AsyncStorage.setItem("account-list", res.encryptedText);
        await AsyncStorage.setItem("ivText", res.iv)    
    }
    // await DeviceCrypto.deleteKey(`${userQuery.data.taxPayerId}`);
    // await AsyncStorage.removeItem(`${userQuery.data.taxPayerId}`)
    setIsKeyExists(false);

} catch (err: any) {
    Alert.alert("Something went wrong while deleting bound data, please try again.")
    console.log('error on Deleting Key:', err);
}
};


const encrypt = async () => {
    decrypt()
    try {
        console.log('encrypt sussess')
        const encryptText = password + ' ' + email
        accounts.push(encryptText as never)
        let x = new Set(accounts)
        const res = await encryptData([...x].toString(), 'accounts')
        if (res) {
            await setEncryptedText(res.encryptedText as any);
            
            await AsyncStorage.setItem("account-list", res.encryptedText as any);
            await AsyncStorage.setItem("ivText", res.iv)
        }  
        setIsKeyExists(true);     
    } catch (err: any) {
        console.log('error in encrypt', err)
        Alert.alert("Something went wrong while Encrypting data. \n Please try again.")
      }
}

const decrypt = async () => {
    try {
        const res = await decryptAccounts()
        if (res !== undefined) {
            const x = new Set(res.split(',') as never)
            const data = new Set([...x as never])
            setAccounts([...data])
        }
      } catch (err: any) {
        console.log('error in decrypt', err)
      }
}

  const simpleAuthentication = async () => {
    try {
      const res = await DeviceCrypto.authenticateWithBiometry({
        biometryDescription: 'Validate authentication',
        biometrySubTitle: '',
        biometryTitle: 'Validation',
      })
      await setIsAuthenticated(res);
      return res
    } catch (err: any) {
      setIsAuthenticated(false);
    }
};
  return (
    <SafeAreaView style={styles(darkTheme).scrollStyle}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            backgroundColor: darkTheme
              ? defaultColors.black
              : defaultColors.white,
          }}
        >
          <CtView style={styles(darkTheme).container}>
            <CtView style={styles(darkTheme).TopTextContainer}>
              <CtText style={styles(darkTheme).caption}>
              {`Use ${bType} to sign in quickly and securely`}
              </CtText>
            </CtView>
            <CtView style={styles(darkTheme).ImageViewContainer}>
            <Image
                style={{
                  height: 150,
                  width: Dimensions.get("window").width * 0.9,
                  backgroundColor: defaultColors.transparent,
                }}
                resizeMode={"contain"}
                source={bType === 'TouchID' ? require("../../assets/fingerId.png"): require("../../assets/faceId.png")}
              />
            </CtView>
            <CtView style={styles(darkTheme).BottomViewContainer}>
              <CtView style={{ marginTop: 30 }}>
                <CustomButton
                  buttonText={`Use ${bType}`}
                  onPress={() => setBio()}
                  style={{ marginBottom: 20, marginTop: 10 }}
                />
                <TextButton
                  description=" "
                  linkText={"May be later"}
                  fontSize={15}
                  linkTextColor={
                    darkTheme ? defaultColors.white : defaultColors.gray
                  }
                  onPress={() => {
                    navigation.navigate("ChooseTaxYearScreen", {
                      isFromRegistration: false,
                    });
                  }}
                />
              </CtView>
            </CtView>
          </CtView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    scrollStyle: {
      flex: 1,
      paddingBottom: 15,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      // isDarkTheme ? defaultColors.black : defaultColors.whiteGrey,
    },
    container: {
      paddingHorizontal: 15,
      padding: 20,
      flex: 1,
      //   justifyContent: 'center',
    //   height: Dimensions.get("window").height / 1.5,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
    },
    BottomViewContainer: {
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
        flex: 0.2
    },
    ImageViewContainer:{
        backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
        flex: 0.6,
        justifyContent: 'center'
    },
    TopTextContainer: {
      marginTop: 40,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
        flex: 0.2
    },
    caption: {
      textAlign: "center",
      fontSize: 22,
      fontFamily: "Figtree-Bold",
      fontWeight: "700",
    },
  });

export default BioMetricScreen;
