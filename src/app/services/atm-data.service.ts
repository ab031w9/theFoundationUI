import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { ATMData } from '../models/api-models/atm-data.model';

@Injectable({
  providedIn: 'root'
})
export class AtmDataService {

  private baseApiUrl = environment.campaignBaseApiUrl;

  constructor(private httpClient: HttpClient) { 

  }

  getATMData(): Observable<ATMData[]>{
    return this.httpClient.get<ATMData[]>(this.baseApiUrl + '/ATMData');
  }
}
