import {DashboardWidgets} from '../ui-models/dashboard-widgets.model';
import {DashboardSAMap} from '../ui-models/dashboard-saMap.model';
import {DashboardBarChart} from '../ui-models/dashboard-bar-chart.model';
import {DashboardLineChart} from '../ui-models/dashboard-line-chart.model';
import {DashboardScheduleVersions} from '../ui-models/dashboard-schedule-versions.model';


export interface Dashboard {
    topWidgets: DashboardWidgets,
    regionMapArray: DashboardSAMap,
    atmScheduleVersions: DashboardScheduleVersions,
    atmVersionByRegionBarChartData: DashboardBarChart,
    devicePerformanceLineChartData: DashboardLineChart
}