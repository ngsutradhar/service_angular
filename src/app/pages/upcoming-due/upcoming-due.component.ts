import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-upcoming-due',
  templateUrl: './upcoming-due.component.html',
  styleUrls: ['./upcoming-due.component.scss']
})
export class UpcomingDueComponent implements OnInit {
  upcomingDueListArray:any=[];
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

    this.getStudentUpcomingDueList(this.organisationId);
  }

  getStudentUpcomingDueList($orgID:any){
    this.reportService.fetchStudentUpcomingDueListReport($orgID).subscribe(response => {
      this.upcomingDueListArray=response.data;
      console.log("UpcomingDueList:",this.upcomingDueListArray);
    })
  }
  getEventValue($event:any) :string {
    return $event.target.value;
  }
}
