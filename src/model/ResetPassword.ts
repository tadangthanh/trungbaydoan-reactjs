export class ResetPassword {
    email: string;
    verifyCode: string;

    constructor(email: string, verifyCode: string) {
        this.email = email;
        this.verifyCode = verifyCode;
    }
}