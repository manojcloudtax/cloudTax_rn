import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Image, Alert, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from "react-native";
import { CtText, CtView, CtTextInput, Button, TextButton } from "../components/UiComponents";
import { Spinner, ErrorMessage } from "../components";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { defaultColors } from "../utils/defaultColors";
import { loginUser } from '../api/auth';
import { useQuery } from "react-query";
import { FontAwesome5 } from '@expo/vector-icons';
import { validateEmail } from "../utils/email";
import { useSelector } from "react-redux";
import { RootState } from "../store";

import DeviceCrypto from 'react-native-device-crypto';
import { decryptAccounts } from "../utils/crypto";



const LoginScreen = ({ navigation }: any) => {
    const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [biometricsSupported, setBiometricsSupported] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // biometrics related states
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [accounts, setAccounts] = useState(new Set([]))
    const [selectedAccount, setSelectedAccount] = useState<null|any>(null)

    const dispatch = useDispatch();

    const { isLoading, refetch } = useQuery("login", () => loginUser({ email, password }), {
        onSuccess: (data) => {
            const morphedData = {...data, email, password}
            dispatch(login(morphedData));
        },
        onError: (error: any) => {
            if (error.message == "Request failed with status code 401") {
                Alert.alert("Error", "Invalid email or password! Please check your credentials and try again.")
            } else {
                Alert.alert("Error", "Something went wrong! Please try again.")
            }
        },
        retry: false,
        enabled: false,
    })


    // this will check the device security is enabled and the level if it has a biometrics
    useEffect(() => {
        // AsyncStorage.clear()
        const checkSecurity = async () => {
            const securityLevel = await DeviceCrypto.deviceSecurityLevel()
            if (securityLevel === 'BIOMETRY') {
               const biometricType = await DeviceCrypto.getBiometryType()
               if (biometricType !== 'NONE') {
                setBiometricsSupported(true);
               }
            }
        }
        checkSecurity()
    }, [])

    const onEmailChange = () => {
        if (!email) {
            setEmailError("Email is required.");
        } else if (!validateEmail(email)) {
            setEmailError("Email is not valid");
        } else {
            setEmailError(null);
        }
    };

    const onPasswordChange = () => {
        if (email && !password) {
            setPasswordError("Password is required.");
            setShowPassword(false);
        } else {
            setPasswordError(null);
        }
    };

    const renderButton = useMemo(() => {
        const disabled = !(email);
        const style = disabled ? 
            [styles().button, { opacity: 0.6 }] : styles().button;
        if (!isLoading) {
            return (
                <>
                    <Button 
                        disabled={disabled} 
                        style={style} 
                        buttonText="Login" 
                        onPress={async () => {
                            if (email && password) {
                                await refetch()
                            } else if (email && !password) {
                                await authenticate()
                            }
                        }} 
                    />
                </>
            )
        } else {
            return (<Spinner />)
        }
    }, [selectedAccount, email, password]);

    const renderEyeIcon = () => {
        return (
            <CtView style={styles().inputIcon}>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <FontAwesome5 name={showPassword ? "eye" : "eye-slash"} style={styles().iconStyle} />
                </TouchableOpacity>
            </CtView>
        )
    };

    const decrypt = async () => {
        try {
                const res = await decryptAccounts()
                if (res) {
                    const result = res.split(',')
                    const x = new Set(result.filter(entry => entry.length !== 0))
                    const data = [...x]
                   
                const transformedData = data.map((x, index) => {
                    const entry = x.split(' ')
                    // this will be the radio buttons.
                    const pass = entry[0]
                    const mail = entry[1]

                    const radio = {
                        id: index,
                        label: mail,
                        title: mail,
                        value: {
                            password: pass,
                            email: mail,
                        },
                        labelStyle: {
                            width: 240,
                            marginLeft: 12,
                        },
                        size: 28
                    }
                    return radio
                }).filter((x) => x.label !== null)
                setAccounts(transformedData as never)
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
            console.log('error in Authentication', err)
        }
    };

    const authenticate = async () => {
        await simpleAuthentication()
        .then(async(res) => {
            if (res === true) {
                await DeviceCrypto
                    .getOrCreateSymmetricKey('credentials', {
                        accessLevel: 0,
                        invalidateOnNewBiometry: false
                    }).then(async (isAuthenticated) => {
                        if (isAuthenticated === true) {
                        setEmail(selectedAccount.value.email)
                        setPassword(selectedAccount.value.password)
                        refetch()
                    }
                })
            } else {
                console.log('try again, validation failed')
            }
        })
    };

    useEffect(() => {
        decrypt()
    }, [])

    useEffect(() => {
        if (selectedAccount !== null) {
            authenticate()
        }
    }, [selectedAccount])

    return (
            <KeyboardAvoidingView
               keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
               behavior={Platform.OS === "ios" ? "padding" : "height"}
               style={{ flex: 1 }}
            >
                   <CtView>
                <CtView style={styles().logoContainer}>
                    {/* <Image style={styles().logo} source={require('../assets/loginScreenImages/loginLogoNew.png')} /> */}
                </CtView>
                <CtView style={styles().container}>
                    <CtText style={styles().caption}>Login</CtText>
                    <CtTextInput
                        testID={'private'}
                        value={email}
                        editable={true}
                        placeholder={"Email"}
                        placeholderTextColor={defaultColors.gray}
                        style={styles().input}
                        onChangeText={(text: string) => setEmail(text.trim())}
                        onBlur={onEmailChange}
                        keyboardType={"email-address"}
                        autoCapitalize="none"
                    />
                    <ErrorMessage text={emailError} />
                    <CtView style={styles().textInputContainer}>
                        <CtTextInput
                            testID={'private'}
                            value={password}
                            editable={true}
                            placeholder={"Password"}
                            placeholderTextColor={defaultColors.gray}
                            secureTextEntry={!showPassword}
                            style={styles().input}
                            onChangeText={(text: string) => setPassword(text)}
                            onBlur={onPasswordChange}
                            autoCapitalize="none"
                        />
                        {!!password && renderEyeIcon()}
                    </CtView>
                    <ErrorMessage text={passwordError} />
                    <CtView style={styles().buttonContainer}>
                        {renderButton}
                    </CtView>
                    <TextButton description="Don't have account? " linkText="Sign up" linkTextColor={defaultColors.links}
                        onPress={() => navigation.navigate("RegisterScreen", {step: 1})} />
                   </CtView>
            </CtView>
            </KeyboardAvoidingView>
    );
};

const styles = (isDarkTheme?: boolean) => StyleSheet.create({
    scrollStyle: {
        flexGrow: 1,
        paddingBottom: 15
    },
    container: {
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    logoContainer: {
        flex: 0,
        marginTop: 40,
        justifyContent: 'center'
    },
    logo: {
        alignSelf: 'center',
        maxWidth: '60%',
        resizeMode: 'contain'
    },
    caption: {
        marginBottom: 48,
        textAlign: "center",
        fontSize: 20,
        fontFamily: 'Gilroy-SemiBold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#DADADA',
        backgroundColor: 'transparent',
        padding: 15,
        marginBottom: 24,
        borderRadius: 5,
        width: '100%',
        fontFamily: 'Gilroy-Medium'
    },
    textInputContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputIcon: {
        flex: 0,
        position: 'absolute',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        right: 24,
        top: 15
    },
    iconStyle: {
        fontSize: 20,
        color: defaultColors.gray
    },
    buttonContainer: {
        flex: 0,
        marginTop: 30,
        marginBottom: 15
    },
    button: {
        paddingVertical: 16,
        borderRadius: 5,
    },
    separatorContainer: {
        flex: 0,
        marginVertical: 40,
    },
    separator: {
        flex: 0,
        borderTopWidth: 0.5,
        borderTopColor: defaultColors.whisper
    },
    separatorText: {
        backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
        position: 'absolute',
        alignSelf: 'center',
        textAlign: 'center',
        top: Platform.OS === "ios" ? -10 : -13,
        fontSize: 16,
        width: 24,
    },
    biometricButton: {
        backgroundColor: 'transparent',
        paddingVertical: 15,
        borderColor: defaultColors.dodgerBlue,
        borderWidth: 1,
        borderRadius: 5
    },
    biometricButtonText: {
        textAlign: "center",
        color: defaultColors.dodgerBlue
    },
    radioGroupStyle: {
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    modalWrapper: {
        width: '90%',
        marginLeft: 24,
        overflow: 'scroll',
        marginRight: 24, 
        borderRadius: 5,
        backgroundColor: '#FFF'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.2)"
    },
    modalView: {
        flex: 0,
        width: '97%',
        margin: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: 'center',
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        marginTop: 24,
        textAlign: 'center', 
        marginBottom: 8, 
        fontSize: 20, 
        fontWeight: '800'
    },
    modalDescription: {
        textAlign: 'center', 
        marginBottom: 12, 
        fontSize: 15, 
    },
    modalText: {
        textAlign: 'center', 
        color: defaultColors.dodgerBlue, 
        marginHorizontal: 24
    },
    modalActionWrapper: {
        flex: 1,  
        marginTop: 4
    },
    modalAction: {
        backgroundColor: 'transparent',
        paddingVertical: 15,
        borderRadius: 5
    },
    modalCloseButton: {
        backgroundColor: 'rgba(40,40,40, 0.8)',
        padding: 12,
        borderRadius: 24,
    },
});


export default LoginScreen;
