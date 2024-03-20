import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  openedSideNav: boolean;

  constructor() {
    this.openedSideNav = false;
  }

  toggleDrawer() {
    this.openedSideNav = !this.openedSideNav;
  }
}
