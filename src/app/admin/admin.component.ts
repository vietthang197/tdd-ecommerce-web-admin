import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  openedSideNav: boolean;
  username: any;

  constructor(private keycloakService: KeycloakService) {
    this.openedSideNav = false;
  }

  toggleDrawer() {
    this.openedSideNav = !this.openedSideNav;
  }

  async ngOnInit(): Promise<void> {
    const userProfile = await this.keycloakService.loadUserProfile();
    this.username = userProfile.username;
  }
}
