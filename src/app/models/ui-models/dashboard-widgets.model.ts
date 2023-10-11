import { DashboardScheduleVersions } from "../ui-models/dashboard-schedule-versions.model";
export interface DashboardWidgets {
    totalCampaigns: Number,
    latestScheduleCount: Number,
    failedUploadSchedulesCount: Number,
    totalDevices: Number,
    currentVersion: string,
    atmScheduleResultVersions: DashboardScheduleVersions[],
}
