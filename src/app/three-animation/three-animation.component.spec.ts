import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeAnimationComponent } from './three-animation.component';

describe('ThreeAnimationComponent', () => {
  let component: ThreeAnimationComponent;
  let fixture: ComponentFixture<ThreeAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeAnimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
