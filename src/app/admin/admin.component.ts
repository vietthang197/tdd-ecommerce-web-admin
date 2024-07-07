import {Component, OnInit, signal} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  username = signal("");

  constructor(private keycloakService: KeycloakService) {
  }

  toggleDrawer() {
  }

  async ngOnInit(): Promise<void> {
    const userProfile = await this.keycloakService.loadUserProfile();
    if (userProfile?.username) {
      this.username.set(userProfile.username);
    }
  }
}
