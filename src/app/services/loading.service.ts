import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  constructor() {}

  setLoading(isLoading: boolean) {
    this._loading.next(isLoading);
  }

  show() {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }
}