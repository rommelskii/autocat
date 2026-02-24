import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [NgIf],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  currentView: string = 'home';

  constructor() {
    this.currentView = 'home';
  }

  setView(view: string) {
    this.currentView = view;
  }
}
