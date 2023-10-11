import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiLogin } from '../models/api-models/login.model';
import { LoginService } from '../services/login.service';
import { EncryptionService } from '../services/encryptionservice.service';
import { uiLogin } from '../models/ui-models/login.model';
//import { ToastrService } from 'ngx-toastr/public_api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(private readonly loginService: LoginService, private fb:FormBuilder,private encryptionService: EncryptionService,
    private snackbar:ToastrService, private readonly route: ActivatedRoute,private readonly router: Router)
    {

    }
  Loginform!: FormGroup;

  ngOnInit(): void {
    //this.testEncryption();
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['view']);
    }
    this.Loginform = this.fb.group({
      username: [''],
      password: [''],
    });

  }


  loginResponse! : Observable<uiLogin>;

  apiLoginModel: apiLogin = {
    abNumber: '',
    password: '',
  }


  submit() {
    if (this.ValidateLogin()) {
            this.userLogin(this.apiLoginModel);
              }
    else {
      this.snackbar.error("Invalid Login Attempt. Please Fill Login Credentials " + + "", undefined,
        {
         timeOut: 4000
        })
    }
    this.clearLogin();
  }

  userLogin (loginForm: apiLogin) {
    const login : apiLogin = {
        abNumber: loginForm.abNumber.trim(),
        password: loginForm.password.trim(),
    }

    this.loginService.ValidateUserLogin(login)
    .subscribe ({
      next:(successResponse: uiLogin) => {
        
          //Show a notification
          if (successResponse.isAuthenticated){
              this.loginService.setToken(successResponse.displayName);
              this.loginService.updateLoginCaptureValue(successResponse);  
              localStorage.setItem('isAuthenticatedUser', "true");
              localStorage.setItem('isAdminUser', JSON.stringify(successResponse.isAdminUser));
              this.navigateToCalendar();
    
              this.snackbar.success("Welcome Back " + successResponse.displayName + "!", "Login Successful",
                {
                  timeOut: 3000,
                  positionClass: 'toast-bottom-center'
                });
  
            }
          else {
            localStorage.setItem('isAuthenticatedUser', "false");
            this.snackbar.error(successResponse.displayName + "Failed", "Login Unsuccessful",
            {
              timeOut: 3000,
              positionClass: 'toast-bottom-center'
            });
          }
      },
      error: (errorResponse: string) => {
        localStorage.setItem('isAuthenticatedUser', "false");
        this.snackbar.error("Login Failed  " + errorResponse + "", "Login Unsuccessful",
        {
         timeOut: 3000,
         positionClass: "toast-bottom-center"
        })
        
          this.clearLogin();
        }
    });


  }
  clearLogin() {
    this.apiLoginModel.abNumber = '';
    this.apiLoginModel.password = '';
  }

  ValidateLogin(){
      return !!this.apiLoginModel.abNumber && !!this.apiLoginModel.password;
  }

  navigateToCalendar() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=> {
        this.router.navigate(['/nav'])
        this.router.navigate(['/view'])});
        // this.router.navigate(['/view']);
  }

  async testEncryption() {
    try {
      const encryptedData = await this.encryptionService.encrypt('Hello, world!');
      localStorage.setItem('encrypted', JSON.stringify(encryptedData));
  
      const retrievedData = JSON.parse(localStorage.getItem('encrypted') || '');
      const decryptedData = await this.encryptionService.decrypt(retrievedData);
      
    } catch (error) {
      console.error('Error during encryption or decryption', error);
    }
  }

  
  @Input() error: string | null | undefined;


}
