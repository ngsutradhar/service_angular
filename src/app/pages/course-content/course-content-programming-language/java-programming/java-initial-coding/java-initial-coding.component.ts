import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-java-initial-coding',
  templateUrl: './java-initial-coding.component.html',
  styleUrls: ['./java-initial-coding.component.scss'],
  providers: [MessageService]
})
export class JavaInitialCodingComponent implements OnInit {
  SubtractionCode = `
  import java.util.Scanner;
  public class FirstJavaProgram{
    public static void main(String[] args){
        
        Scanner sn ;
        sn = new Scanner(System.in);
        System.out.println("Enter a number: ");
        int x = sn.nextInt();
        System.out.println("Enter another number");
        int y = sn.nextInt();
        int z = x-y;
        System.out.println("The answer is " + z);
        sn.close();
    }
  }
  `

  constructor(private messageService: MessageService) { }

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
