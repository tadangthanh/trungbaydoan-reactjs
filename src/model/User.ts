import { BaseDTO } from "./BaseDTO";

export class User extends BaseDTO {
    email: string;
    fullName: string;
    role: string;
    totalsProject: number;
    avatar: string;
    department: string;
    academicYear: number;
    major: string;

    constructor(id: number, createdDate: Date, lastModifiedDate: Date, createdBy: string, lastModifiedBy: string, email: string, fullName: string, role: string, totalsProject: number, avatar: string, department: string, academicYear: number, major: string) {
        super(id, createdDate, lastModifiedDate, createdBy, lastModifiedBy);
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.totalsProject = totalsProject;
        this.avatar = avatar;
        this.department = department;
        this.academicYear = academicYear;
        this.major = major;

    }
}