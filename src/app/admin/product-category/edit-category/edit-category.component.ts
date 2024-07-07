import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {SkeletonModule} from "primeng/skeleton";
import {KeycloakService} from "keycloak-angular";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductCategoryServices} from "../../../services/product-category-services";
import {SecurityUtilities} from "../../../utilities/security-utilities";
import KeycloakAuthorization from "keycloak-js/authz";
import {KeycloakAuthorizationService} from "../../../services/keycloak-authorization-service";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {CalendarModule} from "primeng/calendar";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductCategoryDto} from "../../../dto/product-category-dto";
import {Utilities} from "../../../utilities/utilities";
import {ErrorCode} from "../../../utilities/error-code";
import moment from "moment";
import {sign} from "chart.js/helpers";

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css',
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
    ReactiveFormsModule
  ],
  providers: [MessageService]
})
export class EditCategoryComponent implements OnInit{

  constructor(private keycloakAuthorizationService: KeycloakAuthorizationService, private routerActive: ActivatedRoute,
              private productCategoryService: ProductCategoryServices, private messageService: MessageService, private router: Router) {

  }

  loadingDetail = signal(true);
  permissionList: Array<any> = [];
  canEditCategory = signal(false);

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
    parentCategory: new FormControl<ProductCategoryDto | null>(null),
    metaTitle: new FormControl(null, [Validators.max(100)]),
    metaDescription: new FormControl(null, [Validators.max(100)]),
    categoryId: new FormControl(null, [Validators.required])
  });

  filteredParentCategory: WritableSignal<any[]> = signal([]);
  allProductCategory: ProductCategoryDto[] | null = [];

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

              this.productCategoryService.findAll().subscribe({
                next: value => {
                  if (ErrorCode.GW200 == value.errCode) {
                    // @ts-ignore
                    this.allProductCategory = value.data?.filter(item => item.categoryId !== categoryDto.categoryId);
                    // @ts-ignore
                    this.productCategoryFormGroup.controls['parentCategory'].setValue(value.data?.find(item => categoryDto?.parentCategory &&
                      (item.categoryId == categoryDto?.parentCategory.categoryId) ));
                  }
                }, error: err => {

                }, complete: () => {
                  this.loadingDetail.set(false);
                }
              })
            }
          }, error: err => {

          },complete: () => {

          }
        })
      }
    }, () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Get category detail failed'
      });
    }, () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Get category detail failed'
      });
    });
  }

  backAllCategoryPage(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/admin/product-category']);
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

    this.filteredParentCategory.set(filtered);
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
}
