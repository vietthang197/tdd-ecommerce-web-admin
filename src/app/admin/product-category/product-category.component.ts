import {ChangeDetectionStrategy, Component, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {KeycloakAuthorizationService} from "../../services/keycloak-authorization-service";
import {ProductCategoryServices} from "../../services/product-category-services";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {Sidebar, SidebarModule} from "primeng/sidebar";
import {AvatarModule} from "primeng/avatar";
import {Ripple} from "primeng/ripple";
import {StyleClassModule} from "primeng/styleclass";
import {MenubarModule} from "primeng/menubar";
import {TableModule} from "primeng/table";
import {ProductCategoryDto} from "../../dto/product-category-dto";
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {DividerModule} from "primeng/divider";
import {CalendarModule} from "primeng/calendar";
import {InputGroupModule} from "primeng/inputgroup";
import {ProgressBarModule} from "primeng/progressbar";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {Utilities} from "../../utilities/utilities";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";


@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css',
  standalone: true,
  imports: [ButtonModule, CardModule, SidebarModule, AvatarModule, Ripple, StyleClassModule, MenubarModule, TableModule, PaginatorModule, DialogModule, InputTextModule, DividerModule, CalendarModule, InputGroupModule, ProgressBarModule, ProgressSpinnerModule, ReactiveFormsModule]
})
export class ProductCategoryComponent implements OnInit {
  permissionList: Array<any> = [];
  canCreateCategory = signal(false);
  canViewCategoryList = signal(false);
  canEditCategory = signal(false);
  canDeleteCategory = signal(false);

  first = 0;
  rows = 10;
  totalRecords = 0;
  categoryList:WritableSignal<ProductCategoryDto[]> = signal([]);
  selectedCategoryProduct = [];

  //crud
  showDiaglogCreateCategory = false;
  disableCategoryUrl = true;

  // form
  productCategoryFormGroup = new FormGroup({
    categoryName: new FormControl(null, [Validators.required, Validators.max(100)]),
    categoryUrl: new FormControl({value: null, disabled: true}, [Validators.required]),
    activeStartDate: new FormControl(undefined, [Validators.required, Validators.max(100)]),
    activeEndDate: new FormControl(undefined, [Validators.max(100)]),
    description: new FormControl(null)
  });

  constructor(private keycloakAuthorizationService: KeycloakAuthorizationService, private productCategoryService: ProductCategoryServices) {
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
      this.canEditCategory.set(this.hasPermission('CategoryResource', 'category:edit', this.permissionList));
      this.canDeleteCategory.set(this.hasPermission('CategoryResource', 'category:delete', this.permissionList));
    }, () => {}, () => {});

    this.getListProductCategory(this.first, this.rows);
  }

  getListProductCategory(first: number, rows: number) {
    this.productCategoryService.getCategoryList(first, rows).subscribe(value => {
      this.categoryList.set(value.data.content);
      this.totalRecords = value.data.totalElements;
    })
  }

  onPageChange(e: PaginatorState) {
    // @ts-ignore
    this.getListProductCategory(e.first, e.rows);
  }

  updateCategoryUrl() {
    // this.categoryUrl = Utilities.toSlug(this.categoryName);
  }

  saveProductCategory() {

  }

  closeProductCategoryDialog() {
    this.showDiaglogCreateCategory = false;
  }

  toggleEditCategoryUrl() {
    if (this.disableCategoryUrl) {
      this.productCategoryFormGroup.controls['categoryUrl'].enable();
      this.disableCategoryUrl = false;
    } else {
      this.productCategoryFormGroup.controls['categoryUrl'].disable();
      this.disableCategoryUrl = true;
    }
  }
}
