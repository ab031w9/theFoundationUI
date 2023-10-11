import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {LoadingService} from  './services/loading.service';
import { Observable, finalize, of } from 'rxjs';


@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loader: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.totalRequests++;
    this.loader.setLoading(true);

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loader.setLoading(false);
        }
      })
    );
  }
}
