import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {KeycloakAngularModule, KeycloakEventType, KeycloakService} from "keycloak-angular";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

function initializeKeycloak(keycloak: KeycloakService) {
  keycloak.keycloakEvents$.subscribe({
    next(event) {
      if (event.type == KeycloakEventType.OnTokenExpired) {
        keycloak.updateToken(20).then(console.log);
      }
    }
  });
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'ecommerce',
        clientId: 'webadmin'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    MatButton,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
