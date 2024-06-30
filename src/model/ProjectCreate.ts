export class ProjectCreate {
    name: string;
    startDate: Date;
    endDate: Date;
    submissionDate: Date;
    categoryId: number;
    mentorIds: number[] = [];
    summary: string;
    memberIds: number[] = [];
    documentIds: number[] = [];
    description: string;

    constructor(name: string, startDate: Date, endDate: Date, submissionDate: Date, categoryId: number, mentorIds: number[], summary: string, memberIds: number[], documentIds: number[], description: string) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.submissionDate = submissionDate;
        this.categoryId = categoryId;
        this.mentorIds = mentorIds;
        this.summary = summary;
        this.memberIds = memberIds;
        this.documentIds = documentIds;
        this.description = description;
    }
}