export function validateEmail(email: string) {
    // this regex has been copied from
    // https://www.w3resource.com/javascript/form/email-validation.php
    const re = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}
