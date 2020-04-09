import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDescriptionComponent } from './app-description.component';

describe('AppDescriptionComponent', () => {
  let component: AppDescriptionComponent;
  let fixture: ComponentFixture<AppDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
