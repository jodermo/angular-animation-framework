import {
  Component,
  Input,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2, Output, EventEmitter,
} from '@angular/core';
import { AnimationService } from './services/animation.service';


@Component({
  selector: 'app-three-animation',
  templateUrl: './three-animation.component.html',
  styleUrls: ['./three-animation.component.css']
})
export class ThreeAnimationComponent implements OnDestroy, AfterViewInit {
  @Input() animation: AnimationService;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onStart = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onUpdate = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onFrameChange = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onEnd = new EventEmitter<any>();

  // tslint:disable-next-line:variable-name
  constructor(public elementRef: ElementRef, public renderer2: Renderer2) {
  }

  @ViewChild('animationContainer', {static: false}) containerElement: ElementRef;
  container;

  ngOnDestroy() {
    this.animation.destroy();
  }

  ngAfterViewInit() {
    this.init();
    this.animation.init();
    this.container = this.containerElement.nativeElement;
    this.animation.setupAnimationContainer(this.container, this.renderer2);
    this.animation.onStart((e) => {
      this.triggerStart(e);
    });
    this.animation.onFrameChange((e) => {
      this.triggerFrameChange(e);
    });
    this.animation.onUpdate((e) => {
      this.triggerUpdate(e);
    });
    this.animation.onUpdate((e) => {
      this.triggerEnd(e);
    });
  }

  onKeyDown(event) {
    this.animation.onKeyDown(event);
  }

  onKeyUp(event) {
    this.animation.onKeyUp(event);
  }

  triggerStart(event) {
    this.start();
    this.onStart.emit(event);
  }

  triggerFrameChange(event) {
    this.frameChange();
    this.onFrameChange.emit(event);
  }

  triggerUpdate(event) {
    this.onUpdate.emit(event);
  }

  triggerEnd(event) {
    this.onEnd.emit(event);
  }

  init() {
    // stuff before starting  animation
  }

  start() {
    // stuff when animation scene ready
  }

  frameChange() {
    // stuff for every frame
  }
}
