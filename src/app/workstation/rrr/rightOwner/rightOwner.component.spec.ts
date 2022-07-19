import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightOwnerComponent } from './rightOwner.component';

describe('RightOwnerComponent', () => {
  let component: RightOwnerComponent;
  let fixture: ComponentFixture<RightOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
