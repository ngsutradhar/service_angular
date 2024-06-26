import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-student-syllabus',
  templateUrl: './student-syllabus.component.html',
  styleUrls: ['./student-syllabus.component.scss']
})
export class StudentSyllabusComponent implements OnInit {
studentSyllabusArray:any[]=[];
tempNewsObj:object={};
organisationId:number=0;
UserID:number=0;
ledgerId:number=0;
defaultPicture:string='';
studentCourseHistoryArray:any=[];
  constructor(private commonService: CommonService
    ,private reportService: ReportService
    ,private route: ActivatedRoute
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
    }

  ngOnInit(): void {
    this.defaultPicture = this.commonService.getPublic() + '/syllabus_upload/';
  }
  getStudentToCourseRegistrationListLedgerId($ledgerID:any){
    this.reportService.fetchStudentToCourseRegistrationReportLedgerId($ledgerID).subscribe(response => {
      this.studentCourseHistoryArray=response.data;
      console.log("studentCourseHistoryArray:",this.studentCourseHistoryArray);
      this.tempNewsObj = {
        courseId: this.studentCourseHistoryArray[0].course_id,
        organisationId: this.organisationId
      }; 
      console.log("course ID:",this.studentCourseHistoryArray[0].course_id);
      this.getStudentSyllabusList();
      
    })
  }
  getStudentSyllabusList(){
    this.reportService.fetchStudentSyllabusListReport(this.tempNewsObj).subscribe(response => {
      this.studentSyllabusArray=response.data;
      console.log("studentSyllabusArray:",this.studentSyllabusArray);
    })
  }
}
