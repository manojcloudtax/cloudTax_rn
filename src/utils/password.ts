export function validatePassword(password: string) {
    let passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W\_])[A-Za-z\d\W\_]{8,}$/;
    return passReg.test(password);
}
