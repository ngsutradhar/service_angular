import { Component, OnInit } from '@angular/core';
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
import { DeveloperService } from 'src/app/services/developer.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.scss']
})
export class DeveloperComponent implements OnInit {

  selectedIndex: number = 0;

  totalNoActiveOrganisation:number=0;
  totalNoStudent:number=0;
  organisationId:number=0;
  totalCashYear:number=0;
  totalBankYear:number=0;
  totalNetIncome:number=0;
  AllOrgDetailsArray:any[]=[];
  AllOrgFeesChargedArray:any[]=[];
  AllOrgFeesReceivedArray:any[]=[];
  UserID:number=0;
  organisationName:string='';
  organisationAddress:string='';
  organisationPin:string='';
  organisationContact:string='';
  organisationEmail:string='';
  organizationArray: any = [];

  title = 'ng2-charts-demo';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;
  constructor(private reportService: ReportService
    , private commonService: CommonService
    , private courseService: CourseService
    , private studentToCourseService: StudentToCourseService
    , private transactionServicesService: TransactionServicesService
    , private developerService: DeveloperService) { 

      const user = localStorage.getItem('user');
      if (user){
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        console.log("user localUserID:",(this.UserID));
        console.log("user organisationId:",(this.organisationId));
      }
      this.getTotalActiveOrganisation();
      this.getTotalStudent();
      this.getTotalIncomeDeveloper();
      this.getAllOrgDetails();
      this.getAllFeeChargedDeveloper();
      this.getAllFeeReceivedDeveloper();
    }

  ngOnInit(): void {
     //this.organisationId=1;
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

      
  }

  onClickedClosed() {
    this.selectedIndex = 0;
  }
  active=0;
  onTabChanged(event:any){
    console.log(event)
  }
  clear(table: Table) {
    table.clear();
  } 
  getEventValue($event:any) :string {
    return $event.target.value;
  }

  getTotalActiveOrganisation(){
    this.developerService.fetchTotalOrganisation().subscribe(response => {
      this.totalNoActiveOrganisation = response.data[0].totalOrganisation;
      console.log("totalNoActiveOrganisation:",this.totalNoActiveOrganisation);
    })
  }
  getTotalStudent(){
    this.developerService.fetchTotalStudent().subscribe(response => {
      this.totalNoStudent = response.data[0].total_student;
      console.log("totalNoStudent:",this.totalNoStudent);
    })
  }

  getTotalIncomeDeveloper(){
    this.developerService.fetchAllIncomeReportDeveloper().subscribe(response => {
      this.totalCashYear=response.data[0].total_cash_year;
      this.totalBankYear=response.data[0].total_bank_year;
      this.totalNetIncome=response.data[0].total_income;
      //console.log("UpcomingDueList:",this.upcomingDueListArray);
    })
  }

  getAllOrgDetails(){
    this.developerService.fetchAllOrgDetailsDeveloper().subscribe(response => {
      this.AllOrgDetailsArray=response.data;
      console.log("AllOrgDetailsArray:",this.AllOrgDetailsArray);
    })
  }

  getAllFeeChargedDeveloper() {
    this.developerService.fetchAllFeesChargedDeveloper().subscribe(response => {
      this.AllOrgFeesChargedArray = response.data;
      console.log("AllOrgFeesChargedArray:",this.AllOrgFeesChargedArray);
    })
  }
  getAllFeeReceivedDeveloper() {
    this.developerService.fetchAllFeesReceivedDeveloper().subscribe(response => {
      this.AllOrgFeesReceivedArray = response.data;
    })
  }
  deleteFeesCharged(feeDetails: any){
     console.log(feeDetails.id);
   

   Swal.fire({
      title: 'Are you sure?',
      text: 'Delete This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.developerService.fetchAllFeesChargedDeveloperDelete(feeDetails.id).subscribe(response => {
            if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Fees has been Delete',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllFeeChargedDeveloper();
            this.getAllFeeReceivedDeveloper();
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
  deleteAllFeesChargedAndReceived(feeDetails: any){
    console.log(feeDetails.studentCourseRegistrationId);
  

  Swal.fire({
     title: 'Are you sure?',
     text: 'Delete All Record...?',
     icon: 'info',
     showCancelButton: true,
     confirmButtonText: 'Yes, Save it!',
     cancelButtonText: 'No, keep it'
   }).then((result) => {
     if (result.isConfirmed) {
       this.developerService.deleteAllTransactionByStudentRegistrationId(feeDetails.studentCourseRegistrationId).subscribe(response => {
           if (response.success === 1) {
           Swal.fire({
             position: 'top-end',
             icon: 'success',
             title: 'Fees has been Delete',
             showConfirmButton: false,
             timer: 1500
           });
           this.getAllFeeChargedDeveloper();
           this.getAllFeeReceivedDeveloper();
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
  deleteFeesReceived(received:any){

  }
}
function rowIndex(rowIndex: any): any {
  throw new Error('Function not implemented.');
}

