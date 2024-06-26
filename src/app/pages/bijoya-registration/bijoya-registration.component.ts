import {Component, ErrorHandler, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ConfirmationService } from 'primeng/api';
import Swal from 'sweetalert2';

import { BijoyaRegistrationService } from 'src/app/services/bijoya-registration.service';
import {FormGroup, UntypedFormControl, FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import { BijoyaRegistration } from 'src/app/models/bijoya-regitration.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import {CommonService} from "../../services/common.service";

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-bijoya-registration',
  templateUrl: './bijoya-registration.component.html',
  styleUrls: ['./bijoya-registration.component.scss']
})
export class BijoyaRegistrationComponent implements OnInit {
  isDeviceXS = false;
  msgs: { severity: string; summary: string; detail: string }[] = [];
  showErrorMessage: boolean = false;
  errorMessage: any;
  errors: any={};

  bijoyaFormShow= true;
  saveStudentInfo : BijoyaRegistration={};





  studentData: {

    studentId?: number;
    studentName?: string;
    email?: string;
    contactNumber?: string;
    whatsappNumber?: string;
    telegramNumber?: string;
    memberNumber?: number
  } = {};

  studentInfo: BijoyaRegistration[] = [];
  studentInfoFormGroup = new FormGroup({
    studentName: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    email: new FormControl(null),
    contactNumber: new FormControl(null, [Validators.required]),
    whatsappNumber: new FormControl(null),
    telegramNumber: new FormControl(null),
    memberNumber: new FormControl(1, [Validators.required]),
  });


  constructor(
    // private confirmationService: ConfirmationService,
    private bijoyaRegistrationService: BijoyaRegistrationService,
    // private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private commonService: CommonService
  ) {
    this.isDeviceXS=commonService.getDeviceXs();
    // this.bijoyaRegistrationService.fetchAllStudentInfo();
  }

  ngOnInit(): void {

    this.bijoyaRegistrationService.saveStudentInfo(this.studentData);
    


  }


  saveStudent() {


    this.confirmationService.confirm({



      message: 'Do you want to Register?',
      header: 'I am Coming',
      icon: 'pi pi-info-circle',

      accept: () => {
        this.bijoyaRegistrationService.saveStudentInfo(this.studentInfoFormGroup.value).subscribe(response => {
          if (response.success==1){

            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'successfully registered',
              // showConfirmButton: false,
              timer: 1000
            });
            this.saveStudentInfo=response.data;
            this.studentInfoFormGroup.reset();
            this.bijoyaFormShow=false;
          }
        },error=>{
          this.showErrorMessage = true;
          this.errorMessage = error.message;
          const alerts: Alert[] = [{
            type: 'success',
            message: this.errorMessage,
          }]
          setTimeout(()=>{
            this.showErrorMessage = false;
          }, 20000);
          this.showError(error.statusText);
        })
      },
      reject: () => {

        this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });









  }




  // confirm() {
  //   console.log("test");
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to confirm ?',
  //     header: 'Confirm !',
  //     accept:()=>{console.log("Accepted")},
  //     reject:()=>{console.log("Rejected")}
  //   });
  // }




  showSuccess(successMessage: string) {
    this.messageService.add({severity:'success', summary: 'Success', detail: successMessage});
  }
  showError(message: string) {
    this.messageService.add({severity:'error', summary: 'Success', detail: message});
  }

  addWhatsappNumber(contactNumber: string){
    // @ts-ignore
    this.studentInfoFormGroup.get('whatsappNumber').setValue(contactNumber);
  }

  addTelegramNumber(contactNumber: string){
    // console.log("Whatapp");
    // @ts-ignore
    this.studentInfoFormGroup.get('telegramNumber')?.setValue(contactNumber);

  }

}
