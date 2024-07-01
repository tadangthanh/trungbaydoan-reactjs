export class MemberDTO {
    id: number;
    role: string;
    userId: number;
    memberName: string;
    groupId: number;

    constructor(id: number, role: string, userId: number, memberName: string, groupId: number) {
        this.id = id;
        this.role = role;
        this.userId = userId;
        this.memberName = memberName;
        this.groupId = groupId;
    }
}