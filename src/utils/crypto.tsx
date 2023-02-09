import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceCrypto from "react-native-device-crypto";
import CryptoJS from "crypto-js";

import { Platform } from "react-native";

export const decryptAccounts = async () => {
    try {
        if (Platform.OS === 'android') {
            const encryptedText = await AsyncStorage.getItem('account-list')
            const key = await AsyncStorage.getItem('key')
            const  result = CryptoJS.AES.decrypt(encryptedText as string, key as string).toString(CryptoJS.enc.Utf8)
            console.log('result from decrypt', result)
            return result
        } else {
            const encryptedText = await AsyncStorage.getItem('account-list')
            const ivText = await AsyncStorage.getItem('ivText')
            if (encryptedText && ivText) {
                const result = await DeviceCrypto.decrypt('accounts', encryptedText, ivText, {
                    biometryTitle: 'Authentication is required',
                    biometrySubTitle: 'Encryption',
                    biometryDescription: 'Authenticate your self to encrypt given text.',
                });
                return result
            }
        }
    } catch (error) {
        console.log('error in decrypting', error)
    }
}

export const encryptData = async (stringToEncrypt: string, alias: string) => {
    try {
        if (Platform.OS === 'android') {
            console.log('OS android...')
            await AsyncStorage.setItem('key', alias)
            const result = await CryptoJS.AES.encrypt(stringToEncrypt, alias).toString()
          console.log('result :', result)
          const data =  {
            encryptedText: result,
            iv: ''
            }
          return data
        } else {
            const result = await DeviceCrypto.encrypt(alias, stringToEncrypt, {
                biometryTitle: 'Authentication is required',
                biometrySubTitle: 'Bind Account',
                biometryDescription: 'Authenticate your self to register authentication',
              });
            return result
        }
    } catch (error) {
        console.log('error in encrypting', error)
    }
}