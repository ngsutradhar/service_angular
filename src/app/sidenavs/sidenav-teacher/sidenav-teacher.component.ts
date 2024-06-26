import { Component, OnInit } from '@angular/core';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-sidenav-teacher',
  templateUrl: './sidenav-teacher.component.html',
  styleUrls: ['./sidenav-teacher.component.scss']
})
export class SidenavTeacherComponent implements OnInit {
  display=false;
  faAddressBook = faAddressBook;
  displayMaster=false;
  displayMaster_1=false;
  displayReport=false;
  constructor() { }

  ngOnInit(): void {
  }
  toggle(){
    this.display=!this.display;
  }
  toggleMaster(){
    this.displayMaster_1=false;
    this.displayMaster=!this.displayMaster;
    this.displayReport=false;
  }
  toggleMaster_transaction(){
    this.displayMaster=false;
    this.displayMaster_1=!this.displayMaster_1;
    this.displayReport=false;
  }
  toggleMaster_report(){
    this.displayMaster=false;
    this.displayMaster_1=false;
    this.displayReport=!this.displayReport;
  }
}
