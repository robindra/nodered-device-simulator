import { Component } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';
import { ViewChild } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-set-info',
  templateUrl: './set-info.component.html',
  styleUrls: ['./set-info.component.css'],
})
export class SetInfoComponent implements OnInit {
  closeResult = '';
  deviceInfoForm: FormGroup = new FormGroup([]);
  deviceInfo: any;
  showTime: boolean = false;
  showSleep: boolean = true;
  showTimerOn: boolean = true;
  formSubmitted: boolean = false;
  temperature: number[] = []  
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('content') content: any;
  @Output('onUpdateDeviceInfo') onUpdateDeviceInfo = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _utilService: UtilsService
  ) {}

  ngOnInit(): void {
    console.log('closebutton', this.closebutton)
    this.temperature = Array(26).fill(1).map((val: number, index: number) => index + 5);
    console.log(this.temperature);
    this.deviceInfoForm = this.fb.group({
      state: ['false', [Validators.required]],
      temp: ['', [Validators.required]],
      vSwing: ['false', [Validators.required]],
      hSwing: ['false', [Validators.required]],
      speed: ['', [Validators.required]],
      turbo: ['false', [Validators.required]],
      sleep: ['false', [Validators.required]],
      sleepTime: [0],
      timerOn: ['false', [Validators.required]],
      onTime: [0],
      mode: ['', [Validators.required]],
    });
    this._utilService.deviceInfoListener().subscribe((data: any) => {
      this.deviceInfo = data;
      this.open(this.content);
    });

    this.deviceInfoForm.controls['sleep'].valueChanges.subscribe(
      (value: any) => {
        if (value == 'false') {
          this.deviceInfoForm.controls['sleepTime'].patchValue(0);
          this.deviceInfoForm.controls['sleepTime'].removeValidators(
            Validators.required
          );
        } else {
          this.deviceInfoForm.controls['sleepTime'].addValidators(
            Validators.required
          );
        }
        this.deviceInfoForm.controls['sleepTime'].updateValueAndValidity();
      }
    );

    this.deviceInfoForm.controls['timerOn'].valueChanges.subscribe(
      (value: any) => {
        if (value == 'false') {
          this.deviceInfoForm.controls['onTime'].patchValue(0);
          this.deviceInfoForm.controls['onTime'].removeValidators(
            Validators.required
          );
        } else {
          this.deviceInfoForm.controls['onTime'].addValidators(
            Validators.required
          );
        }
        this.deviceInfoForm.controls['onTime'].updateValueAndValidity();
      }
    );
  }

  get f() {
    return this.deviceInfoForm.controls;
  }

  open(content: any) {    
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(closebutton: any): void {
    this.closebutton = closebutton;
    this.formSubmitted = true;
    if ( this.deviceInfoForm.invalid ||     
      (this.f['sleep'].value == "true" && this.f['sleepTime'].value && this.f['sleepTime'].value <= 0) ||
      (this.f['timerOn'].value == "true" && this.f['onTime'].value && this.f['onTime'].value <= 0)
    ) {
      return;
    }
    this.deviceInfo = {
      ...this.deviceInfo,
      ...this.deviceInfoForm.value,
    };
    this.deviceInfoForm.reset();
    this.onUpdateDeviceInfo.emit(JSON.stringify(this.deviceInfo));
    // this.closeModal();
  }

  closeModal() {
    this.closebutton.nativeElement.click();
  }
}
