import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'dz-dashboard',
  templateUrl: 'app/dashboard.component.html'
})


export class DashboardComponent implements OnInit {

  constructor(title: Title, aR:ActivatedRoute) {
    let _title = aR.snapshot.data['title'] || 'DFT Dashboard';
    title.setTitle(_title);
  }

  ngOnInit() {
  }

}
