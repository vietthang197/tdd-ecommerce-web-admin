import {ChangeDetectionStrategy, Component, LOCALE_ID, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
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
import {SecurityUtilities} from "../../utilities/security-utilities";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {KeyFilterModule} from "primeng/keyfilter";
import {CreateCategoryDto} from "../../dto/create-category-dto";
import {ErrorCode} from "../../utilities/error-code";
import {ToastModule} from "primeng/toast";
import {formatDate} from "@angular/common";
import {fromIterable} from "rxjs/internal/observable/innerFrom";
import {from, map, pipe, switchMap, toArray} from "rxjs";
import {DeleteEntityDto} from "../../dto/delete-entity-dto";


@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css',
  standalone: true,
  imports: [ButtonModule, CardModule, SidebarModule, AvatarModule, Ripple, StyleClassModule, MenubarModule,
    TableModule, PaginatorModule, DialogModule, InputTextModule, DividerModule, CalendarModule,
    InputGroupModule, ProgressBarModule, ProgressSpinnerModule, ReactiveFormsModule, ConfirmDialogModule,
    AutoCompleteModule, KeyFilterModule, ToastModule],
  providers: [ConfirmationService, MessageService]
})
export class ProductCategoryComponent implements OnInit {

  constructor(private keycloakAuthorizationService: KeycloakAuthorizationService, private productCategoryService: ProductCategoryServices,
              private confirmationService: ConfirmationService, private messageService: MessageService) {
  }

  permissionList: Array<any> = [];
  canCreateCategory = signal(false);
  canViewCategoryList = signal(false);
  canEditCategory = signal(false);
  canDeleteCategory = signal(false);

  first = signal(0);
  rows = signal(10);
  totalRecords = signal(0);
  categoryList: WritableSignal<ProductCategoryDto[]> = signal([]);
  selectedCategoryProduct: ProductCategoryDto[] = [];

  //crud
  showDiaglogCreateCategory = signal(false);
  disableCategoryUrl = signal(true);
  loadingSaveForm = signal(false);

  // form
  productCategoryFormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.max(100)]),
    url: new FormControl({value: null, disabled: true}, [Validators.required]),
    activeStartDate: new FormControl<Date | null>(null, [Validators.required]),
    activeEndDate: new FormControl<Date | null>(null),
    description: new FormControl(null, [Validators.max(100)]),
    parentCategory: new FormControl<object | null>(null),
    metaTitle: new FormControl(null, [Validators.max(100)]),
    metaDescription: new FormControl(null, [Validators.max(100)]),
  });
  loadingPreCreate = signal(false);

  filteredParentCategory: any[] = [];
  allProductCategory: ProductCategoryDto[] | null = [];

  async ngOnInit(): Promise<void> {
    await this.keycloakAuthorizationService.onReady();
    this.keycloakAuthorizationService.getPermission('catalog-services', [{
      id: 'CategoryResource'
    }]).then((rpt: string) => {
      this.permissionList = this.keycloakAuthorizationService.getRptPermissions(rpt);
      this.canCreateCategory.set(SecurityUtilities.hasPermission('CategoryResource', 'category:create', this.permissionList));
      this.canViewCategoryList.set(SecurityUtilities.hasPermission('CategoryResource', 'category:view', this.permissionList));
      this.canEditCategory.set(SecurityUtilities.hasPermission('CategoryResource', 'category:edit', this.permissionList));
      this.canDeleteCategory.set(SecurityUtilities.hasPermission('CategoryResource', 'category:delete', this.permissionList));
    }, () => {
    }, () => {
    });

    this.getListProductCategory(this.first(), this.rows());

    this.productCategoryFormGroup.controls['name'].valueChanges.subscribe(value => {
      if (value) {
        // @ts-ignore
        this.productCategoryFormGroup.controls['url'].setValue(Utilities.toSlug(value));
      }
    })
  }

  getListProductCategory(first: number, rows: number) {
    this.first.set(first);
    this.rows.set(rows);
    this.productCategoryService.getCategoryList(first, rows).subscribe(value => {
      this.categoryList.set(value.data.content);
      this.totalRecords.set(value.data.totalElements);
    })
  }

  onPageChange(e: PaginatorState) {
    // @ts-ignore
    this.getListProductCategory(e.first, e.rows);
  }

  closeProductCategoryDialog(event: Event) {
    event.stopPropagation();
    alert('fuck')
    this.showDiaglogCreateCategory.set(false);
    this.productCategoryFormGroup.reset()
  }

  toggleEditCategoryUrl() {
    if (this.disableCategoryUrl()) {
      this.productCategoryFormGroup.controls['url'].enable();
      this.disableCategoryUrl.set(false);
    } else {
      this.productCategoryFormGroup.controls['url'].disable();
      this.disableCategoryUrl.set(true);
    }
  }

  deleteItem(category: ProductCategoryDto, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xoá bản ghi này?',
      header: 'Cảnh báo',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-sm p-button-text",
      acceptButtonStyleClass: "p-button-danger p-button-sm p-button-text",
      accept: () => {
        console.log('Delete categoryId' + category.categoryId)
      },
      reject: () => {

      }
    });
  }

  filterParentCategory(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.allProductCategory as any[]).length; i++) {
      let categoryItem = (this.allProductCategory as any[])[i];
      if (categoryItem.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(categoryItem);
      }
    }

    this.filteredParentCategory = filtered;
  }

  openCreateProductCategoryDialog() {
    this.loadingPreCreate.set(true);
    this.productCategoryService.findAll().subscribe({
      next: (value) => {
        this.showDiaglogCreateCategory.set(true);
        this.allProductCategory = value.data;
      },
      error: (error) => {

      }, complete: () => {
        this.loadingPreCreate.set(false);
      }
    })
  }

  saveProductCategory() {
    const request: CreateCategoryDto = {
      // @ts-ignore
      activeEndDate: formatDate(this.productCategoryFormGroup.controls['activeEndDate'].value, 'dd/MM/yyyy HH:mm:ss', 'vi-VN'),
      // @ts-ignore
      activeStartDate: this.productCategoryFormGroup.controls['activeStartDate'].value ? formatDate(this.productCategoryFormGroup.controls['activeStartDate'].value, 'dd/MM/yyyy HH:mm:ss', 'vi-VN') : null,
      description: this.productCategoryFormGroup.controls['description'].value,
      name: this.productCategoryFormGroup.controls['name'].value,
      url: this.productCategoryFormGroup.controls['url'].value,
      metaTitle: this.productCategoryFormGroup.controls['metaTitle'].value,
      metaDescription: this.productCategoryFormGroup.controls['metaDescription'].value
    }
    this.loadingSaveForm.set(true);
    this.productCategoryService.createCategory(request).subscribe({
      next: (value) => {
        if (value.errCode === ErrorCode.GW200) {
          this.loadingSaveForm.set(false);
          this.productCategoryFormGroup.reset();
          this.showDiaglogCreateCategory.set(false);
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Create Category Successful'});
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Create Category Error with message: ' + value.errMessage
          });
        }
      },
      error: (error) => {
        this.loadingSaveForm.set(false);
        this.productCategoryFormGroup.reset();
        this.showDiaglogCreateCategory.set(false);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Create Category Error'});
      },
      complete: () => {
        this.getListProductCategory(this.first(), this.rows());
      }
    })
  }

  deleteListCategory() {
    fromIterable(this.selectedCategoryProduct).pipe(map(value => value.categoryId), toArray())
      .pipe(
        switchMap(ids => this.productCategoryService.deleteListCategory({
          ids: ids
        }))
      ).subscribe({
      next: (value) => {

      },
      error: err => {

      }, complete: () => {

      }
    })
  }
}
