import { Component, OnInit } from '@angular/core';
import { SourceInfos } from '../source-infos';
import { TextContent } from '../text-content';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  text = TextContent;
  sourceInfos = SourceInfos;
  constructor() { }

  ngOnInit(): void {
  }

}
