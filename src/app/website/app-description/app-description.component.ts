import { Component, OnInit } from '@angular/core';
import { TextContent } from '../text-content';

@Component({
  selector: 'app-app-description',
  templateUrl: './app-description.component.html',
  styleUrls: ['./app-description.component.css']
})
export class AppDescriptionComponent implements OnInit {

  text = TextContent;

  constructor() {
  }

  ngOnInit(): void {
  }

}
