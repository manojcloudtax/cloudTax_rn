import axios from "axios";
import { refreshUserToken } from "./user";

// "https://app.cloudtax.ca/api/" - production

const cr = axios.create({
    baseURL: "https://app.cloudtax.ca/api"
});

export const profile_img_upload = (userToken: string, payload: any) => {    
    cr.post("/user/profile-img", payload, {headers: {Authorization: `Bearer ${userToken}`}}).then((res) => {
        return res;
    }).catch(err => {
        console.log('ERROR UPLOAD:', err)
        return err;
    })
}

export const save_user_payment_info = (userToken: string, payload: any) => {
    return cr.post("/usa/SaveTaxPayerPaymentInfo", payload, {headers: {Authorization: `Bearer ${userToken}`}})
    .catch(async err => {
        console.log("ERROR SAVING TAXPAYER INFO", err)
    }).then((res) => {
        return res
    })
}


export const get_user_payment_info = (userToken: string, payload: any) => {
    console.log('payload:', payload)
    return cr.post("/usa/GetTaxPayerPaymentInfo", {
        TaxPayerID: payload.taxPayerId,
        Year: payload.year
    }, {
        headers: {Authorization: `Bearer ${userToken}`}
        
    })
    .catch(async err => {
        console.log("ERROR GETTING TAXPAYER INFO", err)
    }).then((res) => {
        return res
    })
}



export default cr;
