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
import { DatePipe } from '@angular/common';
import { OrderServicesService } from 'src/app/services/order-services.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  orderFormGroup!: FormGroup;
  stateList: any[] = [];
  organisationList: any[] = [];
  workTypeList:any[]=[];
  customerList:any[]=[];
  employeeList:any[]=[];
  studentList:any[]=[];
  getAllOrderdArray:any[]=[];
  employeeServiceArrary:any[]=[];
  workTypeId:number=0;
  showDiv:boolean=false;
  showDivStudentExists:boolean=false;
  organisationName: string = '';
  address: string = '';
  city: string = '';
  contactNumber: string = '';
  workingDate:string='';
  workingTime:string='';
  customerName:any;
  gurardainName:any;
  dob:any;
  orderDate:any;
  qualification:any;
  emailId: string = '';
  organisationPin: string = '';
  emailMobileNoCheckNgModel:string='';
  successMessage:number=0;
  rate:number=0;
  UserID:any;
  organisationId:number=0;
  customerId:number=0;
  employeeId:number=0;
  totalAmount:number=0;
  tempTotalAmount:number=0;
  tempItemObj:object={};
  tempObj:object={};
   orderMaster: {
    customerId?: any;
    orderDate?: string;
    orderDescription?: string;
    organisationId?: number;
  } = {}; 
  orderDetails:object={};
  tempOrderArray:any[]=[];
  constructor(private customerService: CustomerService,
    public commonService: CommonService, public orderService: OrderServicesService) { 
      const user = localStorage.getItem('user');
      if (user) {
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        console.log("user localUserID:", (this.UserID));
        console.log("user organisationId:", (this.organisationId));
      }
       this.getStateList(); 
       this.getOrganisationList();
       this.getAllCustomer(this.organisationId);
       this.getAllWorkType(this.organisationId);
       this.getAllOrder(this.organisationId);
       this.getAllEmployee(this.organisationId);
       this.getAllEmployeeServiceSchedule(this.organisationId);
    }
  selectedIndex = 0;
  ngOrderDate: string = '';
  ngModelcustomerId:number=0;
  ngModelorderDescription:string='';
  ngModelServiceTypeId:number=0;
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
  editTeacher(data:any){

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
  ngOnInit(): void {
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.ngOrderDate = val;
    this.orderFormGroup = new FormGroup({
      customerId: new FormControl(null,[Validators.required]),
      employeeId: new FormControl(null,[Validators.required]),
      serviceTypeId: new FormControl(1),
      orderDate: new FormControl(val),
      workingTime: new FormControl(),
      orderDescription: new FormControl(null),
      workTypeId: new FormControl(null,[Validators.required]),
      rate: new FormControl(null,[Validators.required]),
      workingDate: new FormControl(val),
      whatsappNumber:new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
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
  getAllCustomer($orgID:any){
    this.customerService.fetchAllCustomer($orgID).subscribe(response => {
      this.customerList = response.data;
      console.log("customerList list:", this.customerList);
    })
  }
  getAllEmployee($orgID:any){
    this.customerService.fetchAllEmployee($orgID).subscribe(response => {
      this.employeeList = response.data;
      console.log("employeeList list:", this.employeeList);
    })
  }
  getAllWorkType($orgID:any){
    this.customerService.fetchAllWorkType($orgID).subscribe(response => {
      this.workTypeList = response.data;
      console.log("workTypeList list:", this.workTypeList);
    })
  }
  changeWorkType($event: any){
    
    this.rate=$event.rate;
    console.log("WorkType:",this.rate);
    this.orderFormGroup.patchValue({ rate: this.rate });

  }
  changeCustomerId($event: any){
    console.log("customer id:",$event)
    this.ngModelcustomerId=$event.id;
  }
  getAllOrder($orgID: any) {
    this.orderService.fetchAllOrder($orgID).subscribe(response => {
      this.getAllOrderdArray = response.data;
      console.log("All Orderlist:",this.getAllOrderdArray);
    })
  }
  getAllEmployeeServiceSchedule($orgID: any) {
    this.employeeServiceArrary=[];
    this.orderService.fetchAllEmployeeServiceSchedule($orgID).subscribe(response => {
      this.employeeServiceArrary = response.data;
      console.log("All employeeServiceScheduleArrary:",this.employeeServiceArrary);
    })
  }
  getAllEmployeeServiceScheduleById($orgID: any,$id:any) {
    this.employeeServiceArrary=[];
    this.orderService.fetchAllEmployeeServiceScheduleById($orgID,$id).subscribe(response => {
      this.employeeServiceArrary = response.data;
      console.log("All employeeServiceScheduleArraryById:",this.employeeServiceArrary);
    })
  }
  getAllEmployeeServiceScheduleByDate($orgID: any,$date:any) {
    this.employeeServiceArrary=[];
    this.orderService.fetchAllEmployeeServiceScheduleByDate($orgID,$date).subscribe(response => {
      this.employeeServiceArrary = response.data;
      console.log("All employeeServiceScheduleArraryBydate:",this.employeeServiceArrary);
    })
  }
  getAllEmployeeServiceScheduleByDateTime($orgID: any,$date:any,$time:any) {
    this.employeeServiceArrary=[];
    this.orderService.fetchAllEmployeeServiceScheduleByDateTime($orgID,$date,$time).subscribe(response => {
      this.employeeServiceArrary = response.data;
      console.log("All employeeServiceScheduleArraryBydateTime:",this.employeeServiceArrary);
    })
  }
  changeServiceTypeId(id:any){
    console.log("Type Id:",id);
    this.ngModelServiceTypeId=id;
  }
  changeDateSchedule(workDate:any){
    const userDate=formatDate(new Date(workDate.target.value),"yyyy-MM-dd", 'en-US');
    this.getAllEmployeeServiceScheduleByDate(this.organisationId,userDate);
    console.log("workingDate:",userDate);
    this.workingDate=userDate;
    
  }
  onChangeDateTimeSchedule(workTime:any){
    console.log("workingDate:",this.workingDate);
    console.log("workingTime:",workTime);
    this.getAllEmployeeServiceScheduleByDateTime(this.organisationId,this.workingDate,workTime);
  }
  changeEmployeeSchedule(data:any){
    console.log("changeEmployeeSchedule:",data);
    this.getAllEmployeeServiceScheduleById(this.organisationId,data.id);
  }
  onGetAgent(id:any){
    this.orderFormGroup.patchValue({ employeeId:id});
  }
  editOrderReceived(data:any){

  }
  onAddOrder(){
    this.tempItemObj={};
    const now = new Date();
    let val = formatDate(new Date(now), 'yyyy-MM-dd', 'en');
    //this.orderDate=formatDate(new Date(this.orderFormGroup.value.orderDate),"yyyy-MM-dd", 'en-US')
   
    this.workTypeId = this.orderFormGroup.get('workTypeId')?.value;
    this.employeeId = this.orderFormGroup.get('employeeId')?.value;
    this.rate = this.orderFormGroup.get('rate')?.value;
    this.totalAmount = Number(this.totalAmount) + Number(this.rate);
    this.workingTime = this.orderFormGroup.get('workingTime')?.value;
    this.workingDate=formatDate(new Date(this.orderFormGroup.value.workingDate),"yyyy-MM-dd", 'en-US')
    const tempItem = this.orderFormGroup.value;
    let index = this.workTypeList.findIndex((x: { id: any; }) => x.id === tempItem.workTypeId);
    let index_emp = this.employeeList.findIndex((y: { id: any; }) =>y.id === tempItem.employeeId);
    this.tempItemObj = {
      workTypeId: this.workTypeId,
      employeeId: this.employeeId,
      serviceName: this.workTypeList[index].work_type_name,
      employeeName: this.employeeList[index_emp].employee_name,
      workingDate:this.workingDate,
      workingTime:this.workingTime,
      rate: this.rate
    }
    this.tempOrderArray.push(this.tempItemObj);
    this.tempTotalAmount = this.totalAmount;
    //this.isSave = true;
    this.getAllOrder(this.organisationId);
    this.orderFormGroup = new FormGroup({
      workTypeId: new FormControl(null,[Validators.required]),
      employeeId: new FormControl(null,[Validators.required]),
      rate: new FormControl(null,[Validators.required]),
      workingDate: new FormControl(val),
      workingTime: new FormControl()
    })
  }
  onDelete(index:any){
    const x = this.tempOrderArray[index];
    this.totalAmount = this.totalAmount - x.rate;
    this.tempTotalAmount = this.totalAmount;
    this.tempOrderArray.splice(index, 1);
  }
  onClear(){
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.orderFormGroup = new FormGroup({
      customerId: new FormControl(null,[Validators.required]),
      employeeId: new FormControl(null,[Validators.required]),
      orderDate: new FormControl(val),
      orderDescription: new FormControl(null),
      workTypeId: new FormControl(null,[Validators.required]),
      rate: new FormControl(null,[Validators.required]),
      ngOrderDate: new FormControl(val),
      workingTime: new FormControl()
     
    })
  }
  
  onOrderSave() {
  console.log("NgorderDescription:",this.ngModelorderDescription);
  this.orderDate = formatDate(this.ngOrderDate, 'yyyy-MM-dd', 'en');
  this.tempObj = {
       orderMaster: {
        customerId: this.ngModelcustomerId,
        serviceTypeId: this.ngModelServiceTypeId,
        orderDate:this.orderDate,
        orderDescription:this.ngModelorderDescription,
        organisationId: this.organisationId
      }, 
      orderDetails: Object.values(this.tempOrderArray)
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.saveOrderReceived(this.tempObj).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Order has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.onClear();
            console.log("Return order data:", response.data);
            this.selectedIndex=0;
            //this.getAllemployee(this.organisationId);
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
    //this.emailMobileNoCheck= this.orderFormGroup.get('emailMobileNoCheck')?.value;
    console.log("test:",$data.target.value);
    let emailOrMobile=$data.target.value;
    this.customerService.fetchCheckStudentExists(emailOrMobile).subscribe(response => {
      this.studentList=response.data;
      this.successMessage=response.success;
      if(this.successMessage>0){
        this.showDivStudentExists=true;
        this.customerName = this.studentList[0].ledger_name;
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
    this.orderFormGroup.patchValue({ contactNumber: this.orderFormGroup.value.whatsappNumber });

  }
  setDOBSQL(value: string) {
    this.orderFormGroup.patchValue({ dob: this.commonService.getSQLDate(value) });
  }

}
