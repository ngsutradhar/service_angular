
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';
import { Pipe, PipeTransform } from '@angular/core';
import { Table } from 'primeng/table/table';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-all-income-report',
  templateUrl: './all-income-report.component.html',
  styleUrls: ['./all-income-report.component.scss']
})
export class AllIncomeReportComponent implements OnInit {
  UserID: any;
  organisationId: any;
  allIncomeReportFormGroup: FormGroup | any;
  getAllIncomeObj!: object;
  allIncomeListArray: any[] = [];
  searchTerm: any;
  isShowReport:boolean=false;
  totalIncome:number=0;
  constructor(public commonService: CommonService,
    private reportService: ReportService) {
    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }
  }

  ngOnInit(): void {
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.allIncomeReportFormGroup = new FormGroup({
      start_date: new FormControl(val),
      end_date: new FormControl(val),
      searchTerm:new FormControl()
    })
    this.allIncomeListArray=[];
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  setStartSQL(value: string) {
    this.allIncomeReportFormGroup.patchValue({ start_date: this.commonService.getSQLDate(value) });
  }
  setEndSQL(value: string) {
    this.allIncomeReportFormGroup.patchValue({ end_date: this.commonService.getSQLDate(value) });
  }
  clear(table: Table) {
    table.clear();
  }
  cols: any[] = [
    { field: 'transaction_master_id', header: 'Student To Course ID', customExportHeader: 'Student To Course ID' },
    { field: 'student_name' },
    { field: 'full_name' },
    { field: 'received_amount' }

  ];
  onIncomeReport() {
    this.isShowReport=true;
    this.totalIncome=0;
    this.getAllIncomeObj = {
      startDate: this.allIncomeReportFormGroup.value.start_date,
      endDate: this.allIncomeReportFormGroup.value.end_date,
      organisationId: this.organisationId
    }
    console.log(this.getAllIncomeObj);
    this.reportService.fetchAllIncomeReport(this.getAllIncomeObj).subscribe(response => {
      this.allIncomeListArray = response.data;
      console.log("allIncomeListArray:", this.allIncomeListArray);
      for (let val of this.allIncomeListArray) {
              
        this.totalIncome+=val.received_amount;
      }
      console.log('Total',this.totalIncome);
    })
  }

  onKeyUp(event:any){
    /* this.totalIncome=0;
    console.log(event.target.value);
    console.log("tesing event:",this.allIncomeListArray.filter(event.target.value));
    for (let val of this.allIncomeListArray) {
              
      this.totalIncome+=val.received_amount;
    } 
    console.log('Total',this.totalIncome);*/

  }
}
