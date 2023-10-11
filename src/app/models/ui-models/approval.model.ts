export interface Approval {
    id: Number,
    campaignId: string,
    campaignName: string,
    isApproved: Boolean,   
    DateApproved?: Date,
    ApprovedBy?: string
}