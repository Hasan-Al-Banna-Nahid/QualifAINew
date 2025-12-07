export interface Requirement {
    id: string;
    projectId: string;
    description: string;
    category: 'functional' | 'non-functional' | 'design' | 'content' | 'other';
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'approved' | 'rejected';
    source?: string;
    createdAt: string;
}

export type RequirementStatus = Requirement['status'];
export type RequirementPriority = Requirement['priority'];
export type RequirementCategory = Requirement['category'];
