export class GroupDTO {
    memberIds: number[];
    memberNames: string[];
    projectId: number;

    constructor(memberIds: number[], memberNames: string[], projectId: number) {
        this.memberIds = memberIds;
        this.memberNames = memberNames;
        this.projectId = projectId;
    }
}