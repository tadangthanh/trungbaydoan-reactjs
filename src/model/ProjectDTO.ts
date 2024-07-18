export class ProjectDTO {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    projectStatus: string;
    submissionDate: string;
    summary: string;
    categoryId: number;
    categoryName: string;
    documentIds: number[];
    groupId: number;
    approverId: number;
    academicYear: number;
    mentorIds: number[];
    mentorNames: string[];
    createdDate: string;
    createdBy: string;
    lastModifiedDate: string;
    lastModifiedBy: string;
    memberNames: string[];
    approverName: string;
    active: boolean;
    idsTechnology: number[];


    constructor(id: number, name: string, description: string, startDate: string, endDate: string, projectStatus: string, submissionDate: string, summary: string, categoryId: number, categoryName: string, documentIds: number[], groupId: number, approverId: number, academicYear: number, mentorIds: number[], mentorNames: string[], createdDate: string, createdBy: string, lastModifiedDate: string, lastModifiedBy: string, memberNames: string[], approverName: string, active: boolean, idsTechnology: number[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.projectStatus = projectStatus;
        this.submissionDate = submissionDate;
        this.summary = summary;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.documentIds = documentIds;
        this.groupId = groupId;
        this.approverId = approverId;
        this.academicYear = academicYear;
        this.mentorIds = mentorIds;
        this.mentorNames = mentorNames;
        this.createdDate = createdDate;
        this.createdBy = createdBy;
        this.lastModifiedDate = lastModifiedDate;
        this.lastModifiedBy = lastModifiedBy;
        this.memberNames = memberNames;
        this.approverName = approverName;
        this.active = active;
        this.idsTechnology = idsTechnology
    }

}