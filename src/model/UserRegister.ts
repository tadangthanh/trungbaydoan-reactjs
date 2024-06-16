export class UserRegister {
    email: string;
    password: string;
    passwordConfirm: string;
    constructor(email: string, password: string, passwordConfirm: string) {
        this.email = email;
        this.password = password;
        this.passwordConfirm = passwordConfirm;
    }
}