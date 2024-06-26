import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseContentProgrammingLanguageComponent } from './course-content-programming-language.component';

describe('CourseContentProgrammingLanguageComponent', () => {
  let component: CourseContentProgrammingLanguageComponent;
  let fixture: ComponentFixture<CourseContentProgrammingLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseContentProgrammingLanguageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseContentProgrammingLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
