import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

interface MenuItem {
  icon: string,
  label: string,
  url: string
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent implements OnInit{
  menuItems: MenuItem[] = [];
  @Input('username') username: string | undefined = '';

  constructor(private keycloakService: KeycloakService) {
  }

  isLoggedIn() {
    return this.keycloakService.isLoggedIn();
  }

  async ngOnInit(): Promise<void> {
    this.menuItems = [
      {
        icon: 'dashboard',
        label: 'Loại sản phẩm',
        url: 'dasboard'
      }
    ]
  }


  async doLogout() {
    await this.keycloakService.logout('http://localhost:4200')
  }
}
