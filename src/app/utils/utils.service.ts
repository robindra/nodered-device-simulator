import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  notifyDeviceInfoObs$ = new Subject();
  openViewModalObs$ = new Subject();
  constructor() {}

  notifyDeviceInfo(data: any) {
    this.notifyDeviceInfoObs$.next(data);
  }

  deviceInfoListener() {
    return this.notifyDeviceInfoObs$.asObservable();
  }

  notifyViewModal(deviceId: string, deviceInfo: any) {
    this.openViewModalObs$.next({deviceId: deviceId, deviceInfo: deviceInfo});
  }

  viewModalListenner() {
    return this.openViewModalObs$.asObservable();
  }
}
