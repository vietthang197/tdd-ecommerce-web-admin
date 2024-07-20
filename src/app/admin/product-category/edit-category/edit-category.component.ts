import {ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal} from '@angular/core';
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {SkeletonModule} from "primeng/skeleton";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductCategoryServices} from "../../../services/product-category-services";
import {SecurityUtilities} from "../../../utilities/security-utilities";
import {KeycloakAuthorizationService} from "../../../services/keycloak-authorization-service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {CalendarModule} from "primeng/calendar";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductCategoryDto} from "../../../dto/product-category-dto";
import {Utilities} from "../../../utilities/utilities";
import {ErrorCode} from "../../../utilities/error-code";
import moment from "moment";
import {TableModule} from "primeng/table";
import {CategoryAttributeDto} from "../../../dto/category-attribute-dto";
import {DialogModule} from "primeng/dialog";
import {Ripple} from "primeng/ripple";
import {CurrencyPipe, formatDate} from "@angular/common";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    Button,
    CardModule,
    SkeletonModule,
    ToastModule,
    AutoCompleteModule,
    CalendarModule,
    InputGroupModule,
    InputTextModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    Ripple,
    FormsModule,
    CurrencyPipe,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class EditCategoryComponent implements OnInit {

  constructor(private keycloakAuthorizationService: KeycloakAuthorizationService, private routerActive: ActivatedRoute,
              private productCategoryService: ProductCategoryServices, private messageService: MessageService, private router: Router,
              private confirmService: ConfirmationService) {

  }

  loadingDetail = signal(true);
  permissionList: Array<any> = [];
  canEditCategory = signal(false);

  //crud
  showDiaglogCreateCategory = signal(false);
  disableCategoryUrl = signal(true);
  loadingSaveFormAttribute = signal(false);
  // form
  productCategoryFormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.max(100)]),
    url: new FormControl({value: null, disabled: true}, [Validators.required]),
    activeStartDate: new FormControl<Date | null>(null, [Validators.required]),
    activeEndDate: new FormControl<Date | null>(null),
    description: new FormControl(null, [Validators.max(100)]),
    parentCategory: new FormControl<ProductCategoryDto | null>(null),
    metaTitle: new FormControl(null, [Validators.max(100)]),
    metaDescription: new FormControl(null, [Validators.max(100)]),
    categoryId: new FormControl(null, [Validators.required])
  });

  categoryAttributeFormGroup = new FormGroup({
    attributeName: new FormControl(null, [Validators.required, Validators.max(100)]),
    attributeValue: new FormControl(null, [Validators.required, Validators.max(100)])
  })

  categoryAttributeEditFormGroup = new FormGroup({
    attributeNameEdit: new FormControl(null, [Validators.required, Validators.max(100)]),
    attributeValueEdit: new FormControl(null, [Validators.required, Validators.max(100)])
  })

  filteredParentCategory: WritableSignal<any[]> = signal([]);
  allProductCategory: WritableSignal<ProductCategoryDto[]> = signal([]);
  showDialogCreateCategoryAttribute = signal(false);
  showDialogEditCategoryAttribute = signal(false);

  // category attributes
  tableAttributes: WritableSignal<CategoryAttributeDto[]> = signal([]);

  // @ts-ignore
  currentAttributeEdit: WritableSignal<CategoryAttributeDto> = signal(null);

  // update form
  loadingUpdateCategory = signal(false);

  async ngOnInit(): Promise<void> {

    this.productCategoryFormGroup.controls['name'].valueChanges.subscribe(value => {
      if (value) {
        // @ts-ignore
        this.productCategoryFormGroup.controls['url'].setValue(Utilities.toSlug(value));
      }
    })

    await this.keycloakAuthorizationService.onReady();
    this.keycloakAuthorizationService.getPermission('catalog-services', [{
      id: 'CategoryResource'
    }]).then((rpt: string) => {
      this.permissionList = this.keycloakAuthorizationService.getRptPermissions(rpt);
      this.canEditCategory.set(SecurityUtilities.hasPermission('CategoryResource', 'category:edit', this.permissionList));

      if (this.canEditCategory()) {
        // lay thong tin detail
        this.getDetailForm();
      }
    }, () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Get category detail failed'
      });
      this.loadingDetail.set(false);
    }, () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Get category detail failed'
      });
      this.loadingDetail.set(false);
    });
  }

  getDetailForm() {
    this.productCategoryService.getDetailCategory(this.routerActive.snapshot.paramMap.get('categoryId')).subscribe({
      next: value => {
        if (ErrorCode.GW200 == value.errCode) {
          const categoryDto = value.data;
          // @ts-ignore
          this.productCategoryFormGroup.controls['categoryId'].setValue(categoryDto?.categoryId);
          // @ts-ignore
          this.productCategoryFormGroup.controls['name'].setValue(categoryDto?.name);
          // @ts-ignore
          this.productCategoryFormGroup.controls['url'].setValue(categoryDto?.url);
          this.productCategoryFormGroup.controls['activeStartDate'].setValue(moment(categoryDto?.activeStartDate, 'DD/MM/YYYY HH:mm:ss').toDate());
          if (categoryDto?.activeEndDate) {
            this.productCategoryFormGroup.controls['activeEndDate'].setValue(moment(categoryDto?.activeEndDate, 'DD/MM/YYYY HH:mm:ss').toDate());
          }
          // @ts-ignore
          this.productCategoryFormGroup.controls['description'].setValue(categoryDto?.description);
          // @ts-ignore
          this.productCategoryFormGroup.controls['metaTitle'].setValue(categoryDto?.metaTitle);
          // @ts-ignore
          this.productCategoryFormGroup.controls['metaDescription'].setValue(categoryDto?.metaDescription);
          this.tableAttributes.set([]);
          if (categoryDto?.attributes) {
            const attributeMap = new Map(Object.entries(categoryDto?.attributes));
            attributeMap.forEach((value: string, key: string) => {
              this.tableAttributes().push({
                name: key,
                value: value
              })
            })
          }

          this.productCategoryService.findAll().subscribe({
            next: value => {
              if (ErrorCode.GW200 == value.errCode) {
                // @ts-ignore
                this.allProductCategory.set(value.data?.filter(item => item.categoryId !== categoryDto.categoryId));
                // @ts-ignore
                this.productCategoryFormGroup.controls['parentCategory'].setValue(value.data?.find(item => categoryDto?.parentCategory &&
                  (item.categoryId == categoryDto?.parentCategory.categoryId)));
              }
            }, error: err => {

            }, complete: () => {
              this.loadingDetail.set(false);
            }
          })
        }
      }, error: err => {
        this.loadingDetail.set(false);
      }, complete: () => {
      }
    })
  }
  backAllCategoryPage(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/admin/product-category']);
  }

  filterParentCategory(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.allProductCategory() as any[]).length; i++) {
      let categoryItem = (this.allProductCategory() as any[])[i];
      if (categoryItem.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(categoryItem);
      }
    }

    this.filteredParentCategory.set(filtered);
    // this.productCategoryFormGroup.ad
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

  openDialogAddCategoryAttributes() {
    this.showDialogCreateCategoryAttribute.set(true)
  }

  closeCategoryAttributeDialog($event: MouseEvent) {
    $event.stopPropagation();
    this.showDialogCreateCategoryAttribute.set(false);
  }

  saveCategoryAttribute() {
    const attributeName = this.categoryAttributeFormGroup.controls['attributeName'].value;
    const attributeValue = this.categoryAttributeFormGroup.controls['attributeValue'].value;

    this.tableAttributes().push({
      // @ts-ignore
      name: attributeName,
      // @ts-ignore
      value: attributeValue
    })
    this.categoryAttributeFormGroup.reset();
    this.showDialogCreateCategoryAttribute.set(false);
  }

  editCategoryAttribute(attribute: CategoryAttributeDto) {
    this.currentAttributeEdit.set(attribute);
    this.showDialogEditCategoryAttribute.set(true);
    // @ts-ignore
    this.categoryAttributeEditFormGroup.controls['attributeNameEdit'].setValue(attribute.name);
    // @ts-ignore
    this.categoryAttributeEditFormGroup.controls['attributeValueEdit'].setValue(attribute.value);
  }

  closeCategoryAttributeDialogEdit($event: MouseEvent) {
    $event.stopPropagation();
    this.showDialogEditCategoryAttribute.set(false);
    this.categoryAttributeEditFormGroup.reset();
  }

  saveCategoryAttributeEdit() {
    // @ts-ignore
    this.currentAttributeEdit().name = this.categoryAttributeEditFormGroup.controls['attributeNameEdit'].value;
    // @ts-ignore
    this.currentAttributeEdit().value = this.categoryAttributeEditFormGroup.controls['attributeValueEdit'].value;
    this.showDialogEditCategoryAttribute.set(false);
  }

  deleteCategoryAttribute(attribute: CategoryAttributeDto, event: Event) {
    this.confirmService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xoá bản ghi này?',
      header: 'Cảnh báo',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-sm p-button-text",
      acceptButtonStyleClass: "p-button-danger p-button-sm p-button-text",
      accept: () => {
        const indexOfAttributeRemove = this.tableAttributes().indexOf(attribute, 0);
        if (indexOfAttributeRemove !== -1) {
          this.tableAttributes().splice(indexOfAttributeRemove, 1);
        }
      },
      reject: () => {
      }
    });

  }

  async updateCategory($event: Event) {
    $event.stopPropagation();
    this.loadingUpdateCategory.set(true);
    this.productCategoryService.updateCategory({
      // @ts-ignore
      categoryId: this.productCategoryFormGroup.controls['categoryId'].value,
      activeEndDate: this.productCategoryFormGroup.controls['activeEndDate'].value ? formatDate(this.productCategoryFormGroup.controls['activeEndDate'].value, 'dd/MM/yyyy HH:mm:ss', 'vi-VN') : null,
      activeStartDate: this.productCategoryFormGroup.controls['activeStartDate'].value ? formatDate(this.productCategoryFormGroup.controls['activeStartDate'].value, 'dd/MM/yyyy HH:mm:ss', 'vi-VN') : null,
      attributes: this.toStringObject(this.tableAttributes()),
      description: this.productCategoryFormGroup.controls['description'].value,
      metaDescription: this.productCategoryFormGroup.controls['metaDescription'].value,
      metaTitle: this.productCategoryFormGroup.controls['metaTitle'].value,
      name: this.productCategoryFormGroup.controls['name'].value,
      parentCategoryId: this.productCategoryFormGroup.controls['parentCategory'].value?.categoryId,
      // @ts-ignore
      url: this.productCategoryFormGroup.controls['url'].value
    }).subscribe({
      next: (value) => {
        if (value.errCode === ErrorCode.GW200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully Updated',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Update Category Error with message: ' + value.errMessage
          });
        }
      },
      complete: () => {
        this.getDetailForm();
        this.loadingUpdateCategory.set(false);
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Update Category Error'
        });
      }
    })
  }

  toStringObject(listCategoryAttributes: CategoryAttributeDto[]) {
    const jsonObject = {}
    for (let attribute of listCategoryAttributes) {
      // @ts-ignore
      jsonObject[attribute.name] = attribute.value;
    }
    return JSON.stringify(jsonObject);
  }
}
