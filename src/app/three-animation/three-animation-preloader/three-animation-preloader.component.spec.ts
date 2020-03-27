import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeAnimationPreloaderComponent } from './three-animation-preloader.component';

describe('ThreeAnimationPreloaderComponent', () => {
  let component: ThreeAnimationPreloaderComponent;
  let fixture: ComponentFixture<ThreeAnimationPreloaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeAnimationPreloaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeAnimationPreloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
