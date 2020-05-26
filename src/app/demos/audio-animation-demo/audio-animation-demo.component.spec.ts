import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioAnimationDemoComponent } from './audio-animation-demo.component';

describe('AudioAnimationDemoComponent', () => {
  let component: AudioAnimationDemoComponent;
  let fixture: ComponentFixture<AudioAnimationDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioAnimationDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioAnimationDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
