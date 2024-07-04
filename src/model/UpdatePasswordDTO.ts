export class UpdatePasswordDTO {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    code: string;
    constructor(currentPassword: string, newPassword: string, confirmPassword: string, code: string) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
        this.code = code;
    }
}