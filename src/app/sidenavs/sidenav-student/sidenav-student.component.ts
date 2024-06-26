import { Component, OnInit } from '@angular/core';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-sidenav-student',
  templateUrl: './sidenav-student.component.html',
  styleUrls: ['./sidenav-student.component.scss']
})
export class SidenavStudentComponent implements OnInit {

  faAddressBook = faAddressBook;
  displayDigitalElectronic=false;
  displayJava=false;
  selectedIndex: number = 0;
  constructor() { }

  ngOnInit(): void {
  }
  toggleDigitalElectronics(){
    this.displayDigitalElectronic=!this.displayDigitalElectronic;
  }
  toggleJava(){
    this.displayJava=!this.displayJava;
  }
  onActivePayment(){
    this.selectedIndex = 1;
  }
}
