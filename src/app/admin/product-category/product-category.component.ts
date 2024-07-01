import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreateProductCategoryComponent} from "./create-product-category/create-product-category.component";
import {KeycloakAuthorizationService} from "../../services/keycloak-authorization-service";
import {ProductCategoryServices} from "../../services/product-category-services";


@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css'
})
export class ProductCategoryComponent implements OnInit {
  permissionList: Array<any> = [];
  canCreateCategory = signal(false);
  canViewCategoryList = signal(false);

  constructor(private dialog: MatDialog, private keycloakAuthorizationService: KeycloakAuthorizationService, private productCategoryService: ProductCategoryServices) {
  }

  hasPermission(resourceId:string, permission: string, permissionList: any[]) {
    for (let item of this.permissionList) {
      if (item?.rsname == resourceId && item.scopes?.includes(permission)) {
        return true;
      }
    }
    return false;
  }

  async ngOnInit(): Promise<void> {
    await this.keycloakAuthorizationService.onReady();
    this.keycloakAuthorizationService.getPermission('catalog-services', [{
      id: 'CategoryResource'
    }]).then((rpt: string) => {
      this.permissionList = this.keycloakAuthorizationService.getRptPermissions(rpt);
      this.canCreateCategory.set(this.hasPermission('CategoryResource', 'category:create', this.permissionList));
      this.canViewCategoryList.set(this.hasPermission('CategoryResource', 'category:view', this.permissionList));
    }, () => {}, () => {});
  }

  getListProductCategory() {
    this.productCategoryService.getCategoryList()
  }

  openDialog() {
    this.dialog.open(CreateProductCategoryComponent, {
      width: '60%',
      disableClose: true
    });
  }
}
