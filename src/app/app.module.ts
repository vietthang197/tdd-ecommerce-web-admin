import {APP_INITIALIZER, NgModule, provideExperimentalZonelessChangeDetection} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {KeycloakAngularModule, KeycloakEventType, KeycloakService} from "keycloak-angular";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {KeycloakAuthorizationService} from "./services/keycloak-authorization-service";

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
      },
      bearerExcludedUrls: ['/assets']
    });
}

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        KeycloakAngularModule], providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService]
        },
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi()),
        provideExperimentalZonelessChangeDetection()
    ] })
export class AppModule { }
