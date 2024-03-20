import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {from, map, Observable} from "rxjs";

interface MenuItem {
  icon: string,
  label: string,
  url: string
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit{
  menuItems: MenuItem[] = [];
  username: string | undefined = '';

  constructor(private keycloakService: KeycloakService) {
  }

  isLoggedIn() {
    return this.keycloakService.isLoggedIn();
  }

  async ngOnInit(): Promise<void> {
    this.menuItems = [
      {
        icon: 'dashboard',
        label: 'Dashboard',
        url: 'dasboard'
      }
    ]
    if (this.keycloakService.isLoggedIn()) {
      this.keycloakService.loadUserProfile().then(value => {
        this.username = 'Xin chào ' + value.username;
      })
    }
  }


  doLogout() {
    this.keycloakService.logout('http://192.168.42.102:4200')
  }
}
