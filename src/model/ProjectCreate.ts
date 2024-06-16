export class ProjectCreate {
    name: string;
    startDate: Date;
    endDate: Date;
    submissionDate: Date;
    categoryId: number;
    mentorId: number;
    summary: string;
    memberIds: number[] = [];
    constructor(name: string, startDate: Date, endDate: Date, submissionDate: Date, categoryId: number, mentorId: number, summary: string, memberIds: number[] = []) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.submissionDate = submissionDate;
        this.categoryId = categoryId;
        this.mentorId = mentorId;
        this.summary = summary;
        this.memberIds = memberIds;
    }
}