import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { base64StringToBlob } from 'blob-util';
import { Observable } from 'rxjs';
import { apiLogin } from '../models/api-models/login.model';
import { uiLogin } from '../models/ui-models/login.model';

@Injectable({
  providedIn: 'root'
})
export class ImageRenderService {


  constructor(private httpClient: HttpClient, private readonly sanitizer: DomSanitizer) { 

  }
  base64toSafeUrlBlob(base64ImageData: any) {
    const contentType = 'image/png';
    const blob = base64StringToBlob(base64ImageData, contentType);

    const url = this.sanitizer.bypassSecurityTrustUrl (
      window.URL.createObjectURL(blob)
  );
   
   
      return url;
  }
}
