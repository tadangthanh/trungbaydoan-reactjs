import { BaseDTO } from "./BaseDTO";

export class User extends BaseDTO {
    email: string;
    fullName: string;
    role: string;
    totalsProject: number;
    avatarId: number;
    department: string;
    academicYear: number;
    major: string;
    avatarUrl: string;
    className: string;
    facebookUrl: string;
    githubUrl: string
    status: boolean;
    constructor(id: number, createdDate: Date, lastModifiedDate: Date, createdBy: string, lastModifiedBy: string, email: string, fullName: string, role: string, totalsProject: number, avatarId: number, department: string, academicYear: number, major: string, className: string, avatarUrl: string, facebookUrl: string, githubUrl: string, status: boolean) {
        super(id, createdDate, lastModifiedDate, createdBy, lastModifiedBy);
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.totalsProject = totalsProject;
        this.avatarId = avatarId;
        this.department = department;
        this.academicYear = academicYear;
        this.major = major;
        this.className = className;
        this.avatarUrl = avatarUrl;
        this.facebookUrl = facebookUrl;
        this.githubUrl = githubUrl;
        this.status = status;
    }
}