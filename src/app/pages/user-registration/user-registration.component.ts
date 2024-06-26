import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
  userFormGroup!: FormGroup;
  studentUserFormGroup!: FormGroup;
  userRegisterData!: object;
  studentRegisterData!: object;
  userRegisterArray: any[] = [];
  password:any;
  organisationName: string = '';
  address: string = '';
  city: string = '';
  contactNumber: string = '';
  emailId: string = '';
  organisationPin: string = '';
  organisationArray: any[] = [];
  studentNameArray: any[] = [];
  allUserArray: any[] = [];
  organisationListById: any[] = [];
  companyInfoBoolean: boolean = false;
  studentInfoBoolean:boolean=false;
  comfirmPasswordBoolean: boolean=false;
  studentComfirmPasswordBoolean: boolean=false;
  hiddenInput:boolean=false;
  hiddenId:boolean=false;
  isBtnVisible:boolean=false;
  isTeacher:number=0;
  isStudent:number=0;
  resultString:string='';
  constructor(private organisationService: OrganisationService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.userFormGroup = new FormGroup({
      userId: new FormControl(0,[Validators.required]),
      id: new FormControl(),
      organisation_id: new FormControl(1, [Validators.required]),
      user_name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      confirm_password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      mobile1: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      user_type_id: new FormControl(1, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email])
    });
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
    this.getAllOrganisation();
    this.getAllStudentName();
    this.getAllUserType();
    this.getAllUserList();
  }
  active = 0;
  selectedIndex = 0
  onTabChanged(event: any) {
    console.log(event)
  }
  getAllOrganisation() {
    this.organisationService.fetchAllOrganisation().subscribe(response => {
      this.organisationArray = response.data;
      console.log("organisationArray:", this.organisationArray);
    })
  }
  getAllStudentName() {
    this.organisationService.fetchAllStudentName().subscribe(response => {
      this.studentNameArray = response.data;
      console.log("studentNameArray:", this.studentNameArray);
    })
  }
  getAllUserList(){
    this.authService.fetchAllUserList().subscribe(response => {
      this.allUserArray = response.data;
      console.log("All User List:", this.allUserArray);
    })
  }
  getAllUserType() {
    this.authService.fetchAllUserType().subscribe(response => {
      this.userRegisterArray = response.data;
      console.log("userRegisterArray:", this.userRegisterArray);
    })
  }
  clear(table: Table) {
    table.clear();
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  changeOrganisation(data: any) {
    this.companyInfoBoolean = true;
    console.log("data:", data);
    this.organisationName = data.organisation_name;
    this.address = data.address;
    this.city = data.city;;
    this.contactNumber = data.contact_number;;
    this.emailId = data.email_id;
    this.organisationPin = data.pin;
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
  onUpdate(){
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(this.userFormGroup.value.password).end();
    this.userRegisterData={
      userId:this.userFormGroup.value.userId,
      organisation_id: this.userFormGroup.value.organisation_id,
      user_name: this.userFormGroup.value.user_name,
      password: passwordMd5,
      mobile1: this.userFormGroup.value.mobile1,
      user_type_id: this.userFormGroup.value.user_type_id,
      email: this.userFormGroup.value.email
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Update This Record...!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.updateUser(this.userRegisterData).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'User has been Update',
              showConfirmButton: false,
              timer: 1500
            });
           
            this.onClear();
          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Entry ..!!',
            text: error,
            footer: '<a href>Why do I have this issue?</a>' ,
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
  onSave() {
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(this.userFormGroup.value.password).end();
    this.userRegisterData={
      organisation_id: this.userFormGroup.value.organisation_id,
      user_name: this.userFormGroup.value.user_name,
      password: passwordMd5,
      mobile1: this.userFormGroup.value.mobile1,
      user_type_id: this.userFormGroup.value.user_type_id,
      email: this.userFormGroup.value.email
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
       
        this.authService.saveUser(this.userRegisterData).subscribe(response => {
          //this.showError = response.exception;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'User has been Registered',
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
    this.password = this.userFormGroup.get('password')?.value;
    console.log('confirm password:',event.target.value);
    console.log('password:',this.password);
    if(this.password===event.target.value){
      this.comfirmPasswordBoolean=true;
    }
    else{
      this.comfirmPasswordBoolean=false;
    }
    
  }

  onClear(){
    this.isBtnVisible=false;
    this.userFormGroup = new FormGroup({
      userId: new FormControl(0,[Validators.required]),
      id: new FormControl(),
      organisation_id: new FormControl(1, [Validators.required]),
      user_name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      confirm_password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      mobile1: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      user_type_id: new FormControl(1, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email])
    });
    this.companyInfoBoolean = false;
    this.comfirmPasswordBoolean=false;
    this.studentComfirmPasswordBoolean=false;
    this.getAllOrganisation();
    this.getAllUserType();
    this.getAllUserList();
  }
  onEditUser(userData:any){
    console.log("userData:",userData);
    this.selectedIndex = 0;
    this.isBtnVisible=true;
    this.userFormGroup.patchValue({ userId: userData.id });
    this.userFormGroup.patchValue({ organisation_id: userData.organisation_id });
    this.userFormGroup.patchValue({ user_name: userData.user_name });
    this.userFormGroup.patchValue({ email: userData.email });
    this.userFormGroup.patchValue({ mobile1: userData.mobile1 });
    this.userFormGroup.patchValue({ user_type_id: userData.user_type_id });
    this.userFormGroup.patchValue({ password: userData.password });
    this.userFormGroup.patchValue({ confirm_password: userData.password });
  }
}
