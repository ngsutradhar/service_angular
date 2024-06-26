import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent implements OnInit {
  studentProfileDetalilsArray:any[]=[];
  organisationName:string='';
  organisationAddress:string='';
  organisationPin:string='';
  organisationContact:string='';
  organisationEmail:string='';
  studentQualification:string='';
  studentAddress:string='';
  studentPin:string='';
  studentContact:string='';
  studentEmail:string='';
  organisationId:number=0;
  UserID:number=0;
  ledgerId:number=0;
  constructor(private commonService: CommonService
    ,private reportService: ReportService
    ,private route: ActivatedRoute
    , public authService: AuthService
    , private activatedRoute: ActivatedRoute
    , private studentService: StudentService) {
      const user = localStorage.getItem('user');
      if (user){
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        this.ledgerId = JSON.parse(<string>user).ledgerId;
        console.log("user localUserID:",(this.UserID));
        console.log("user organisationId:",(this.organisationId));
        console.log("Ledger id:",(this.ledgerId));
      }
      this.getTeacherProfile(this.ledgerId);
     }

  ngOnInit(): void {
  }

  getTeacherProfile($ledgerID: any) {
    this.studentService.fetchTeacherProfile($ledgerID).subscribe(response => {
     this.studentProfileDetalilsArray = response.data;
     this.organisationName=this.studentProfileDetalilsArray[0].organisation_name;
     this.studentAddress=this.studentProfileDetalilsArray[0].address;
     this.studentPin=this.studentProfileDetalilsArray[0].pin;
     this.studentContact=this.studentProfileDetalilsArray[0].whatsapp_number;
     this.studentEmail=this.studentProfileDetalilsArray[0].email_id;
     this.studentQualification=this.studentProfileDetalilsArray[0].qualification;
     this.organisationAddress=this.studentProfileDetalilsArray[0].organisationAddress;
     this.organisationPin=this.studentProfileDetalilsArray[0].organisationPin;
     this.organisationContact=this.studentProfileDetalilsArray[0].organisationContact;
     this.organisationEmail=this.studentProfileDetalilsArray[0].organisationEmail;
     console.log("studentProfileDetalilsArray :", this.studentProfileDetalilsArray);
   }) 
 }
}
