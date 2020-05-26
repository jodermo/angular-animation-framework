import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileDemoComponent } from './tile-demo.component';

describe('TileDemoComponent', () => {
  let component: TileDemoComponent;
  let fixture: ComponentFixture<TileDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
