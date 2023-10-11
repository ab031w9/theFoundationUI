import { DashboardWidgets } from "../api-models/dashboard-widgets.model";
import { DashboardScheduleVersions } from "../api-models/dashboard-schedule-versions.model";
import { DashboardSAMap } from "../api-models/dashboard-saMap.model";

export interface DashboardInfo {
  dashboardWidgets: DashboardWidgets
  dashboardScheduleVersions: DashboardScheduleVersions,
  saMapChart: DashboardSAMap
}
