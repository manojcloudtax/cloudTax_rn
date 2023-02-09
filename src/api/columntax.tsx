import axios from "axios";
import { columntaxPayload } from "../types";
import base64 from 'react-native-base64';


const PRODUCTION_BASE_URL = "https://app.columnapi.com/";
const SANDBOX_BASE_URL = "https://sandbox.columnapi.com/";

const client_id='6010f59609412009deb958b257af961d'
const client_secret= 'edbe575564563bb92430f47f1aa7aaf9'


const useProduction = false;

const sdkUrl = useProduction ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;



const CTService = () => {
    const columntax = axios.create({
        baseURL: sdkUrl
    });
    
    const base64Auth = base64.encode(`${client_id}:${client_secret}`)
    return {
        initialize_tax_filing: (postData: columntaxPayload) => {
            let response = columntax.post('/v1/exp/initialize_tax_filing', JSON.stringify(postData), {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: `Basic ${base64Auth}`
                }
            }).then((res) => {
                console.log('response:',res)
                return res;
            }).catch(err => {
                console.log('ERROR on initialize_tax_filing:',err)
            })
            return response
        },
        get_tax_returns: (postData: number) => {
            let response = columntax.get(`v1/users/${postData}/tax_returns`, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `Basic ${base64Auth}`
                }
            }).then((res) => {
                return res
            }).catch(err => {
                console.log('ERROR in get_tax_returns:',err)
            })
            return response
        },
        access_tax_filing: (postData: string) => {
            const data = new FormData()
            data.append('user_identifier', postData)
            let response = columntax.post(`v1/users/refresh_token`, data, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `Basic ${base64Auth}`
                }
            }).then((res) => {
                return res
            }).catch(err => {
                console.log('ERROR: access_tax_filing',err)
            })
            return response
        }
    }
}

export default CTService;