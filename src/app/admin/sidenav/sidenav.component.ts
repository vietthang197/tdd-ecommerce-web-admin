import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {Sidebar, SidebarModule} from "primeng/sidebar";
import {MenuItem, MenuItemCommandEvent} from 'primeng/api';
import {Router} from "@angular/router";
import {MenubarModule} from "primeng/menubar";
import {BadgeModule} from "primeng/badge";
import {Ripple} from "primeng/ripple";
import {MenuModule} from "primeng/menu";
import {NgClass} from "@angular/common";
import {AvatarModule} from "primeng/avatar";
import {Button} from "primeng/button";
import {StyleClassModule} from "primeng/styleclass";


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  standalone: true,
  imports: [
    MenubarModule,
    BadgeModule,
    Ripple,
    MenuModule,
    NgClass,
    AvatarModule,
    SidebarModule,
    Button,
    StyleClassModule
  ],
  providers: []
})
export class SidenavComponent implements OnInit{

  @Input('username') username: string | undefined = '';

  sidebarVisible = false;

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(private keycloakService: KeycloakService, private router: Router) {
  }

  isLoggedIn() {
    return this.keycloakService.isLoggedIn();
  }

  closeCallback(e: MouseEvent) {
    this.sidebarRef.close(e);
  }

  async doLogout() {
    await this.keycloakService.logout('http://localhost:4200')
  }


  itemsMenu: MenuItem[] | undefined;
  itemsUserMenu: MenuItem[] | undefined;

  useSidebar() {}

  ngOnInit() {

    this.itemsMenu = [
      {
        label: 'Menu',
        icon: 'pi pi-align-justify',
        url: '',
        command: event => {
          this.sidebarVisible = true;
        }
      }
    ];

    this.itemsUserMenu = [
      {
        label: 'User info',
        icon: 'pi pi-user',
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: event => {
          this.keycloakService.logout('http://localhost:4200')
        }
      }
    ];
  }

  navigateTo(href: string) {
    this.router.navigate([href]).finally(() => {
      this.sidebarVisible = false;
    })
  }
}
