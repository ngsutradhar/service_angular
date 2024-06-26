import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-question-paper',
  templateUrl: './student-question-paper.component.html',
  styleUrls: ['./student-question-paper.component.scss']
})
export class StudentQuestionPaperComponent implements OnInit {

  tempNewsObj:object={};
  tempChargeObj:object={};
  tempReceicedObj:object={};
  studentQuestionArray:any[]=[];
  tempFeesReceivedArray:any[]=[];
  organisationId:number=0;
  UserID:number=0;
  payAmountNgModel: number = 0;
  paymentAmount:number=0;
  merchantId:any;
  apiKey:any;
  merchantUserId:any;
  transactionMonth:any;
  transactionYear:any;
  ledgerId:number=0;
  defaultPicture: string = "";
  studentCourseHistoryArray:any[]=[];
  FinalPayFormGroup: any;
  datePipe: any;
  autoGenerateId:number=0;
  isShowBtn:boolean=false;
  constructor(private commonService: CommonService
    ,private reportService: ReportService
    ,private route: ActivatedRoute
    ,private transactionServicesService: TransactionServicesService
    , public authService: AuthService) { 

      const user = localStorage.getItem('user');
      if (user){
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        this.ledgerId = JSON.parse(<string>user).ledgerId;
        console.log("user localUserID:",(this.UserID));
        console.log("user organisationId:",(this.organisationId));
        console.log("Ledger id:",(this.ledgerId));
      }
      this.getStudentToCourseRegistrationListLedgerId(this.ledgerId);
      this.randomNum(4999,99999999999);
  }

  ngOnInit(): void {
    this.defaultPicture = this.commonService.getPublic() + '/question_upload/';
    this.FinalPayFormGroup = new FormGroup({
      payAmount: new FormControl(null, [Validators.required]),
    })
  }
  getStudentToCourseRegistrationListLedgerId($ledgerID:any){
    this.reportService.fetchStudentToCourseRegistrationReportLedgerId($ledgerID).subscribe(response => {
      this.studentCourseHistoryArray=response.data;
      console.log("studentCourseHistoryArray:",this.studentCourseHistoryArray);
      this.tempNewsObj = {
        courseId: this.studentCourseHistoryArray[0].course_id,
        organisationId: this.organisationId
      }; 
      console.log("course ID:",this.tempNewsObj);
      this.getStudentQuestionList();
      
    })
  }
  getStudentQuestionList(){
    this.reportService.fetchStudentQuestionPaperList(this.tempNewsObj).subscribe(response => {
      this.studentQuestionArray=response.data;
      console.log("studentQuestionArray:",this.studentQuestionArray);
    })
  }
  
 
  getEventValue($event: any): string {
    return $event.target.value;
  }
  clear(table: Table) {
    table.clear();
  } 
  randomNum(min:number, max:number) {
    this.autoGenerateId=Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
