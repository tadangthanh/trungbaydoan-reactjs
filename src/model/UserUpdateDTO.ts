export class UserUpdateDTO {
    githubUrl: string;
    facebookUrl: string;

    constructor(githubUrl: string, facebookUrl: string) {
        this.githubUrl = githubUrl;
        this.facebookUrl = facebookUrl;
    }
}