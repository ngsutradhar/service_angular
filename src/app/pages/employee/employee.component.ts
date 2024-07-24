import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { CustomerService } from 'src/app/services/customer.service';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employeeRegistrationFormGroup!: FormGroup;
  stateList: any[] = [];
  organisationList: any[] = [];
  studentList:any[]=[];
  employeeList:any[]=[];
  showDiv:boolean=false;
  isShown:boolean=false;
  showDivStudentExists:boolean=false;
  organisationName: string = '';
  address: string = '';
  city: string = '';
  contactNumber: string = '';
  employeeName:any;
  gurardainName:any;
  dob:any;
  qualification:any;
  emailId: string = '';
  organisationPin: string = '';
  emailMobileNoCheckNgModel:string='';
  successMessage:number=0;
  UserID:any;
  organisationId:number=0;
  studentData: {
    employeeId?: any;
    episodeId?: string;
    employeeName?: string;
    billingName?: string;
    fatherName?: string;
    motherName?: string;
    guardainName?: string;
    relation?: string;
    dob?: string;
    doj?: string;
    employeeCategoryId?: string;
    address?: string;
    city?: string;
    district?: string;
    stateId?: string;
    pin?: string;
    contactNumber?: string;
    whatsappNumber?: string;
    emailId?: string;
    guardianName?: string;
    userID?: number;
    sex?: string;
    qualification?: string;

    organisationId?: number;
  } = {};
  constructor(private customerService: CustomerService,
    public commonService: CommonService) { 
      const user = localStorage.getItem('user');
      if (user) {
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        console.log("user localUserID:", (this.UserID));
        console.log("user organisationId:", (this.organisationId));
      }
       this.getStateList(); 
       this.getOrganisationList();
       this.getAllemployee(this.organisationId);
    }
  selectedIndex = 0
  onTabChanged(event: any) {
    console.log(event)
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  clear(table: Table) {
    table.clear();
  }
  onClickAdd(){
    this.selectedIndex = 1;
  }
  
  deleteTeacher(data:any){

  }
  showDivClick(data:any){
    this.showDiv=true;
    console.log("data:", data);
    this.organisationName = data.organisation_name;
    this.address = data.address;
    this.city = data.city;;
    this.contactNumber = data.contact_number;;
    this.emailId = data.email_id;
    this.organisationPin = data.pin;
  }
  editEmployee(customerData:any){
    console.log("customer Details:",customerData);
    this.selectedIndex = 1;
    this.isShown=true;
    this.employeeRegistrationFormGroup.patchValue({ employeeId: customerData.id });
    this.employeeRegistrationFormGroup.patchValue({ employeeName: customerData.employee_name });
    this.employeeRegistrationFormGroup.patchValue({ employeeCategoryId: customerData.employee_category_named });
    this.employeeRegistrationFormGroup.patchValue({ address: customerData.address });
    this.employeeRegistrationFormGroup.patchValue({ emailId: customerData.email_id });
    this.employeeRegistrationFormGroup.patchValue({ guardianName: customerData.city }); 
    this.employeeRegistrationFormGroup.patchValue({ qualification: customerData.city }); 
    this.employeeRegistrationFormGroup.patchValue({ whatsappNumber: customerData.whatsapp_number });
    this.employeeRegistrationFormGroup.patchValue({ contactNumber: customerData.contact_number });
    this.employeeRegistrationFormGroup.patchValue({ stateId: customerData.state_id });
    this.employeeRegistrationFormGroup.patchValue({ pin: customerData.pin });
    this.employeeRegistrationFormGroup.patchValue({ district: customerData.district });
    this.employeeRegistrationFormGroup.patchValue({ sex: customerData.city }); 
    this.employeeRegistrationFormGroup.patchValue({ doj: customerData.city }); 
    this.employeeRegistrationFormGroup.patchValue({ dob: customerData.city }); 
  }
  ngOnInit(): void {
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.employeeRegistrationFormGroup = new FormGroup({
      employeeName: new FormControl(null,[Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      employeeCategoryId: new FormControl(1),
      address: new FormControl(null,[Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      city: new FormControl(null),
      guardianName: new FormControl(null),
      sex: new FormControl(null),
      qualification: new FormControl("MCA"),
      district: new FormControl(null),
      pin: new FormControl(null),
      doj: new FormControl(val),
      dob: new FormControl(val),
      contactNumber: new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      whatsappNumber:new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      emailId: new FormControl(null), 
      stateId: new FormControl(20),
      employeeId: new FormControl(0)
    })
  }
 getStateList(){
    this.customerService.fetchAllStates().subscribe(response => {
      this.stateList=response.data;
      console.log("stateList:",this.stateList);
    })
  } 
  getOrganisationList(){
    this.organisationList=[];
    this.customerService.fetchAllOrganisaction().subscribe(response => {
      this.organisationList=response.data;
      console.log("organisationList:",this.organisationList);
    })
  } 
  getAllemployee($orgID:any){
    this.customerService.fetchAllEmployee($orgID).subscribe(response => {
      this.employeeList = response.data;
      console.log("employeeList list:", this.employeeList);
    })
  }
  onClear(){
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.employeeRegistrationFormGroup = new FormGroup({
      employeeName: new FormControl(null,[Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      employeeCategoryId: new FormControl(1),
      address: new FormControl(null,[Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      city: new FormControl(null),
      sex: new FormControl(null),
      guardianName: new FormControl(null),
      qualification: new FormControl("MCA"),
      district: new FormControl(null),
      pin: new FormControl(null),
      doj: new FormControl(val),
      dob: new FormControl(val),
      contactNumber: new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      whatsappNumber:new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      emailId: new FormControl(null), 
      stateId: new FormControl(20),
      employeeId: new FormControl(0)
    })
  }
  onUpdate(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Update This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentData.employeeId = this.employeeRegistrationFormGroup.value.employeeId;
        this.studentData.employeeName = this.employeeRegistrationFormGroup.value.employeeName;
        this.studentData.employeeCategoryId = this.employeeRegistrationFormGroup.value.employeeCategoryId;
        this.studentData.address = this.employeeRegistrationFormGroup.value.address;
        this.studentData.city = this.employeeRegistrationFormGroup.value.city;
        this.studentData.district = this.employeeRegistrationFormGroup.value.district;
        this.studentData.stateId = this.employeeRegistrationFormGroup.value.stateId;
        this.studentData.pin = this.employeeRegistrationFormGroup.value.pin;
        this.studentData.dob = formatDate(this.employeeRegistrationFormGroup.value.dob, 'yyyy-MM-dd', 'en');
        this.studentData.doj = formatDate(this.employeeRegistrationFormGroup.value.doj, 'yyyy-MM-dd', 'en');
        this.studentData.sex = this.employeeRegistrationFormGroup.value.sex;
        this.studentData.qualification = this.employeeRegistrationFormGroup.value.qualification;
        this.studentData.guardianName = this.employeeRegistrationFormGroup.value.guardianName;
        this.studentData.contactNumber = this.employeeRegistrationFormGroup.value.contactNumber;
        this.studentData.whatsappNumber = this.employeeRegistrationFormGroup.value.whatsappNumber;
        this.studentData.emailId = this.employeeRegistrationFormGroup.value.emailId;
        this.studentData.organisationId = this.organisationId;

        this.customerService.saveEmployeeRegistration(this.studentData).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Employee has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.onClear();
            console.log("Return employee data:", response.data);
            this.selectedIndex=0;
            this.getAllemployee(this.organisationId);
            //this.studentToCourseFormGroup.patchValue({ ledger_id: response.data.studentId });
          }

        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
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
    //console.log("jhjkhj");
    Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentData.employeeName = this.employeeRegistrationFormGroup.value.employeeName;
        this.studentData.employeeCategoryId = this.employeeRegistrationFormGroup.value.employeeCategoryId;
        this.studentData.address = this.employeeRegistrationFormGroup.value.address;
        this.studentData.city = this.employeeRegistrationFormGroup.value.city;
        this.studentData.district = this.employeeRegistrationFormGroup.value.district;
        this.studentData.stateId = this.employeeRegistrationFormGroup.value.stateId;
        this.studentData.pin = this.employeeRegistrationFormGroup.value.pin;
        this.studentData.dob = formatDate(this.employeeRegistrationFormGroup.value.dob, 'yyyy-MM-dd', 'en');
        this.studentData.doj = formatDate(this.employeeRegistrationFormGroup.value.doj, 'yyyy-MM-dd', 'en');
        this.studentData.sex = this.employeeRegistrationFormGroup.value.sex;
        this.studentData.qualification = this.employeeRegistrationFormGroup.value.qualification;
        this.studentData.guardianName = this.employeeRegistrationFormGroup.value.guardianName;
        this.studentData.contactNumber = this.employeeRegistrationFormGroup.value.contactNumber;
        this.studentData.whatsappNumber = this.employeeRegistrationFormGroup.value.whatsappNumber;
        this.studentData.emailId = this.employeeRegistrationFormGroup.value.emailId;
        this.studentData.organisationId = this.organisationId;

        this.customerService.saveEmployeeRegistration(this.studentData).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Employee has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.onClear();
            console.log("Return employee data:", response.data);
            this.selectedIndex=0;
            this.getAllemployee(this.organisationId);
            //this.studentToCourseFormGroup.patchValue({ ledger_id: response.data.studentId });
          }

        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
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

  onGo($data:any){
    //this.emailMobileNoCheck= this.employeeRegistrationFormGroup.get('emailMobileNoCheck')?.value;
    console.log("test:",$data.target.value);
    let emailOrMobile=$data.target.value;
    this.customerService.fetchCheckStudentExists(emailOrMobile).subscribe(response => {
      this.studentList=response.data;
      this.successMessage=response.success;
      if(this.successMessage>0){
        this.showDivStudentExists=true;
        this.employeeName = this.studentList[0].ledger_name;
        this.address = this.studentList[0].address;
        this.gurardainName = this.studentList[0].guardian_name;;
        this.dob = this.studentList[0].dob;
        this.qualification = this.studentList[0].qualification;
        this.organisationName=this.studentList[0].organisation_name;
      }
      else{
        this.showDivStudentExists=false;
      }
      console.log("studentList:",this.studentList);
      console.log("successMessage:",this.successMessage);
    })
  }
  sameAsWhatsAppNo() {
    this.employeeRegistrationFormGroup.patchValue({ contactNumber: this.employeeRegistrationFormGroup.value.whatsappNumber });

  }
  setDOBSQL(value: string) {
    this.employeeRegistrationFormGroup.patchValue({ dob: this.commonService.getSQLDate(value) });
  }
}
