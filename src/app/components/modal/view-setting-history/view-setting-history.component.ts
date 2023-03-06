import { OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-view-setting-history',
  templateUrl: './view-setting-history.component.html',
  styleUrls: ['./view-setting-history.component.css']
})
export class ViewSettingHistoryComponent implements OnInit {
  @Input('settingHistory') settingHistory: any;  
  @ViewChild('viewContent') viewContent: any;
  deviceData: any;
  constructor(private modalService: NgbModal, private _utilService: UtilsService) {

  } 

  ngOnInit(): void {    
    this._utilService.viewModalListenner().subscribe({
      next: (response: any) => {
        this.deviceData = response.deviceInfo;
        this.modalService.open(this.viewContent);
      }, error: (error: any) => {
        
      }
    });


  }
}
