import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreateProductCategoryComponent} from "./create-product-category/create-product-category.component";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css'
})
export class ProductCategoryComponent {

  constructor(private dialog: MatDialog, private kcService: KeycloakService) {
  }

  openDialogCreateProduct() {
    this.dialog.open(CreateProductCategoryComponent, {
      width: '60%',
      disableClose: true
    });
  }

  doLogin() {
    this.kcService.login()
  }
}
