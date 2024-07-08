export class ProjectDeleteRequest {
    projectIds: number[];
    reason: string;
    constructor(projectIds: number[], reason: string) {
        this.projectIds = projectIds;
        this.reason = reason;
    }
}