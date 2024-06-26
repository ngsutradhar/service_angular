import { Component, OnInit } from '@angular/core';
import {MessageService} from "primeng/api";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {HttpClient, HttpHeaders} from "@angular/common/http";



@Component({
  selector: 'app-java-tokens',
  templateUrl: './java-tokens.component.html',
  styleUrls: ['./java-tokens.component.scss'],
  providers: [MessageService]
})
export class JavaTokensComponent implements OnInit {
  programCode1 = `
  public class Demo  
  {  
    public static void main(String args[])  
    {  
      System.out.println("javatpoint");  
    }  
  } `


  constructor(private messageService: MessageService) {



  }

  ngOnInit(): void {
  }

  onTabOpen(event: any) {
    const tabNames: string[] = ['DGET Function', 'DSUM Function','DAVERAGE Function','DCOUNT Function'];
    this.messageService.add({key: 'myKey1', severity:'info', summary:'VENV Explaining', detail: 'Function: ' + tabNames[event.index]});
  }

  onReject() {
    this.messageService.clear();
  }

}
