import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import {DashboardWidgets} from '../models/api-models/dashboard-widgets.model';
import {DashboardSAMap} from '../models/api-models/dashboard-saMap.model';
import {DashboardBarChart} from '../models/api-models/dashboard-bar-chart.model';
import {DashboardLineChart} from '../models/api-models/dashboard-line-chart.model';
import {DashboardScheduleVersions} from '../models/api-models/dashboard-schedule-versions.model';
import { DashboardInfo } from '../models/ui-models/dashboard-info.model';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseApiUrl = environment.campaignBaseApiUrl;

  constructor(private httpClient: HttpClient) {

  }

  getWidgets(): Observable<DashboardInfo>{
    return this.httpClient.get<DashboardInfo>(this.baseApiUrl + '/Dashboard');
  }
}

