import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { CourseService } from 'src/app/services/course.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-marksheet',
  templateUrl: './marksheet.component.html',
  styleUrls: ['./marksheet.component.scss']
})
export class MarksheetComponent implements OnInit {
  UserID: number = 0;
  organisationId: number = 0;
  studentsArray:any[]=[];
  subjectsArray:any[]=[];
  courseArray:any[]=[];
  tempObject:object={};
  marksheetFormGroup: FormGroup | any;
  marksheetToStudentFormGroup: FormGroup | any;
  constructor(public commonService: CommonService,
    private reportService: ReportService,
    private courseService: CourseService) { 
      const user = localStorage.getItem('user');
      if (user) {
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        console.log("user localUserID:", (this.UserID));
        console.log("user organisationId:", (this.organisationId));
      }
      this.getCourseList(this.organisationId);
      
    }

  ngOnInit(): void {
    this.marksheetFormGroup = new FormGroup({
      course_id: new FormControl(null, [Validators.required]),
      marks: new FormControl(null, [Validators.required]),
    });
   
  }
  onSaveMarks(data:any){

    const marks= this.marksheetFormGroup.value.marks;
    console.log("save data:",data);
    console.log("save marks:",marks);
  }
  getCourseList($orgID: any) {
    this.courseService.fetchAllCourses($orgID).subscribe(response => {
      this.courseArray = response.data;
      console.log("courseList:", this.courseArray);
    })
  }
  getStudentList(markData: any) {
    this.reportService.fetchStudentMarksList(markData).subscribe(response => {
      this.studentsArray = response.data;
      console.log("studentsArray:", this.studentsArray);
    })
  }
  getSubjectList($couseID: any) {
    this.reportService.fetchSubjectListByCourseId($couseID).subscribe(response => {
      this.subjectsArray = response.data;
      console.log("subjectsArray:", this.subjectsArray);
      /*for (let val of this.subjectsArray) {
         this.tempItemObj = {
          ledgerId: val.ledger_id,
          transactionTypeId: 2,
          feesName: val.ledger_name,
          amount: val.amount

        } */
    })
  }
  chooseSubject(data:any){
    console.log(data);
    this.getSubjectList(data.id);
    this.tempObject={
        couseId:data.id,
        organisationId:this.organisationId
      }
    this.getStudentList(this.tempObject);
  }
}
