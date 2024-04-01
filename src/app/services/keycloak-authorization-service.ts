import {Component, Injectable, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {KeycloakService} from "keycloak-angular";
import KeycloakAuthorization, { AuthorizationRequest, ResourcePermission, KeycloakAuthorizationPromise } from 'keycloak-js/dist/keycloak-authz';
import {jwtDecode} from "jwt-decode";


@Injectable({
  providedIn: 'root',
})
export class KeycloakAuthorizationService {

  private readonly _keycloakAuthorization: KeycloakAuthorization;

  constructor(private keycloakService: KeycloakService) {
    this._keycloakAuthorization = new KeycloakAuthorization(this.keycloakService.getKeycloakInstance());
  }

  async onReady() {
    //@ts-ignore
    await this._keycloakAuthorization.ready;
  }

  getPermission(resourceServerId: string, permissions: ResourcePermission[]) {
    this._keycloakAuthorization.rpt = null;
    return this._keycloakAuthorization.entitlement(resourceServerId, {
      submitRequest: false,
      permissions,
      incrementalAuthorization: false
    })
  }

  getRptPermissions(rpt: string) {
    //@ts-ignore
    return jwtDecode(rpt)?.authorization?.permissions
  }
}
