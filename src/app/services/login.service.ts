import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { apiLogin } from '../models/api-models/login.model';
import { uiLogin } from '../models/ui-models/login.model';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseApiUrl: string = environment.loginBaseApiUrl;

  captureData$: Observable<uiLogin>;

  apiLoginModel: apiLogin[] = [{
    abNumber: 'Farmer-User',
    password: '12345'
  },
   {
    abNumber: 'Creditor-User',
    password: '098765'
  } ];

  loginAuth: uiLogin = {
    isAuthenticated: false,
    displayName: '',
    isAdminUser: false,
    isBusinessApprover: false,
    isBusinessUser: false
  };
  private captureValueBS = new BehaviorSubject<uiLogin>(this.loginAuth);
  constructor(private httpClient: HttpClient,private readonly route: ActivatedRoute,private readonly router: Router) {
    this.captureData$ = this.captureValueBS.asObservable();
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {  
    localStorage.removeItem('token');
    localStorage.removeItem('isAdminUser');    
    localStorage.clear();    
    this.router.navigate(['/login']);
  }
  updateLoginCaptureValue(dataAsParams: uiLogin) {
    this.captureValueBS.next(dataAsParams);
    
    
  }



  ValidateUserLogin(requestBody: apiLogin): Observable<uiLogin>{
    const loginRequest: apiLogin = {
      abNumber: requestBody.abNumber,
      password: requestBody.password,
    }

    for(let test of this.apiLoginModel)
    {
      if(test.abNumber == loginRequest.abNumber && test.password == loginRequest.password)
      {
        this.loginAuth.isAuthenticated = true;
        if(loginRequest.abNumber == 'Farmer-User')
        {
          this.loginAuth.displayName = 'Farmer-User';
          this.loginAuth.isAdminUser = false;
        }
        else if(loginRequest.abNumber == 'Creditor-User')
        {
          this.loginAuth.displayName = 'Creditor-User';
          this.loginAuth.isAdminUser = true;
        }
        
      }
      
    }

    if (!this.loginAuth.isAuthenticated) {
        return this.httpClient.post<uiLogin>(this.baseApiUrl, loginRequest);
          // this.httpClient.post<uiLogin>(this.baseApiUrl, loginRequest).subscribe(data => {            
          //   this.loginAuth = data;
          // });
    }

    this.updateLoginCaptureValue(this.loginAuth);

   return of(this.loginAuth);

  }

  // ValidateUserLogin(requestBody: apiLogin): Observable<uiLogin>{
  //   const loginRequest: apiLogin = {
  //     abNumber: requestBody.abNumber,
  //     password: requestBody.password
  //   }


  //  return this.httpClient.post<uiLogin>(this.baseApiUrl, loginRequest);

  // }

}
