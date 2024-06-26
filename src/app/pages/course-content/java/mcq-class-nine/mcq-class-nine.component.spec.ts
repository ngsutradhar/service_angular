import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McqClassNineComponent } from './mcq-class-nine.component';

describe('McqClassNineComponent', () => {
  let component: McqClassNineComponent;
  let fixture: ComponentFixture<McqClassNineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McqClassNineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(McqClassNineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
