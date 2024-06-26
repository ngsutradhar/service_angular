import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-upcoming-birthday',
  templateUrl: './upcoming-birthday.component.html',
  styleUrls: ['./upcoming-birthday.component.scss']
})
export class UpcomingBirthdayComponent implements OnInit {
  birthdayArray:any=[];
  organisationId:number=0;
  UserID:number=0;
  constructor(private reportService: ReportService) { 
    const user = localStorage.getItem('user');
    if (user){
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:",(this.UserID));
      console.log("user organisationId:",(this.organisationId));
    }
  }

  ngOnInit(): void {
    this.getStudentBirthDay(this.organisationId);
  }

  getStudentBirthDay($orgID:any){
    this.reportService.fetchStudentBirthDayDaysReport($orgID).subscribe(response => {
      this.birthdayArray=response.data;
      console.log("birthdayArray:",this.birthdayArray);
    })
  }
  getEventValue($event:any) :string {
    return $event.target.value;
  }
  
}
