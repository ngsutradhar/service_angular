import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { ReportService } from 'src/app/services/report.service';
import { StudentToCourseService } from 'src/app/services/student-to-course.service';
import { StudentService } from 'src/app/services/student.service';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  organisationId:number=0;
  UserID:number=0;
  ledgerId:number=0;
  organisationName:string='';
  studentQualification:string='';
  studentName:string='';
  studentAddress:string='';
  studentPin:string='';

  gurdainName:string='';
  studentCity:string='';
  studentSex:string='';
  studentEntryDate:string='';

  studentContact:string='';
  studentEmail:string='';
  studentDOB:string='';
  organisationAddress:string='';
  organisationPin:string='';
  organisationContact:string='';
  organisationEmail:string='';
  studentProfileDetalilsArray:any[]=[];
  studentCourseHistoryArray:any=[];
  profileImageArray:any[]=[];
  defaultPicture: string = "";
  imageSrc: string | ArrayBuffer | null ="";
  constructor(private studentToCourseService: StudentToCourseService,
    private commonService: CommonService
    ,private reportService: ReportService
    ,private organisationService: OrganisationService
    ,private route: ActivatedRoute
    , public authService: AuthService
    , private activatedRoute: ActivatedRoute
    , private studentService: StudentService
    ,private transactionServicesService: TransactionServicesService) {
    const user = localStorage.getItem('user');
    if (user){
      const localUserID = JSON.parse(<string>user).uniqueId;
     /*  const organizationID = JSON.parse(<string>user).organisationId;
      console.log("organizationID:",organizationID); */
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      this.ledgerId = JSON.parse(<string>user).ledgerId;
      console.log("user localUserID:",(this.UserID));
      console.log("user organisationId:",(this.organisationId));
      console.log("Ledger id:",(this.ledgerId));

      this.getStudentProfile(this.ledgerId);
      this.getStudentToCourseRegistrationListLedgerId(this.ledgerId);
       this.getProfileImageById(this.organisationId,this.ledgerId);
     /*this.isShowProfile=true; */
      //this.imageSrc = this.commonService.getPublic() + '/profile_pic/profile_pic_' + localUserID + '.jpeg';
     
    }
   }

  ngOnInit(): void {
  }
  getStudentProfile($ledgerID: any) {
    this.studentService.fetchAllProfile($ledgerID).subscribe(response => {
     this.studentProfileDetalilsArray = response.data;
     this.organisationName=this.studentProfileDetalilsArray[0].organisation_name;
     this.studentAddress=this.studentProfileDetalilsArray[0].address;
     this.studentName=this.studentProfileDetalilsArray[0].ledger_name;
     this.studentPin=this.studentProfileDetalilsArray[0].pin;
     this.studentDOB=this.studentProfileDetalilsArray[0].dob;
     this.studentContact=this.studentProfileDetalilsArray[0].whatsapp_number;
     this.studentEmail=this.studentProfileDetalilsArray[0].email_id;
     this.studentQualification=this.studentProfileDetalilsArray[0].qualification;
     this.organisationAddress=this.studentProfileDetalilsArray[0].organisationAddress;
     this.organisationPin=this.studentProfileDetalilsArray[0].organisationPin;
     this.organisationContact=this.studentProfileDetalilsArray[0].organisationContact;
     this.organisationEmail=this.studentProfileDetalilsArray[0].organisationEmail;
     this.gurdainName=this.studentProfileDetalilsArray[0].guardian_name;
     this.studentCity=this.studentProfileDetalilsArray[0].city;
     this.studentSex=this.studentProfileDetalilsArray[0].sex;
     this.studentEntryDate=this.studentProfileDetalilsArray[0].entry_date;
     console.log("studentProfileDetalilsArray :", this.studentProfileDetalilsArray);
   }) 
   //window.location.reload();
 }
 getStudentToCourseRegistrationListLedgerId($ledgerID:any){
  this.reportService.fetchStudentToCourseRegistrationReportLedgerId($ledgerID).subscribe(response => {
    this.studentCourseHistoryArray=response.data;
    console.log("studentCourseHistoryArray:",this.studentCourseHistoryArray);
   /*  this.tempNewsObj = {
      courseId: this.studentCourseHistoryArray[0].course_id,
      organisationId: this.organisationId
    }; 
    console.log("course ID:",this.tempNewsObj);
    this.getStudentNewsList();
    */
  })
}
getProfileImageById($orgID:any,$ledgerID:any){
  this.authService.fetchProfileImage($orgID,$ledgerID).subscribe(response => {
    this.profileImageArray = response.data;
    console.log("Profile Images:", this.profileImageArray);
    if(this.profileImageArray[0].id>0){
      
      const imageName=this.profileImageArray[0].image_url;
      this.imageSrc = this.commonService.getPublic() + '/profile_pic/'+imageName;
    }else{
      this.defaultPicture = this.commonService.getPublic() + '/profile_pic/no_dp.png';
    }
  })
}
  
}
