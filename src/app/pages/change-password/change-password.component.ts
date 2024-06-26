import { Component, OnInit } from '@angular/core';
import { BijoyaRegistration } from 'src/app/models/bijoya-regitration.model';
import { BijoyaRegistrationService } from 'src/app/services/bijoya-registration.service';
import { CommonService } from 'src/app/services/common.service';
import { LitElement, html} from 'lit-element';
import 'fa-icons';
import { ReportService } from 'src/app/services/report.service';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { CourseService } from 'src/app/services/course.service';
import { StudentToCourseService } from 'src/app/services/student-to-course.service';
import { Table } from 'primeng/table/table';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
import { ToWords } from 'to-words';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';
import { AuthService } from 'src/app/services/auth.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  organisationId:number=0;
  UserID:number=0;
  organisationName:string='';
  organisationAddress:string='';
  organisationPin:string='';
  organisationContact:string='';
  organisationEmail:string='';
  organizationArray: any = [];
  comfirmPasswordBoolean: boolean=false;
  isBtnVisible:boolean=false;
  studentRegisterData!: object;
  studentNameArray: any[] = [];
  password:any;
  address: string = '';
  city: string = '';
  resultString:string='';
  contactNumber: string = '';
  emailId: string = '';
  organisationArray: any[] = [];
  userRegisterArray: any[] = [];
  studentInfoBoolean:boolean=false;
  isTeacher:number=0;
  isStudent:number=0;
  hiddenInput:boolean=false;
  changePasswordFormGroup!: FormGroup;
  studentUserFormGroup!: FormGroup;
  changePasswordData:object | undefined;
  studentComfirmPasswordBoolean: boolean=false;
  constructor( private reportService: ReportService
    , private commonService: CommonService
    , private courseService: CourseService
    , private studentToCourseService: StudentToCourseService
    , private transactionServicesService: TransactionServicesService
    , private authService: AuthService
    , private organisationService: OrganisationService
    , private studentService: StudentService

) {

const user = localStorage.getItem('user');
    if (user){
    this.UserID = JSON.parse(<string>user).uniqueId;
    this.organisationId = JSON.parse(<string>user).organisationId;
    console.log("user localUserID:",(this.UserID));
    console.log("user organisationId:",(this.organisationId));
    }
    this.getAllStudentName(this.organisationId);
    this.getAllUserType();
 }

  ngOnInit(): void {
    this.transactionServicesService.fetchOrganizationDetails(this.organisationId).subscribe(response => {
      this.organizationArray = response.data;
      console.log("organizationArray:", this.organizationArray);
      this.organisationName=response.data[0].organisation_name;
      this.organisationAddress=response.data[0].address;
      this.organisationPin=response.data[0].pin;
      this.organisationEmail=response.data[0].email_id;
      this.organisationContact=response.data[0].whatsapp_number;
      console.log("organisation_name:",this.organisationName);
       })

       this.changePasswordFormGroup = new FormGroup({
        password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
        confirm_password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
       })
    
       this.studentUserFormGroup = new FormGroup({
        org_id: new FormControl(0,[Validators.required]),
        //id: new FormControl(),
        student_id: new FormControl(null, [Validators.required]),
        student_name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
        student_password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
        student_confirm_password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
        student_mobile1: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
        student_user_type_id: new FormControl(8, [Validators.required]),
        student_email: new FormControl(null, [Validators.required, Validators.email])
      });
  }

  onClear(){
    this.isBtnVisible=false;
    this.changePasswordFormGroup = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      confirm_password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
    })
  }
  getAllStudentName($orgID:any) {
    this.studentService.fetchAllStudentByOrdID($orgID).subscribe(response => {
      this.studentNameArray = response.data;
      console.log("studentNameArray:", this.studentNameArray);
    })
  }
  changeStudentInfo(data: any) {
    this.studentInfoBoolean = true;
    console.log("Student data:", data);
     this.organisationName = data.organisation_name;
    this.address = data.address;
    this.city = data.city;
    this.isStudent=data.is_student;
    this.contactNumber = data.whatsapp_number;;
    this.emailId = data.email_id;
    this.organisationPin = data.pin; 
    if(this.isStudent>0){
      this.studentUserFormGroup.patchValue({ student_user_type_id: 8 });
      this.resultString='Student';
    }else{
      this.studentUserFormGroup.patchValue({ student_user_type_id: 7 });
      this.resultString='Teacher';
    }
    this.studentUserFormGroup.patchValue({ student_name: data.ledger_name });
    this.studentUserFormGroup.patchValue({ student_email: data.email_id });
    this.studentUserFormGroup.patchValue({ student_mobile1: data.whatsapp_number });
    
    this.studentUserFormGroup.patchValue({ org_id: data.organisation_id });
  }
  selectedIndex=0;
  onTabChanged(event:any){
    console.log(event)
  }
  onStudentBlur(event:any): void {
    this.password = this.studentUserFormGroup.get('student_password')?.value;
    console.log('student confirm password:',event.target.value);
    console.log('password:',this.password);
    if(this.password===event.target.value){
      this.studentComfirmPasswordBoolean=true;
    }
    else{
      this.studentComfirmPasswordBoolean=false;
    }
    
  }
  onBlur(event:any): void {
    this.password = this.changePasswordFormGroup.get('password')?.value;
    console.log('confirm password:',event.target.value);
    console.log('password:',this.password);
    if(this.password===event.target.value){
      this.comfirmPasswordBoolean=true;
    }
    else{
      this.comfirmPasswordBoolean=false;
    }
    
  }
  getAllUserType() {
    this.authService.fetchAllUserType().subscribe(response => {
      this.userRegisterArray = response.data;
      console.log("userRegisterArray:", this.userRegisterArray);
    })
  }
  /* onBlur(event:any): void {
    this.password = this.userFormGroup.get('password')?.value;
    console.log('confirm password:',event.target.value);
    console.log('password:',this.password);
    if(this.password===event.target.value){
      this.comfirmPasswordBoolean=true;
    }
    else{
      this.comfirmPasswordBoolean=false;
    }
    
  } */
  onStudentSave(){
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(this.studentUserFormGroup.value.student_password).end();
    this.studentRegisterData={
      ledger_id:this.studentUserFormGroup.value.student_id,
      organisation_id: this.studentUserFormGroup.value.org_id,
      user_name: this.studentUserFormGroup.value.student_name,
      password: passwordMd5,
      mobile1: this.studentUserFormGroup.value.student_mobile1,
      user_type_id: this.studentUserFormGroup.value.student_user_type_id,
      email: this.studentUserFormGroup.value.student_email
    }
     Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
       
        this.authService.saveUser(this.studentRegisterData).subscribe(response => {
          //this.showError = response.exception;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'User has been Registered',
              showConfirmButton: false,
              timer: 1500
            });
            
            this.onStudentClear();
            // this.showSuccess("Record added successfully");

          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Entry ..!!',
            text: error,
            footer: '<a href>Why do I have this issue?</a>',
            timer: 0
          });
        });

        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    }) 
  }
  onUpdate(){

  }
  onStudentClear(){
    this.studentUserFormGroup = new FormGroup({
      org_id: new FormControl(0,[Validators.required]),
      //id: new FormControl(),
      student_id: new FormControl(null, [Validators.required]),
      student_name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      student_password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      student_confirm_password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      student_mobile1: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      student_user_type_id: new FormControl(8, [Validators.required]),
      student_email: new FormControl(null, [Validators.required, Validators.email])
    });
  }
  onUpdatePassword() {
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(this.changePasswordFormGroup.value.password).end();
    this.changePasswordData={
      userId:this.UserID,
      password: passwordMd5
    }
     Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
       
        this.authService.changePasswordUser(this.changePasswordData).subscribe(response => {
          //this.showError = response.exception;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Password has been Changed!',
              showConfirmButton: false,
              timer: 1500
            });
            
            this.onClear();
            // this.showSuccess("Record added successfully");

          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Entry ..!!',
            text: error,
            footer: '<a href>Why do I have this issue?</a>',
            timer: 0
          });
        });

        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    }) 
  }


}
