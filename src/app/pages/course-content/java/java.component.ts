import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../../services/common.service";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-java',
  templateUrl: './java.component.html',
  styleUrls: ['./java.component.scss']
})
export class JavaComponent implements OnInit {
  isProduction = false;
  items: MenuItem[] = [
    {
      label: 'MCQ',
      icon:'pi pi-fw pi-file-excel',
      items: [
        {
          label: 'MCQ for Class IX',
          icon:'pi pi-fw pi-circle-fill',
          routerLink: "./McqClassNine"
        },


      ]
    },
    {
      label: 'Microsoft Word',
      icon:'pi pi-fw pi-user',
      // disabled: true,
      items: [
        {
          label: 'Left',
          icon:'pi pi-fw pi-align-left'
        },
        {
          label: 'Right',
          icon:'pi pi-fw pi-align-right'
        },
        {
          label: 'Center',
          icon:'pi pi-fw pi-align-center'
        },
        {
          label: 'Justify',
          icon:'pi pi-fw pi-align-justify'
        }
      ]
    },
    {
      label: 'Microsoft Powerpoint',
      icon:'pi pi-fw pi-user',
      // disabled: true,
      items: [

      ]
    },
    {
      label: 'Programming Language',
      icon:'pi pi-fw pi-pencil',
      items: [
        {
          label: 'C Language',
          icon:'pi pi-fw pi-star-fill'
        },
        {
          label: 'C++ Language',
          icon:'pi pi-fw pi-star-fill'
        },
        {
          label: 'JAVA',
          items: [
            {
              label: 'Java Tokens',
              icon:'pi pi-fw  pi-circle-fill',
              routerLink: "./JavaTokens",

            },
            {
              label: 'Java Initial Coding',
              icon:'pi pi-fw  pi-circle-fill',
              routerLink: "./JavaInitialCoding",

            }
          ]

        },
        {
          label: 'Python',
          icon:'pi pi-fw pi-star-fill'
        },
        {
          label: 'Angular js',
          icon:'pi pi-fw pi-star-fill'
        }
      ]
    },
    {
      label: 'Web Designing',
      icon:'pi pi-fw pi-user',
      // disabled: true,
      items: [
        {
          label: 'New',
          icon:'pi pi-fw pi-user-plus',

        },
        {
          label: 'Delete',
          icon:'pi pi-fw pi-user-minus',
        },
        {
          label: 'Search',
          icon:'pi pi-fw pi-users',
          items: [
            {
              label: 'Filter',
              icon:'pi pi-fw pi-filter',
              items: [
                {
                  label: 'Print',
                  icon:'pi pi-fw pi-print'
                }
              ]
            },
            {
              icon:'pi pi-fw pi-bars',
              label: 'List'
            }
          ]
        }
      ]
    },
    {
      label: 'Photoshop & Photography',
      icon:'pi pi-fw pi-calendar',
      // disabled: true,
      items: [
        {
          label: 'Edit',
          icon:'pi pi-fw pi-pencil',
          items: [
            {
              label: 'Save',
              icon:'pi pi-fw pi-calendar-plus'
            },
            {
              label: 'Delete',
              icon:'pi pi-fw pi-calendar-minus'
            }
          ]
        },
        {
          label: 'Archieve',
          icon:'pi pi-fw pi-calendar-times',
          items: [
            {
              label: 'Remove',
              icon:'pi pi-fw pi-calendar-minus'
            }
          ]
        }
      ]
    },
    {
      label: 'Data Structure',
      icon:'pi pi-fw pi-calendar',
      // disabled: true,
      items: [
        {
          label: 'Link List',
          icon:'pi pi-fw pi-pencil',
          items: [
            {
              label: 'Save',
              icon:'pi pi-fw pi-calendar-plus'
            },
            {
              label: 'Delete',
              icon:'pi pi-fw pi-calendar-minus'
            }
          ]
        },
        {
          label: 'Archieve',
          icon:'pi pi-fw pi-calendar-times',
          items: [
            {
              label: 'Remove',
              icon:'pi pi-fw pi-calendar-minus'
            }
          ]
        }
      ]
    }
  ];
  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
  }

}
