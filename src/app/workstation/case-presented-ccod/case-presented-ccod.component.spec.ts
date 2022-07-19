import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasePresentedCcodComponent } from './case-presented-ccod.component';

describe('CasePresentedCcodComponent', () => {
  let component: CasePresentedCcodComponent;
  let fixture: ComponentFixture<CasePresentedCcodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasePresentedCcodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePresentedCcodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
