export class MemberDTO {
    id: number;
    role: string;
    userId: number;
    memberName: string;
    groupId: number;
    academicYear: number;
    major: string;
    department: string;
    className: string;
    email: string;
    avatarUrl: string;

    constructor(id: number, role: string, userId: number, memberName: string, groupId: number, academicYear: number, major: string, department: string, className: string, email: string, avatarUrl: string) {
        this.id = id;
        this.role = role;
        this.userId = userId;
        this.memberName = memberName;
        this.groupId = groupId;
        this.academicYear = academicYear;
        this.major = major;
        this.department = department;
        this.className = className;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }
}